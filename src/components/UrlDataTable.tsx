"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import {
    ArrowUpDown,
    ChevronDown,
    QrCode,
    Copy,
    Calendar,
    BarChart2,
    Share2,
    Lock,
    Ghost
} from "lucide-react"

import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog"
import { Label } from "./ui/label"
import Link from "next/link"

interface Url {
    id: string;
    short_code: string;
    original_url: string;
    clicks: number;
    created_at: string;
    tags?: string[];
    expires_at?: string | null;
    hasPassword?: boolean;
    cloaked?: boolean;
}

interface UrlDataTableProps {
    data: Url[];
    baseUrl: string;
    onShowQrCode: (url: string) => void;
}

export function UrlDataTable({ data, baseUrl, onShowQrCode }: UrlDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")

    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    const handleCopy = (shortCode: string, id: string) => {
        navigator.clipboard.writeText(`${baseUrl}/${shortCode}`);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleRemovePassword = async (urlId: string) => {
        if (confirm("Are you sure you want to remove the password protection?")) {
            try {
                const res = await fetch("/api/urls/remove-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ urlId }),
                });
                if (res.ok) {
                    window.location.reload();
                }
            } catch (e) {
                console.error("Failed to remove password", e);
            }
        }
    };

    const [editingUrl, setEditingUrl] = React.useState<Url | null>(null);
    const [isUpdateLoading, setIsUpdateLoading] = React.useState(false);

    const handleUpdateUrl = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUrl) return;

        setIsUpdateLoading(true);
        try {
            const res = await fetch("/api/urls/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingUrl.id,
                    original_url: editingUrl.original_url,
                    expires_at: editingUrl.expires_at
                }),
            });

            if (res.ok) {
                window.location.reload();
            } else {
                alert("Failed to update URL");
            }
        } catch (error) {
            console.error("Failed to update URL", error);
            alert("An error occurred while updating");
        } finally {
            setIsUpdateLoading(false);
            setEditingUrl(null);
        }
    };

    const columns: ColumnDef<Url>[] = [
        // ... (previous columns remain unchanged)
        {
            accessorKey: "short_code",
            header: "Short Link",
            cell: ({ row }) => {
                const url = row.original
                return (
                    <div className="flex items-center space-x-2">
                        <a href={`${baseUrl}/${url.short_code}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">
                            {baseUrl}/{url.short_code}
                        </a>
                    </div>
                )
            },
        },
        {
            accessorKey: "original_url",
            header: "Original URL",
            cell: ({ row }) => (
                <div className="max-w-[250px] truncate text-muted-foreground" title={row.getValue("original_url")}>
                    {row.getValue("original_url")}
                </div>
            )
        },
        {
            accessorKey: "clicks",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4 hover:bg-transparent"
                    >
                        Clicks
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium ring-1 ring-inset ring-green-600/20">
                        {row.getValue("clicks")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "tags",
            header: "Tags",
            cell: ({ row }) => {
                const tags = row.original.tags
                if (!tags || tags.length === 0) return <span className="text-muted-foreground text-xs italic">No tags</span>
                return (
                    <div className="flex flex-wrap gap-1">
                        {tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                const tags = row.original.tags || []
                return tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
            }
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4 hover:bg-transparent"
                    >
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return <div className="text-muted-foreground text-sm whitespace-nowrap">{new Date(row.getValue("created_at")).toLocaleDateString("en-US")}</div>
            }
        },
        {
            accessorKey: "expires_at",
            header: "Expires",
            cell: ({ row }) => {
                const expiresAt = row.original.expires_at
                if (!expiresAt) return <span className="text-muted-foreground text-xs">-</span>
                return (
                    <div className="flex items-center text-orange-600 text-xs font-medium whitespace-nowrap">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(expiresAt).toLocaleDateString("en-US")}
                    </div>
                )
            }
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const url = row.original

                return (
                    <div className="flex items-center gap-1">
                        <TooltipProvider>
                            {/* Copy */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => handleCopy(url.short_code, url.id)}
                                    >
                                        {copiedId === url.id ? <span className="text-green-600 font-bold text-xs">✓</span> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Copy Link</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* QR Code */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-purple-600 hover:bg-purple-50"
                                        onClick={() => onShowQrCode(`${baseUrl}/${url.short_code}`)}
                                    >
                                        <QrCode className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>QR Code</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Edit Action */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => setEditingUrl(url)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Share - Tooltip removed to avoid conflicts */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-green-600 hover:bg-green-50" title="Share ...">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Share to</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <a href={`https://wa.me/?text=${encodeURIComponent(`${baseUrl}/${url.short_code}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center cursor-pointer text-green-600">
                                            <span className="w-5 mr-2">WA</span> WhatsApp
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a href={`mailto:?subject=Check out this link&body=${encodeURIComponent(`${baseUrl}/${url.short_code}`)}`} className="flex items-center cursor-pointer text-gray-600">
                                            <span className="w-5 mr-2">✉️</span> Email
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${baseUrl}/${url.short_code}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center cursor-pointer text-blue-700">
                                            <span className="w-5 mr-2">in</span> LinkedIn
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${baseUrl}/${url.short_code}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center cursor-pointer text-blue-400">
                                            <span className="w-5 mr-2">𝕏</span> Twitter
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}/${url.short_code}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center cursor-pointer text-blue-800">
                                            <span className="w-5 mr-2">f</span> Facebook
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Analytics */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button asChild
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50"
                                    >
                                        <Link href={`/analytics/${url.short_code}`}>
                                            <BarChart2 className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>View Analytics</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Password Protection */}
                            {url.hasPassword && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-destructive hover:bg-red-50"
                                            onClick={() => handleRemovePassword(url.id)}
                                        >
                                            <Lock className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Remove Password</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}

                            {/* Cloaked Indicator */}
                            {url.cloaked && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center justify-center w-8 h-8 cursor-help">
                                            <Ghost className="h-4 w-4 text-purple-500" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Cloaked URL</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </TooltipProvider>
                    </div>
                )
            },
        },
    ]

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
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const value = filterValue.toLowerCase();
            const shortCode = (row.getValue("short_code") as string)?.toLowerCase() || "";
            const originalUrl = (row.getValue("original_url") as string)?.toLowerCase() || "";
            const tags = (row.original.tags || []).map(t => t.toLowerCase());

            return shortCode.includes(value) || originalUrl.includes(value) || tags.some(t => t.includes(value));
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    })

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center py-4 justify-between gap-4">
                <Input
                    placeholder="Filter URLs, tags, or short codes..."
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id.replace("_", " ")}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-50/50 hover:bg-gray-50/50">
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
                                    )
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
                                    className="hover:bg-blue-50/10 transition-colors"
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
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
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

            {/* Edit Dialog */}
            <Dialog open={!!editingUrl} onOpenChange={(open) => !open && setEditingUrl(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Link</DialogTitle>
                        <DialogDescription>
                            Make changes to your link here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    {editingUrl && (
                        <form onSubmit={handleUpdateUrl} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="original_url">Original URL</Label>
                                <Input
                                    id="original_url"
                                    value={editingUrl.original_url}
                                    onChange={(e) => setEditingUrl({ ...editingUrl, original_url: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expires_at">Expiration Date</Label>
                                <div className="relative">
                                    <Input
                                        id="expires_at"
                                        type="datetime-local"
                                        value={editingUrl.expires_at ? new Date(editingUrl.expires_at).toISOString().slice(0, 16) : ""}
                                        onChange={(e) => setEditingUrl({ ...editingUrl, expires_at: e.target.value || null })}
                                    />
                                    {editingUrl.expires_at && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                                            onClick={() => setEditingUrl({ ...editingUrl, expires_at: null })}
                                            title="Clear expiration"
                                        >
                                            <span className="text-muted-foreground hover:text-red-500">×</span>
                                        </Button>
                                    )}
                                </div>
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Leave empty for no expiration.
                                </p>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingUrl(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isUpdateLoading}>
                                    {isUpdateLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
