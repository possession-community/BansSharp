import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(admin)")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const isAuthed = !!context.user;
    const user = context.user;
    const isAdmin = user?.role === "admin" || user?.role === "root";
    if (!isAuthed || !isAdmin) {
      throw redirect({ to: "/404" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
