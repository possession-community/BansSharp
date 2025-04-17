"use no memo";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "~/lib/components/data-table/data-table-faceted-filter";
import { DataTableViewOptions } from "~/lib/components/data-table/data-table-view-options";
import { Button } from "~/lib/components/ui/button";
import { Input } from "~/lib/components/ui/input";
import { useSimpleAdmin } from "../context/simple-admin-context";
import {
  banStatusInfo,
  muteStatusInfo,
  muteTypeInfo,
  warnStatusInfo,
} from "../data/data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const { activeTab } = useSimpleAdmin();
  const isFiltered = table.getState().columnFilters.length > 0;

  const isGroup = activeTab === "groups";

  const renderFilters = () => {
    switch (activeTab) {
      case "bans":
        return (
          <>
            {table.getColumn("status") && (
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={banStatusInfo.map((status) => ({
                  label: status.label,
                  value: status.value,
                  icon: status.icon,
                }))}
              />
            )}
          </>
        );
      case "mutes":
        return (
          <>
            {table.getColumn("status") && (
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={muteStatusInfo.map((status) => ({
                  label: status.label,
                  value: status.value,
                  icon: status.icon,
                }))}
              />
            )}
            {table.getColumn("type") && (
              <DataTableFacetedFilter
                column={table.getColumn("type")}
                title="Type"
                options={muteTypeInfo.map((type) => ({
                  label: type.label,
                  value: type.value,
                  icon: type.icon,
                }))}
              />
            )}
          </>
        );
      case "warns":
        return (
          <>
            {table.getColumn("status") && (
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={warnStatusInfo.map((status) => ({
                  label: status.label,
                  value: status.value,
                  icon: status.icon,
                }))}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <Input
            placeholder={`Name...`}
            value={
              (isGroup
                ? (table.getColumn("name")?.getFilterValue() as string)
                : (table.getColumn("player_name")?.getFilterValue() as string)) ?? ""
            }
            onChange={(event) =>
              isGroup
                ? table.getColumn("name")?.setFilterValue(event.target.value)
                : table.getColumn("player_name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {!isGroup ? (
            <Input
              placeholder={`Steam ID...`}
              value={
                (table.getColumn("player_steamid")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("player_steamid")?.setFilterValue(event.target.value)
              }
              className="h-8 w-[150px] lg:w-[250px]"
            />
          ) : null}
        </div>
        {renderFilters()}
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
