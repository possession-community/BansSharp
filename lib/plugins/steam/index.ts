import { createAuthEndpoint, getSessionFromCtx } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import type {
  AuthPluginSchema,
  BetterAuthPlugin,
  InferOptionSchema,
} from "better-auth/plugins";
import type { User, GenericEndpointContext } from "better-auth/types";
import { APIError } from "better-call";
import { z } from "zod";

/**
 * Interface extending User with Steam-specific fields
 */
export interface UserWithSteam extends User {
  steamId: string;
  steamVerified: boolean;
}

/**
 * Options for Steam authentication plugin
 */
export interface SteamOptions {
  /**
   * Steam API Key
   * Get one from https://steamcommunity.com/dev/apikey
   */
  apiKey: string;

  /**
   * Redirect URL after successful authentication
   * Must match the URL registered in your Steam API settings
   * @default baseURL + "/auth/steam/callback"
   */
  redirectUrl?: string;

  /**
   * Callback when Steam account is verified
   */
  callbackOnVerification?: (
    data: {
      steamId: string;
      user: UserWithSteam;
    },
    request?: Request,
  ) => void | Promise<void>;

  /**
   * Sign up user after Steam verification
   *
   * The user will be signed up with the temporary email
   * and the Steam ID will be updated after verification
   */
  signUpOnVerification?: {
    /**
     * When a user signs up, a temporary email will be needed to be created
     * to sign up the user. This function should return a temporary email
     * for the user given the Steam ID
     *
     * @param steamId
     * @returns string (temporary email)
     */
    getTempEmail: (steamId: string) => string;

    /**
     * When a user signs up, a temporary name will be needed to be created
     * to sign up the user. This function should return a temporary name
     * for the user given the Steam ID
     *
     * @param steamId
     * @returns string (temporary name)
     *
     * @default steamId - the Steam ID will be used as the name
     */
    getTempName?: (steamId: string) => string;
  };

  /**
   * Custom schema for the plugin
   */
  schema?: InferOptionSchema<typeof schema>;
}

/**
 * Steam authentication plugin for Better Auth
 *
 * @param options - Configuration options for the Steam authentication plugin
 * @returns A Better Auth plugin for Steam authentication
 */
export const steam = (options?: SteamOptions) => {
  if (!options?.apiKey) {
    throw new Error("Steam API key is required");
  }

  const opts = {
    ...options,
    steamId: "steamId",
    steamVerified: "steamVerified",
  };

  const ERROR_CODES = {
    INVALID_STEAM_ID: "Invalid Steam ID",
    STEAM_ID_EXIST: "Steam ID already exists",
    UNEXPECTED_ERROR: "Unexpected error",
    FAILED_TO_AUTHENTICATE: "Failed to authenticate with Steam",
  } as const;

  return {
    id: "steam",
    endpoints: {
      signInWithSteam: createAuthEndpoint(
        "/sign-in/steam",
        {
          method: "GET",
          metadata: {
            openapi: {
              summary: "Sign in with Steam",
              description: "Use this endpoint to sign in with Steam",
              responses: {
                302: {
                  description: "Redirect to Steam authentication page",
                },
              },
            },
          },
        },
        async (ctx: GenericEndpointContext) => {
          const baseUrl = ctx.context.baseURL;
          const redirectUrl = options?.redirectUrl || `${baseUrl}/steam/callback`;

          // Redirect to Steam OpenID login
          const steamLoginUrl = new URL("https://steamcommunity.com/openid/login");
          steamLoginUrl.searchParams.append(
            "openid.ns",
            "http://specs.openid.net/auth/2.0",
          );
          steamLoginUrl.searchParams.append("openid.mode", "checkid_setup");
          steamLoginUrl.searchParams.append("openid.return_to", redirectUrl);
          steamLoginUrl.searchParams.append("openid.realm", new URL(redirectUrl).origin);
          steamLoginUrl.searchParams.append(
            "openid.identity",
            "http://specs.openid.net/auth/2.0/identifier_select",
          );
          steamLoginUrl.searchParams.append(
            "openid.claimed_id",
            "http://specs.openid.net/auth/2.0/identifier_select",
          );

          return ctx.redirect(steamLoginUrl.toString());
        },
      ),

      steamCallback: createAuthEndpoint(
        "/steam/callback",
        {
          method: "GET",
          query: z.object({
            "openid.ns": z.string().optional(),
            "openid.mode": z.string().optional(),
            "openid.op_endpoint": z.string().optional(),
            "openid.claimed_id": z.string().optional(),
            "openid.identity": z.string().optional(),
            "openid.return_to": z.string().optional(),
            "openid.response_nonce": z.string().optional(),
            "openid.assoc_handle": z.string().optional(),
            "openid.signed": z.string().optional(),
            "openid.sig": z.string().optional(),
          }),
          metadata: {
            openapi: {
              summary: "Steam authentication callback",
              description: "Callback endpoint for Steam authentication",
              responses: {
                302: {
                  description: "Redirect to application after authentication",
                },
                400: {
                  description: "Invalid authentication response",
                },
              },
            },
          },
        },
        async (ctx: GenericEndpointContext) => {
          try {
            // Verify the authentication response
            const identity = ctx.query["openid.identity"];

            if (!identity) {
              ctx.redirect("/403");
            }

            // Verify the OpenID response using direct verification
            // This ensures the response actually came from Steam
            const verifyParams = new URLSearchParams();
            
            // Copy all openid parameters from the query
            for (const [key, value] of Object.entries(ctx.query)) {
              if (key.startsWith('openid.')) {
                verifyParams.append(key, value as string);
              }
            }
            
            // Change mode to check_authentication for verification
            verifyParams.set('openid.mode', 'check_authentication');
            
            // Verify with Steam OpenID provider
            const verifyResponse = await fetch('https://steamcommunity.com/openid/login', {
              method: 'POST',
              body: verifyParams,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            });
            
            const verifyText = await verifyResponse.text();
            
            // If the response doesn't contain is_valid:true, authentication failed
            if (!verifyText.includes('is_valid:true')) {
              ctx.redirect("/400");
            }

            // Extract Steam ID from the identity URL
            // Format: https://steamcommunity.com/openid/id/76561198XXXXXXXXX
            const steamId = identity.split("/").pop();

            if (!steamId) {
              ctx.redirect("/400");
            }

            // Fetch user data from Steam API
            const steamApiUrl = new URL(
              "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/",
            );
            steamApiUrl.searchParams.append("key", opts.apiKey);
            steamApiUrl.searchParams.append("steamids", steamId);

            const response = await fetch(steamApiUrl.toString());
            const data = await response.json();

            const steamUser = data?.response?.players?.[0];

            if (!steamUser) {
              ctx.redirect("/400");
            }

            // Check if user exists with this Steam ID
            // @ts-ignore
            let user = await ctx.context.adapter.findOne<UserWithSteam>({
              model: "user",
              where: [
                {
                  field: opts.steamId,
                  value: steamId,
                },
              ],
            });

            // If user doesn't exist, check if we should create one
            if (!user) {
              if (options?.signUpOnVerification) {
                // Create a new user with Steam ID
                user = await ctx.context.internalAdapter.createUser(
                  {
                    email: options.signUpOnVerification.getTempEmail(steamId),
                    name: steamUser.personaname || steamId || steamId || "Unknown Name",
                    [opts.steamId]: steamId,
                    [opts.steamVerified]: true,
                    image: steamUser.avatarfull || steamUser.avatar || null,
                  },
                  ctx,
                );

                if (!user) {
                  ctx.redirect("/500");
                }
              } else {
                // Try to update an existing session with Steam ID
                const session = await getSessionFromCtx(ctx);

                if (session) {
                  user = await ctx.context.internalAdapter.updateUser(
                    session.user.id,
                    {
                      [opts.steamId]: steamId,
                      [opts.steamVerified]: true,
                      name: steamUser.personaname || steamId || steamId || "Unknown Name",
                      // Update user avatar if not set
                      image:
                        session.user.image ||
                        steamUser.avatarfull ||
                        steamUser.avatar ||
                        null,
                    },
                    ctx,
                  );
                } else {
                  // No session and no user with this Steam ID
                  ctx.redirect("/400");
                }
              }
            } else {
              // User exists, update Steam verification status
              user = await ctx.context.internalAdapter.updateUser(
                user.id,
                {
                  [opts.steamVerified]: true,
                  name: steamUser.personaname || steamId || steamId || "Unknown Name",
                  // Update user avatar if not set
                  image: user.image || steamUser.avatarfull || steamUser.avatar || null,
                },
                ctx,
              );
            }

            // Create a session for the user
            if (user) {
              await options?.callbackOnVerification?.(
                {
                  steamId,
                  user,
                },
                ctx.request,
              );

              const session = await ctx.context.internalAdapter.createSession(
                user.id,
                ctx.request,
              );

              if (!session) {
                ctx.redirect("/500");
              }

              // Set session cookie
              await setSessionCookie(ctx, {
                session,
                user,
              });

              // Redirect to the application
              return ctx.redirect("/");
            }

            // Redirect to 500 if user is null
            ctx.redirect("/500");
          } catch (error) {
            ctx.context.logger.error("Steam authentication error", error);

            if (error instanceof APIError) {
              throw error;
            }

            ctx.redirect("/403");
          }
        },
      ),

      linkSteamAccount: createAuthEndpoint(
        "/steam/link",
        {
          method: "GET",
          metadata: {
            openapi: {
              summary: "Link Steam account",
              description: "Link a Steam account to an existing user",
              responses: {
                302: {
                  description: "Redirect to Steam authentication page",
                },
                401: {
                  description: "Unauthorized",
                },
              },
            },
          },
        },
        async (ctx: GenericEndpointContext) => {
          // Check if user is authenticated
          const session = await getSessionFromCtx(ctx);

          if (!session) {
            throw new APIError("UNAUTHORIZED", {
              message: ERROR_CODES.FAILED_TO_AUTHENTICATE,
            });
          }

          // Redirect to Steam authentication
          const baseUrl = ctx.context.baseURL;
          const redirectUrl = options?.redirectUrl || `${baseUrl}/steam/callback`;

          // Generate a random state to prevent CSRF attacks
          const state = Math.random().toString(36).substring(2, 15);

          // Store the state in a cookie
          ctx.setCookie("steam_auth_state", state, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 10, // 10 minutes
          });

          // Redirect to Steam OpenID login
          const steamLoginUrl = new URL("https://steamcommunity.com/openid/login");
          steamLoginUrl.searchParams.append(
            "openid.ns",
            "http://specs.openid.net/auth/2.0",
          );
          steamLoginUrl.searchParams.append("openid.mode", "checkid_setup");
          steamLoginUrl.searchParams.append("openid.return_to", redirectUrl);
          steamLoginUrl.searchParams.append("openid.realm", new URL(redirectUrl).origin);
          steamLoginUrl.searchParams.append(
            "openid.identity",
            "http://specs.openid.net/auth/2.0/identifier_select",
          );
          steamLoginUrl.searchParams.append(
            "openid.claimed_id",
            "http://specs.openid.net/auth/2.0/identifier_select",
          );

          return ctx.redirect(steamLoginUrl.toString());
        },
      ),

      unlinkSteamAccount: createAuthEndpoint(
        "/steam/unlink",
        {
          method: "POST",
          metadata: {
            openapi: {
              summary: "Unlink Steam account",
              description: "Unlink a Steam account from an existing user",
              responses: {
                200: {
                  description: "Success",
                },
                401: {
                  description: "Unauthorized",
                },
              },
            },
          },
        },
        async (ctx: GenericEndpointContext) => {
          // Check if user is authenticated
          const session = await getSessionFromCtx(ctx);

          if (!session) {
            throw new APIError("UNAUTHORIZED", {
              message: ERROR_CODES.FAILED_TO_AUTHENTICATE,
            });
          }

          // Update user to remove Steam ID
          const user = await ctx.context.internalAdapter.updateUser(
            session.user.id,
            {
              [opts.steamId]: null,
              [opts.steamVerified]: false,
            },
            ctx,
          );

          if (!user) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: ERROR_CODES.UNEXPECTED_ERROR,
            });
          }

          return ctx.json({
            status: true,
            user: {
              id: user.id,
              email: user.email,
              emailVerified: user.emailVerified,
              name: user.name,
              image: user.image,
              steamId: null as unknown as string, // Type assertion to satisfy UserWithSteam
              steamVerified: false,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            } as UserWithSteam,
          });
        },
      ),
    },
    schema: mergeSchema(schema, options?.schema),
    $ERROR_CODES: ERROR_CODES,
    // Add mergeSchema function definition
  } satisfies BetterAuthPlugin;
};

/**
 * Merges user schema with custom schema
 */
function mergeSchema<S extends AuthPluginSchema>(
  schema: S,
  newSchema?: {
    [K in keyof S]?: {
      modelName?: string;
      fields?: {
        [P: string]: string;
      };
    };
  },
) {
  if (!newSchema) {
    return schema;
  }
  for (const table in newSchema) {
    const newModelName = newSchema[table]?.modelName;
    if (newModelName) {
      schema[table].modelName = newModelName;
    }
    for (const field in schema[table].fields) {
      const newField = newSchema[table]?.fields?.[field];
      if (!newField) {
        continue;
      }
      schema[table].fields[field].fieldName = newField;
    }
  }
  return schema;
}

/**
 * Database schema for Steam authentication
 */
const schema = {
  user: {
    fields: {
      steamId: {
        type: "string",
        required: false,
        unique: true,
        sortable: true,
        returned: true,
      },
      steamVerified: {
        type: "boolean",
        required: false,
        returned: true,
        input: false,
      },
    },
  },
} satisfies AuthPluginSchema;
