import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(admin)/simple-admin/")({
  beforeLoad: async () => {
    // Redirect to the bans page by default
    throw redirect({ to: "/simple-admin/bans" });
  },
});
