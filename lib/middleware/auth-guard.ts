import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest, setResponseStatus } from "@tanstack/react-start/server";
import { auth } from "~/lib/server/auth";

// https://tanstack.com/start/latest/docs/framework/react/middleware
// This is a sample middleware that you can use in your server functions.

/**
 * Middleware to force authentication on a server function, and add the user to the context.
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { headers } = getWebRequest()!;

  const session = await auth.api.getSession({
    headers,
    query: {
      // ensure session is fresh
      // https://www.better-auth.com/docs/concepts/session-management#session-caching
      disableCookieCache: true,
    },
  });

  if (!session) {
    setResponseStatus(401);
    throw new Error("Unauthorized");
  }

  return next({ context: { user: session.user } });
});

export const roleAuthMiddleware = (requiredRoles: string[]) => {
  return createMiddleware().server(async ({ next }) => {
    const { headers } = getWebRequest()!;

    const session = await auth.api.getSession({
      headers,
      query: { disableCookieCache: true },
    });

    if (!session) {
      setResponseStatus(401);
      throw new Error("Unauthorized");
    }

    const userRoles = session.user.role || "";

    if (!requiredRoles.includes(userRoles)) {
      setResponseStatus(403);
      throw new Error("Forbidden: Insufficient permissions");
    }

    return next({ context: { user: session.user } });
  });
};

export const adminOnlyFunction = roleAuthMiddleware(["admin", "root"]);

export const rootOnlyFunction = roleAuthMiddleware(["root"]);
