"use no memo";

import { Row } from "@tanstack/react-table";
import { Check, Edit, ExternalLink, MoreHorizontal, Trash2, Volume } from "lucide-react";
import { Button } from "~/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/lib/components/ui/dropdown-menu";
import { useSimpleAdmin } from "../context/simple-admin-context";
import { Admin, Ban as BanType, Group, Mute, Warn } from "../data/schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const {
    activeTab,
    setOpen,
    setCurrentBan,
    setCurrentMute,
    setCurrentWarn,
    setCurrentAdmin,
    setCurrentGroup,
  } = useSimpleAdmin();

  const renderActions = () => {
    switch (activeTab) {
      case "bans":
        return renderBanActions(row.original as unknown as BanType);
      case "mutes":
        return renderMuteActions(row.original as unknown as Mute);
      case "warns":
        return renderWarnActions(row.original as unknown as Warn);
      case "admins":
        return renderAdminActions(row.original as unknown as Admin);
      case "groups":
        return renderGroupActions(row.original as unknown as Group);
      default:
        return null;
    }
  };

  const renderBanActions = (ban: BanType) => {
    return (
      <>
        <DropdownMenuItem
          onClick={() => {
            setCurrentBan(ban);
            setOpen("edit-ban");
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        {ban.status === "ACTIVE" && (
          <DropdownMenuItem
            onClick={() => {
              setCurrentBan(ban);
              setOpen("unban");
            }}
          >
            <Check className="mr-2 h-4 w-4" />
            <span>Unban</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            window.open(`https://steamcommunity.com/profiles/${ban.player_steamid}`);
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>Player Steam</span>
        </DropdownMenuItem>
      </>
    );
  };

  const renderMuteActions = (mute: Mute) => {
    return (
      <>
        <DropdownMenuItem
          onClick={() => {
            setCurrentMute(mute);
            setOpen("edit-mute");
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        {mute.status === "ACTIVE" && (
          <DropdownMenuItem
            onClick={() => {
              setCurrentMute(mute);
              setOpen("unmute");
            }}
          >
            <Volume className="mr-2 h-4 w-4" />
            <span>Unmute</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            window.open(`https://steamcommunity.com/profiles/${mute.player_steamid}`);
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>Player Steam</span>
        </DropdownMenuItem>
      </>
    );
  };

  const renderWarnActions = (warn: Warn) => {
    return (
      <>
        <DropdownMenuItem
          onClick={() => {
            setCurrentWarn(warn);
            setOpen("edit-warn");
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            window.open(`https://steamcommunity.com/profiles/${warn.player_steamid}`);
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>Player Steam</span>
        </DropdownMenuItem>
      </>
    );
  };

  const renderAdminActions = (admin: Admin) => {
    return (
      <>
        <DropdownMenuItem
          onClick={() => {
            setCurrentAdmin(admin);
            setOpen("edit-admin");
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentAdmin(admin);
            setOpen("delete-admin");
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            window.open(`https://steamcommunity.com/profiles/${admin.player_steamid}`);
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>Player Steam</span>
        </DropdownMenuItem>
      </>
    );
  };

  const renderGroupActions = (group: Group) => {
    return (
      <>
        <DropdownMenuItem
          onClick={() => {
            setCurrentGroup(group);
            setOpen("edit-group");
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentGroup(group);
            setOpen("delete-group");
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {renderActions()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
