"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Url } from "@/lib/db";
import { toggleUrlStatus } from "./actions";

export const columns: ColumnDef<Url>[] = [
    {
        accessorKey: "original_url",
        header: "URL",
        cell: ({ row }) => (
            <div>
                <div className="text-sm text-blue-600 hover:underline">
                    <a
                        href={`${process.env.NEXT_PUBLIC_BASE_URL || ""}/${row.original.short_code}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        /{row.original.short_code}
                    </a>
                </div>
                <div
                    className="text-xs text-gray-500 truncate max-w-[250px]"
                    title={row.original.original_url}
                >
                    {row.original.original_url}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "clicks",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Clicks
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="pl-4">{row.getValue("clicks")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === "removed"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                        }`}
                >
                    {status || "active"}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
            const url = row.original;
            return (
                <Button
                    variant="ghost"
                    className={`${url.status !== "removed"
                        ? "text-red-600 hover:text-red-900"
                        : "text-green-600 hover:text-green-900"
                        }`}
                    onClick={() => toggleUrlStatus(url.id, url.status || "active")}
                >
                    {url.status !== "removed" ? "Remove" : "Restore"}
                </Button>
            );
        },
    },
];

export function UrlsTable({ data }: { data: Url[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter original URLs..."
                    // Note: Filtering by 'original_url' but the column accessor is 'short_code' for display. 
                    // We need to add a accessorFn or just filter by global filter, but keeping it simple:
                    // I'll add a 'original_url' column that is hidden or use a custom filter function?
                    // Easiest is to strictly filter, but standard setup filters by column ID.
                    // 'original_url' isn't a column key explicitly in the columns array above (accessorKey is 'short_code' for the first col).
                    // Actually, I can filter by 'short_code' easily.
                    // To filter by original_url, I should probably expose it as a column or use `globalFilter`.
                    // Let's filter by short_code for now as it's the primary accessor.
                    // Wait, users probably want to search by the destination URL.
                    // I will change the accessorKey or add a custom id.
                    value={(table.getColumn("original_url")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("original_url")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
