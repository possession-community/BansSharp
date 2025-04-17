"use no memo";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "~/lib/components/data-table/data-table-faceted-filter";
import { DataTableViewOptions } from "~/lib/components/data-table/data-table-view-options";
import { Button } from "~/lib/components/ui/button";
import { Input } from "~/lib/components/ui/input";
import {
  banStatusInfo,
  muteStatusInfo,
  muteTypeInfo,
} from "~/lib/features/simple-admin/data/data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <Input
            placeholder="Name..."
            value={(table.getColumn("player_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("player_name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <Input
            placeholder="Steam ID..."
            value={(table.getColumn("player_steamid")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("player_steamid")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {table.getColumn("type") && (
            <DataTableFacetedFilter
              column={table.getColumn("type")}
              title="Type"
              options={[
                { label: "ban", value: "ban" },
                { label: "mute", value: "mute" },
              ]}
            />
          )}
          {table.getColumn("mute_type") && (
            <DataTableFacetedFilter
              column={table.getColumn("mute_type")}
              title="Mute"
              options={muteTypeInfo.map((type) => ({
                label: type.label,
                value: type.value,
                icon: type.icon,
              }))}
            />
          )}
        </div>
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              ...banStatusInfo.map((status) => ({
                label: status.label,
                value: status.value,
                icon: status.icon,
              })),
              ...muteStatusInfo
                .filter((status) => !banStatusInfo.some((b) => b.value === status.value))
                .map((status) => ({
                  label: status.label,
                  value: status.value,
                  icon: status.icon,
                })),
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset Filters
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
