import { createFileRoute, redirect } from "@tanstack/react-router";
import Settings from "~/lib/features/settings";
import { getUsers } from "~/lib/functions/better-auth/users";

export const Route = createFileRoute("/_app/(admin)/settings")({
  beforeLoad: async ({ context }) => {
    const isAuthed = !!context.user;
    const user = context.user;
    const isRoot = user?.role === "root";
    if (!isAuthed || !isRoot) {
      throw redirect({ to: "/404" });
    }
  },
  loader: async () => {
    const users = await getUsers();
    return { users };
  },
  component: Settings,
});
