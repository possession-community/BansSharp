"use no memo";

import { Row } from "@tanstack/react-table";
import { Edit, ExternalLink, MoreHorizontal } from "lucide-react";
import { Button } from "~/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/lib/components/ui/dropdown-menu";
import { User } from "~/lib/functions/better-auth/users";
import { useUserTable } from "../context/user-table-context";

interface UserTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function UserTableRowActions<TData>({ row }: UserTableRowActionsProps<TData>) {
  const { setCurrentUser, setDialogOpen } = useUserTable();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            setCurrentUser(row.original as unknown as User);
            setDialogOpen("edit-user");
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            const user = row.original as unknown as User;
            if (user.steamId) {
              window.open(
                `https://steamcommunity.com/profiles/${user.steamId}`,
                "_blank",
              );
            }
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>User's Steam</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
