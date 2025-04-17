import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(admin)/simple-admin")({
  loader: async ({ context }) => {
    return {
      user: context.user,
    };
  },
});
