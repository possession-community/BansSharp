"use no memo";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/lib/components/data-table/data-table-column-header";
import LongText from "~/lib/components/long-text";
import { Badge } from "~/lib/components/ui/badge";
import {
  banStatusInfo,
  banStatusStyles,
  formatDuration,
  muteStatusInfo,
  muteStatusStyles,
  muteTypeInfo,
} from "~/lib/features/simple-admin/data/data";
import { cn, formatDate } from "~/lib/utils";

// Define a union type for violations
type Violation = {
  type: "ban" | "mute";
  id: number;
  player_name: string | null;
  player_steamid: string;
  admin_steamid: string;
  admin_name: string;
  reason: string;
  duration: number;
  ends: string | null;
  created: string;
  server_id: number | null;
  status: string;
  // Ban specific
  player_ip?: string;
  unban_id?: number | null;
  // Mute specific
  unmute_id?: number | null;
  mute_type?: string;
};

export const violationsColumns: ColumnDef<Violation>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge variant="outline" className="capitalize">
          {type}
        </Badge>
      );
    },
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-0 md:table-cell w-[60px]",
      ),
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "player_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const value = row.getValue("player_name") as string | null;
      return <LongText className="max-w-24">{value || "Unknown"}</LongText>;
    },
    meta: { className: "max-w-24" },
  },
  {
    accessorKey: "player_steamid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SteamID" />,
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("player_steamid")}</div>
    ),
    meta: { className: "max-w-36" },
  },
  {
    accessorKey: "reason",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reason" />,
    cell: ({ row }) => <LongText className="max-w-24">{row.getValue("reason")}</LongText>,
    meta: { className: "max-w-24" },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Duration" />,
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number;
      return <div>{formatDuration(duration)}</div>;
    },
    meta: { className: "max-w-24" },
  },
  {
    accessorKey: "created",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const date = row.getValue("created") as string;
      return <div>{formatDate(date)}</div>;
    },
    meta: { className: "max-w-24" },
  },
  {
    accessorKey: "admin_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Admin" />,
    cell: ({ row }) => {
      const value = row.getValue("admin_name") as string | null;
      return <LongText className="max-w-24">{value || "Unknown"}</LongText>;
    },
    meta: { className: "max-w-24" },
  },
  {
    accessorKey: "mute_type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mute" />,
    cell: ({ row }) => {
      const type = row.original.type;
      if (type !== "mute") return null;

      const muteType = row.getValue("mute_type") as string;
      const typeInfo = muteTypeInfo.find((info) => info.value === muteType);

      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {typeInfo?.label || muteType}
          </Badge>
        </div>
      );
    },
    meta: { className: "max-w-20" },
    filterFn: (row, id, value) => {
      if (row.original.type !== "mute") return false;
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const type = row.original.type;
      const status = row.getValue("status") as string;

      let statusInfo;
      let badgeColor;

      if (type === "ban") {
        statusInfo = banStatusInfo.find((info) => info.value === status);
        badgeColor = banStatusStyles.get(status as any);
      } else {
        statusInfo = muteStatusInfo.find((info) => info.value === status);
        badgeColor = muteStatusStyles.get(status as any);
      }

      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("capitalize", badgeColor)}>
            {statusInfo?.label || status}
          </Badge>
        </div>
      );
    },
    meta: { className: "max-w-24" },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
  },
];
