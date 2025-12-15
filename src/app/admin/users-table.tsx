"use client";

import { format } from "date-fns";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/lib/db";
import { toast } from "sonner";
import { toggleUserStatus, changeUserPlan } from "./actions";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "username",
        header: "User",
        cell: ({ row }) => (
            <div>
                <div className="font-medium text-gray-900">{row.original.username}</div>
                <div className="text-sm text-gray-500">{row.original.email}</div>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                >
                    {status || "active"}
                </span>
            );
        },
    },
    {
        accessorKey: "plan",
        header: "Plan",
        cell: ({ row }) => {
            const plan = row.getValue("plan") as string;
            return (
                <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plan === "premium"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                        }`}
                >
                    {plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "Freemium"}
                </span>
            );
        },
    },
    {
        accessorKey: "last_login",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Login
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = row.getValue("last_login") as string;
            return date ? format(new Date(date), "PPpp") : "Never";
        },
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => <UserActionsCell user={row.original} />,
    },
];

const UserActionsCell = ({ user }: { user: User }) => {
    const [showBanDialog, setShowBanDialog] = React.useState(false);
    const [showPlanDialog, setShowPlanDialog] = React.useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onSelect={() => setShowBanDialog(true)}
                            className={user.status === 'banned' ? 'text-green-600' : 'text-red-600'}
                        >
                            {user.status === "active" ? "Ban User" : "Unban User"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={() => setShowPlanDialog(true)}
                        >
                            {user.plan === "premium" ? "Downgrade to Freemium" : "Upgrade to Premium"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenuPortal>
            </DropdownMenu>

            <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will <strong>{user.status === "active" ? "ban" : "unban"}</strong> the user <strong>{user.username}</strong>.
                            {user.status === "active" && " They will no longer be able to log in."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                try {
                                    await toggleUserStatus(user.id, user.status || "active");
                                    toast.success(`User ${user.status === "active" ? "banned" : "unbanned"} successfully`);
                                } catch (error) {
                                    toast.error("Failed to update user status");
                                }
                            }}
                            className={user.status === "active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                        >
                            {user.status === "active" ? "Ban User" : "Unban User"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change User Plan</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to <strong>{user.plan === 'premium' ? 'downgrade' : 'upgrade'}</strong> <strong>{user.username}</strong> to <strong>{user.plan === 'premium' ? 'Freemium' : 'Premium'}</strong>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                try {
                                    await changeUserPlan(user.id, user.plan === 'premium' ? 'freemium' : 'premium');
                                    toast.success("User plan updated successfully", {
                                        description: `User ${user.username} is now ${user.plan === 'premium' ? 'Freemium' : 'Premium'}`
                                    });
                                } catch (error) {
                                    toast.error("Failed to update plan");
                                }
                            }}
                        >
                            Confirm Change
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};


export function UsersTable({ data }: { data: User[] }) {
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
                    placeholder="Filter users..."
                    value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("username")?.setFilterValue(event.target.value)
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
