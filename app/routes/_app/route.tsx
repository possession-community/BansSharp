import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "~/lib/components/layout/app-sidebar";
import { Header } from "~/lib/components/layout/header";
import { userRoles } from "~/lib/components/layout/types";
import { ProfileDropdown } from "~/lib/components/profile-dropdown";
import SignInButton from "~/lib/components/sign-in-button";
import ThemeToggle from "~/lib/components/ThemeToggle";
import { SidebarProvider } from "~/lib/components/ui/sidebar";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function RouteComponent() {
  const { user } = Route.useLoaderData();
  const isAuthed = !!user;
  const role: userRoles = user?.role ? (user.role as userRoles) : userRoles.guest;

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar
        role = {role}
        props={{}}
      />
      <div
        id="content"
        className={cn(
          "ml-auto w-full max-w-full",
          "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
          "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
          "transition-[width] duration-200 ease-linear",
          "flex h-svh flex-col",
          "group-data-[scroll-locked=1]/body:h-full",
          "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh",
        )}
      >
        <Header>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            {isAuthed ? <ProfileDropdown user={user} /> : <SignInButton />}
          </div>
        </Header>
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
