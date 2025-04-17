"use no memo";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/lib/components/data-table/data-table-column-header";
import LongText from "~/lib/components/long-text";
import { Badge } from "~/lib/components/ui/badge";
import { Button } from "~/lib/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/lib/components/ui/popover";
import { cn, formatDate } from "~/lib/utils";
import {
  banStatusInfo,
  banStatusStyles,
  formatDuration,
  muteStatusInfo,
  muteStatusStyles,
  muteTypeInfo,
  warnStatusInfo,
  warnStatusStyles,
} from "../data/data";
import { Admin, Ban, Group, Mute, Server, Warn } from "../data/schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { ScrollArea } from "~/lib/components/ui/scroll-area";

// Common checkbox column
/*
const selectColumn = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="translate-y-[2px]"
    />
  ),
  meta: {
    className: cn(
      "sticky md:table-cell left-0 z-10 rounded-tl",
      "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
    ),
  },
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="translate-y-[2px]"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};
*/

// Common actions column
const actionsColumn = {
  id: "actions",
  cell: DataTableRowActions,
};

// Ban information column definitions
export const banColumns: ColumnDef<Ban>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-[60px]">{row.getValue("id")}</div>,
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-0 md:table-cell w-[60px]",
      ),
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const date = row.getValue("created") as string;
      return <div>{formatDate(date)}</div>;
    },
    meta: { className: "max-w-24" },
  },
  {
    accessorKey: "ends",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ends At" />,
    cell: ({ row }) => {
      const date = row.getValue("ends") as string | null;
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
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusInfo = banStatusInfo.find((info) => info.value === status);
      const badgeColor = banStatusStyles.get(status as any);

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
  actionsColumn,
];

// Mute information column definitions
export const muteColumns: ColumnDef<Mute>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-[60px]">{row.getValue("id")}</div>,
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-0 md:table-cell w-[60px]",
      ),
    },
  },
  {
    accessorKey: "player_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const value = row.getValue("player_name") as string | null;
      return <LongText className="max-w-36">{value || "Unknown"}</LongText>;
    },
    meta: { className: "w-36" },
  },
  {
    accessorKey: "player_steamid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SteamID" />,
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("player_steamid")}</div>
    ),
  },
  {
    accessorKey: "reason",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reason" />,
    cell: ({ row }) => <LongText className="max-w-48">{row.getValue("reason")}</LongText>,
    meta: { className: "w-48" },
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const typeInfo = muteTypeInfo.find((info) => info.value === type);

      return (
        <div className="flex items-center gap-2">
          {typeInfo?.icon && (
            <typeInfo.icon size={16} className="text-muted-foreground" />
          )}
          <span>{typeInfo?.label || type}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Duration" />,
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number;
      return <div>{formatDuration(duration)}</div>;
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const date = row.getValue("created") as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "ends",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ends At" />,
    cell: ({ row }) => {
      const date = row.getValue("ends") as string | null;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "admin_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Admin" />,
    cell: ({ row }) => <div>{row.getValue("admin_name")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusInfo = muteStatusInfo.find((info) => info.value === status);
      const badgeColor = muteStatusStyles.get(status as any);

      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("capitalize", badgeColor)}>
            {statusInfo?.label || status}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
  },
  actionsColumn,
];

// Warning information column definitions
export const warnColumns: ColumnDef<Warn>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-[60px]">{row.getValue("id")}</div>,
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-0 md:table-cell w-[60px]",
      ),
    },
  },
  {
    accessorKey: "player_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Player Name" />,
    cell: ({ row }) => {
      const value = row.getValue("player_name") as string | null;
      return <LongText className="max-w-36">{value || "Unknown"}</LongText>;
    },
    meta: { className: "w-36" },
  },
  {
    accessorKey: "player_steamid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SteamID" />,
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("player_steamid")}</div>
    ),
  },
  {
    accessorKey: "reason",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reason" />,
    cell: ({ row }) => <LongText className="max-w-48">{row.getValue("reason")}</LongText>,
    meta: { className: "w-48" },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Duration" />,
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number;
      return <div>{formatDuration(duration)}</div>;
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const date = row.getValue("created") as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "ends",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ends At" />,
    cell: ({ row }) => {
      const date = row.getValue("ends") as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "admin_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Admin" />,
    cell: ({ row }) => <div>{row.getValue("admin_name")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusInfo = warnStatusInfo.find((info) => info.value === status);
      const badgeColor = warnStatusStyles.get(status as any);

      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("capitalize", badgeColor)}>
            {statusInfo?.label || status}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
  },
  actionsColumn,
];

// Admin information column definitions
export const adminColumns: ColumnDef<Admin>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-[60px]">{row.getValue("id")}</div>,
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-0 md:table-cell w-[60px]",
      ),
    },
  },
  {
    accessorKey: "player_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Player Name" />,
    cell: ({ row }) => {
      const value = row.getValue("player_name") as string | null;
      return <LongText className="max-w-36">{value || "Unknown"}</LongText>;
    },
    meta: { className: "w-36" },
  },
  {
    accessorKey: "player_steamid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SteamID" />,
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("player_steamid")}</div>
    ),
  },
  {
    accessorKey: "flags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Permission Flags" />
    ),
    cell: ({ row }) => {
      const flagsString = row.getValue("flags") as string | null;
      if (!flagsString) return <div>-</div>;
      
      const flags = flagsString.split(",").map(flag => flag.trim()).filter(Boolean);
      if (flags.length === 0) return <div>-</div>;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-auto p-1 font-normal">
              <div className="flex flex-wrap gap-1">
                click to view
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <ScrollArea className="h-64 w-32 rounded-md">
              <div className="grid space-y-0 items-center">
                <h4 className="font-small">Admin has:</h4>
                {flags.map((flag) => {
                  return (
                    <div className="font-mono text-center">{flag}</div>
                  );
                })}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "immunity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Immunity Level" />
    ),
    cell: ({ row }) => <div>{row.getValue("immunity")}</div>,
  },
  {
    accessorKey: "group_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Group ID" />,
    cell: ({ row }) => {
      const groupId = row.getValue("group_id") as number | null;
      return <div>{groupId || "-"}</div>;
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const date = row.getValue("created") as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "ends",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ends At" />,
    cell: ({ row }) => {
      const date = row.getValue("ends") as string | null;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "server_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Server ID" />,
    cell: ({ row }) => {
      const serverId = row.getValue("server_id") as number | null;
      return <div>{serverId || "All"}</div>;
    },
  },
  actionsColumn,
];

// Group information column definitions
// Server information column definitions
export const serverColumns: ColumnDef<Server>[] = [
  {
    accessorKey: "hostname",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Server Name" />,
    cell: ({ row }) => {
      const value = row.getValue("hostname") as string | null;
      return <div>{value || "Unknown"}</div>;
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
    accessorKey: "address",
    header: ({ column }) => <DataTableColumnHeader column={column} title="IP:Port" />,
    cell: ({ row }) => <div>{row.getValue("address")}</div>,
  },
  {
    accessorKey: "mapName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Map" />,
    cell: ({ row }) => {
      const value = row.getValue("mapName") as string | null;
      return <div>{value || "Unknown"}</div>;
    },
  },
  {
    accessorKey: "playerCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Players" />,
    cell: ({ row }) => {
      const value = row.getValue("playerCount") as number | null;
      return <div>{value !== null ? value : "0"}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const server = row.original;

      return (
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const address = server.address as string;
              window.open(`steam://connect/${address}`);
            }}
          >
            Connect
          </Button>
        </div>
      );
    },
  },
];

export const groupColumns: ColumnDef<Group>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-[60px]">{row.getValue("id")}</div>,
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Group Name" />,
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "immunity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Immunity Level" />
    ),
    cell: ({ row }) => <div>{row.getValue("immunity")}</div>,
  },
  {
    accessorKey: "flags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Permission Flags" />
    ),
    cell: ({ row }) => {
      const flags = row.getValue("flags") as string[] | undefined;
      if (!flags || flags.length === 0) return <div>-</div>;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-auto p-1 font-normal">
              <div className="flex flex-wrap gap-1">
                click to view
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <ScrollArea className="h-64 w-32 rounded-md">
              <div className="grid space-y-0 items-center">
                <h4 className="font-small">Group has:</h4>
                {flags.map((flag) => (
                  <div key={flag} className="font-mono text-center">{flag}</div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "serverIds",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Servers" />,
    cell: ({ row }) => {
      const serverIds = row.getValue("serverIds") as number[] | undefined;
      if (!serverIds || serverIds.length === 0) return <div>-</div>;

      return (
        <div className="flex items-center">
          <Badge variant="outline">{serverIds.length} server(s)</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const date = row.getValue("created") as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  actionsColumn,
];
