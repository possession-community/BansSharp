import { createAuthClient } from "better-auth/react";
import { steamClient } from "../plugins/steam/client";

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
  plugins: [steamClient()],
});

export default authClient;
