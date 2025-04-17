import {
  IconHelp,
  IconLayoutDashboard,
  IconSettings,
  IconShield,
  IconTool,
} from "@tabler/icons-react";
import { Ban, Group, HeadphoneOff, MessageCircleWarning, ShieldUser } from "lucide-react";
import { type SidebarData } from "../types";

export const guestSidebarData: SidebarData = {
  navGroups: [
    {
      title: "",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: IconLayoutDashboard,
        },
        {
          title: "Violations",
          url: "/violations",
          icon: Ban,
        },
      ],
    },
    {
      title: "",
      items: [
        {
          title: "About",
          url: "/about",
          icon: IconHelp,
        },
      ],
    },
  ],
};

export const adminSidebarData: SidebarData = {
  navGroups: [
    {
      title: "",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: IconLayoutDashboard,
        },
        {
          title: "Violations",
          url: "/violations",
          icon: Ban,
        },
        {
          title: "Admin",
          icon: IconShield,
          items: [
            {
              title: "Bans",
              url: "/simple-admin/bans",
              icon: Ban,
            },
            {
              title: "Mutes",
              url: "/simple-admin/mutes",
              icon: HeadphoneOff,
            },
            {
              title: "Warns",
              url: "/simple-admin/warns",
              icon: MessageCircleWarning,
            },
          ],
        },
      ],
    },
    {
      title: "",
      items: [
        {
          title: "About",
          url: "/about",
          icon: IconHelp,
        },
      ],
    },
  ],
};

export const rootSidebarData: SidebarData = {
  navGroups: [
    {
      title: "",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: IconLayoutDashboard,
        },
        {
          title: "Violations",
          url: "/violations",
          icon: Ban,
        },
        {
          title: "Admin",
          icon: IconShield,
          items: [
            {
              title: "Bans",
              url: "/simple-admin/bans",
              icon: Ban,
            },
            {
              title: "Mutes",
              url: "/simple-admin/mutes",
              icon: HeadphoneOff,
            },
            {
              title: "Warns",
              url: "/simple-admin/warns",
              icon: MessageCircleWarning,
            },
            {
              title: "Admins",
              url: "/simple-admin/admins",
              icon: ShieldUser,
            },
            {
              title: "Groups",
              url: "/simple-admin/groups",
              icon: Group,
            },
          ],
        },
      ],
    },
    {
      title: "",
      items: [
        {
          title: "Settings",
          icon: IconSettings,
          items: [
            {
              title: "Account",
              url: "/settings",
              icon: IconTool,
            },
          ],
        },
        {
          title: "About",
          url: "/about",
          icon: IconHelp,
        },
      ],
    },
  ],
};
