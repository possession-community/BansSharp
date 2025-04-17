"use no memo";

import { getRouteApi } from "@tanstack/react-router";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTablePagination } from "~/lib/components/data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import { useSimpleAdmin } from "../context/simple-admin-context";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  adminColumns,
  banColumns,
  groupColumns,
  muteColumns,
  warnColumns,
} from "./simple-admin-columns";

interface SimpleAdminTableProps {
  whichTable: string;
  className?: string;
}

export function SimpleAdminTable({ whichTable, className }: SimpleAdminTableProps) {
  const { activeTab, setActiveTab } = useSimpleAdmin();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  let data: any[] = [];
  let columns: ColumnDef<unknown>[] = [];

  // Get data based on the active tab
  try {
    if (whichTable === "bans") {
      const routeApi = getRouteApi("/_app/(admin)/simple-admin/bans/");
      const { bansData } = routeApi.useLoaderData();
      setActiveTab("bans");
      data = bansData;
      columns = banColumns as ColumnDef<unknown>[];
    } else if (whichTable === "mutes") {
      const routeApi = getRouteApi("/_app/(admin)/simple-admin/mutes/");
      const { mutesData } = routeApi.useLoaderData();
      setActiveTab("mutes");
      data = mutesData;
      columns = muteColumns as ColumnDef<unknown>[];
    } else if (whichTable === "warns") {
      const routeApi = getRouteApi("/_app/(admin)/simple-admin/warns/");
      const { warnsData } = routeApi.useLoaderData();
      setActiveTab("warns");
      data = warnsData;
      columns = warnColumns as ColumnDef<unknown>[];
    } else if (whichTable === "admins") {
      const routeApi = getRouteApi("/_app/(admin)/simple-admin/admins/");
      const { adminsData } = routeApi.useLoaderData();
      setActiveTab("admins");
      data = adminsData;
      columns = adminColumns as ColumnDef<unknown>[];
    } else if (whichTable === "groups") {
      const routeApi = getRouteApi("/_app/(admin)/simple-admin/groups/");
      const { groupsData } = routeApi.useLoaderData();
      setActiveTab("groups");
      data = groupsData;
      columns = groupColumns as ColumnDef<unknown>[];
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    enableRowSelection: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.className ?? ""}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="group/row">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ""}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
