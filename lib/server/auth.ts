import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { steam } from "../plugins/steam";

import { db } from "./db";

export const auth = betterAuth({
  baseURL: process.env.VITE_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "mysql",
  }),

  // https://www.better-auth.com/docs/concepts/session-management
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },

  plugins: [
    admin({
      adminRoles: ["admin", "root"],
    }),
    steam({
      apiKey: process.env.STEAM_API_KEY || "",
      signUpOnVerification: {
        getTempEmail: (steamId) => `${steamId}`,
        getTempName: (steamId) => `${steamId}`,
      },
    }),
  ],
});
