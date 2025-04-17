"use no memo";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/lib/components/data-table/data-table-column-header";
import LongText from "~/lib/components/long-text";
import { Badge } from "~/lib/components/ui/badge";
import { User } from "~/lib/functions/better-auth/users";
import { cn, formatDate } from "~/lib/utils";
import { UserTableRowActions } from "./user-table-row-actions";

// Common actions column
const actionsColumn = {
  id: "actions",
  cell: UserTableRowActions,
};

// User table column definitions
export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "steamId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Steam ID" />,
    cell: ({ row }) => {
      const value = row.getValue("steamId") as string | null;
      return <div className="font-mono text-xs">{value || "-"}</div>;
    },
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-0 md:table-cell w-[60px]",
      ),
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const value = row.getValue("name") as string;
      return <LongText className="max-w-36">{value || "Unknown"}</LongText>;
    },
    meta: { className: "w-36" },
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const role = row.getValue("role") as string | null;
      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "capitalize",
              role === "root"
                ? "border-red-500 text-red-500"
                : role === "admin"
                  ? "border-blue-500 text-blue-500"
                  : "",
            )}
          >
            {role || "User"}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "banned",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const banned = row.getValue("banned") as boolean | null;
      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "capitalize",
              banned ? "border-red-500 text-red-500" : "border-green-500 text-green-500",
            )}
          >
            {banned ? "Banned" : "Active"}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "banReason",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ban Reason" />,
    cell: ({ row }) => {
      const value = row.getValue("banReason") as string | null;
      return <LongText className="max-w-48">{value || "-"}</LongText>;
    },
    meta: { className: "w-48" },
  },
  {
    accessorKey: "banExpires",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ban Expires" />,
    cell: ({ row }) => {
      const date = row.getValue("banExpires") as string | null;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  actionsColumn,
];
