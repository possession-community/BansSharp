import type { BetterAuthClientPlugin } from "better-auth/client";
import type { steam } from ".";

/**
 * Steam authentication client plugin for Better Auth
 *
 * This plugin provides client-side functionality for Steam authentication
 *
 * @returns A Better Auth client plugin for Steam authentication
 */
export const steamClient = () => {
  return {
    id: "steam",
    $InferServerPlugin: {} as ReturnType<typeof steam>,
    atomListeners: [
      {
        matcher(path) {
          return (
            path === "/steam/callback" ||
            path === "/steam/link" ||
            path === "/steam/unlink"
          );
        },
        signal: "$sessionSignal",
      },
    ],
    getActions: ($fetch) => {
      return {
        /**
         * Sign in with Steam
         * Redirects the user to Steam's authentication page
         */
        signInWithSteam: async () => {
          // Redirect to the Steam sign-in endpoint
          window.location.href = "/api/auth/sign-in/steam";
          return { data: null };
        },

        /**
         * Link a Steam account to the current user
         * Redirects the user to Steam's authentication page
         */
        linkSteamAccount: async () => {
          // Redirect to the Steam link endpoint
          window.location.href = "/api/auth/steam/link";
          return { data: null };
        },

        /**
         * Unlink a Steam account from the current user
         */
        unlinkSteamAccount: async () => {
          const response = await $fetch("/steam/unlink", {
            method: "POST",
          });
          return response;
        },
      };
    },
  } satisfies BetterAuthClientPlugin;
};
