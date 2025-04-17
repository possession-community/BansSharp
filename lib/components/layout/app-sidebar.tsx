import { ServerCog } from "lucide-react";
import { NavGroup } from "~/lib/components/layout/nav-group";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/lib/components/ui/sidebar";
import { adminSidebarData, guestSidebarData, rootSidebarData } from "./data/sidebar-data";
import { userRoles } from "./types";

interface AppSidebarProps {
  role: userRoles;
  props: React.ComponentProps<typeof Sidebar>;
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ServerCog className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Bans Sharp</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {role == userRoles.admin || role == userRoles.root ? (
        role == userRoles.root ? (
          //{/* Root */}
          <SidebarContent>
            {rootSidebarData.navGroups.map((props) => (
              <NavGroup key={props.title} {...props} />
            ))}
          </SidebarContent>
        ) : (
          //{/* Admin */}
          <SidebarContent>
            {adminSidebarData.navGroups.map((props) => (
              <NavGroup key={props.title} {...props} />
            ))}
          </SidebarContent>
        )
      ) : (
        //{/* Guest */}
        <SidebarContent>
          {guestSidebarData.navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </SidebarContent>
      )}

      {/*
        <SidebarFooter>
          <NavUser user={sidebarData.user} />
        </SidebarFooter>
      */}
    </Sidebar>
  );
}
