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
    getExpandedRowModel,
    useReactTable,
    ExpandedState,
} from "@tanstack/react-table"
import {
    ArrowUpDown,
    ChevronDown,
    ChevronRight,
    QrCode,
    Copy,
    Calendar,
    BarChart2,
    Share2,
    Lock,
    Ghost,
    Folder,
    LayoutList,
    Layers,
    File,
    Download
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
    subRows?: Url[]; // For grouping
    isBatchParent?: boolean;
    interim_page_enabled?: boolean;
    interim_message?: string;
    interim_duration?: number;
    interim_visit_limit?: number;
    targeting_enabled?: boolean;
    geo_targeting?: Record<string, string>;
    time_targeting?: {
        startTime: string;
        endTime: string;
        days: string[];
        url: string;
    }[];
}

interface UrlDataTableProps {
    data: Url[];
    baseUrl: string;
    onShowQrCode: (url: string) => void;
}

// Helper to group data
function groupUrlsByBatch(data: Url[]): Url[] {
    const batchMap = new Map<string, Url[]>();
    const individualUrls: Url[] = [];

    data.forEach(url => {
        const bulkTag = url.tags?.find(t => t.startsWith('blk'));
        if (bulkTag) {
            if (!batchMap.has(bulkTag)) {
                batchMap.set(bulkTag, []);
            }
            batchMap.get(bulkTag)!.push(url);
        } else {
            individualUrls.push(url);
        }
    });

    const batchRows: Url[] = Array.from(batchMap.entries()).map(([tag, urls]) => {
        // Calculate aggregates
        const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);
        // Date from timestamp in tag blkMMDDYYYYHHMMSS
        // simple parsing
        let dateStr = "Unknown Date";
        try {
            // blk 12 15 2025 07 20 55
            const raw = tag.slice(3);
            if (raw.length >= 8) {
                const month = raw.slice(0, 2);
                const day = raw.slice(2, 4);
                const year = raw.slice(4, 8);
                dateStr = `${month}/${day}/${year}`;
            }
        } catch (e) { }

        return {
            id: `batch_${tag}`,
            short_code: tag, // Display tag as ID
            original_url: `Bulk Upload - ${urls.length} URLs`,
            clicks: totalClicks,
            created_at: urls[0].created_at, // Use first child's date
            tags: [tag],
            subRows: urls,
            isBatchParent: true
        };
    });

    return [...batchRows, ...individualUrls];
}


export function UrlDataTable({ data, baseUrl, onShowQrCode }: UrlDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [expanded, setExpanded] = React.useState<ExpandedState>({})
    const [viewMode, setViewMode] = React.useState<'all' | 'single' | 'groups'>('all')

    // Process data for grouping
    const processedData = React.useMemo(() => {
        // First get everything in the "Grouped" structure (Batches + Individuals)
        const grouped = groupUrlsByBatch(data);
        // Sort everything by date so they are interleaved chronologically
        const allSorted = grouped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        if (viewMode === 'groups') {
            return allSorted.filter(u => u.isBatchParent);
        }
        if (viewMode === 'single') {
            return allSorted.filter(u => !u.isBatchParent);
        }
        // 'all': Return the full interleaved list
        return allSorted;
    }, [data, viewMode]);

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
                    expires_at: editingUrl.expires_at,
                    interim_page_enabled: editingUrl.interim_page_enabled,
                    interim_message: editingUrl.interim_message,
                    interim_duration: editingUrl.interim_duration,
                    interim_visit_limit: editingUrl.interim_visit_limit,
                    targeting_enabled: editingUrl.targeting_enabled,
                    geo_targeting: editingUrl.geo_targeting,
                    time_targeting: editingUrl.time_targeting
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

    const handleDownloadBatch = async (batchRow: Url) => {
        if (!batchRow.subRows || batchRow.subRows.length === 0) return;

        try {
            const xlsx = await import("xlsx");

            const data = batchRow.subRows.map(u => ({
                'Original URL': u.original_url,
                'Short URL': `${baseUrl}/${u.short_code}`,
                'Created At': new Date(u.created_at).toLocaleString()
            }));

            const worksheet = xlsx.utils.json_to_sheet(data);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, "Batch URLs");

            // Generate filename based on batch tag or date
            xlsx.writeFile(workbook, `${batchRow.short_code}_urls.xlsx`);
        } catch (error) {
            console.error("Failed to download batch:", error);
            alert("Failed to generate download.");
        }
    };

    const columns: ColumnDef<Url>[] = [
        {
            accessorKey: "short_code",
            header: "Short Link",
            cell: ({ row }) => {
                const url = row.original;

                if (url.isBatchParent) {
                    return (
                        <div className="flex items-center space-x-2 font-semibold text-gray-700">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 mr-1"
                                onClick={row.getToggleExpandedHandler()}
                            >
                                {row.getIsExpanded() ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </Button>
                            <Folder className="h-4 w-4 text-blue-500 mr-2" />
                            <span>Batch: {url.original_url}</span>
                        </div>
                    )
                }

                return (
                    <div className="flex items-center space-x-2 pl-4 md:pl-0">
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
            cell: ({ row }) => {
                if (row.original.isBatchParent) {
                    return null; // Don't show redundant info
                }
                return (
                    <div className="max-w-[250px] truncate text-muted-foreground" title={row.getValue("original_url")}>
                        {row.getValue("original_url")}
                    </div>
                )
            }
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
                    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${row.original.isBatchParent ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 'bg-green-50 text-green-700 ring-green-600/20'}`}>
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

                // For batch parent, highlight the batch tag
                if (row.original.isBatchParent) {
                    return (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            {tags[0]}
                        </span>
                    )
                }

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
                if (row.original.isBatchParent) return <span className="text-gray-300">-</span>;

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

                if (url.isBatchParent) {
                    return (
                        <div className="flex items-center gap-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                            onClick={() => handleDownloadBatch(url)}
                                            title="Download Excel"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Download Batch Excel</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    );
                }

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

                            {/* Share */}
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
        data: processedData,
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
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows: (row) => row.subRows,
        onExpandedChange: setExpanded,
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
            expanded,
        },
    })

    return (
        <div className="w-full space-y-4">
            {/* Filter and Columns UI remains same */}
            <div className="flex items-center py-4 justify-between gap-4">
                <Input
                    placeholder="Filter URLs, tags, or short codes..."
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />

                <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('single')}
                        className={`h-8 text-xs px-3 ${viewMode === 'single' ? 'shadow-sm bg-white text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        title="Show Individual URLs"
                    >
                        <File className="mr-2 h-3.5 w-3.5" /> Single
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('groups')}
                        className={`h-8 text-xs px-3 ${viewMode === 'groups' ? 'shadow-sm bg-white text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        title="Show Bulk Batches"
                    >
                        <Folder className="mr-2 h-3.5 w-3.5" /> Groups
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('all')}
                        className={`h-8 text-xs px-3 ${viewMode === 'all' ? 'shadow-sm bg-white text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        title="Show All (Mixed)"
                    >
                        <LayoutList className="mr-2 h-3.5 w-3.5" /> All
                    </Button>
                </div>
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
                                    className={`
                                        transition-colors
                                        ${row.depth > 0 ? 'bg-gray-50/50 hover:bg-gray-50/80 ml-4' : 'hover:bg-blue-50/10'}
                                        ${row.original.isBatchParent ? 'bg-blue-50/30 hover:bg-blue-50/50' : ''}
                                    `}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={row.depth > 0 && cell.column.id === 'short_code' ? 'pl-8' : ''}>
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

            {/* Pagination */}
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

            {/* Edit Dialog remains same */}
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

                            <div className="space-y-4 pt-4 border-t">
                                <h4 className="flex items-center text-sm font-medium text-gray-900">
                                    Greeting / Interim Page
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="interim_page_enabled"
                                            checked={editingUrl.interim_page_enabled || false}
                                            onChange={(e) => setEditingUrl({ ...editingUrl, interim_page_enabled: e.target.checked })}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <Label htmlFor="interim_page_enabled" className="text-sm font-normal text-gray-700">
                                            Show an interim page with a message before redirecting
                                        </Label>
                                    </div>
                                </div>

                                {editingUrl.interim_page_enabled && (
                                    <div className="space-y-2 pl-6">
                                        <Label htmlFor="interim_message">Greeting Message</Label>
                                        <textarea
                                            id="interim_message"
                                            rows={3}
                                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            value={editingUrl.interim_message || ""}
                                            onChange={(e) => setEditingUrl({ ...editingUrl, interim_message: e.target.value })}
                                            placeholder="Example: Thanks for visiting! You are being redirected..."
                                        />

                                        <div className="pt-2 flex gap-4">
                                            <div className="flex-1">
                                                <Label htmlFor="interim_duration">Redirect Delay (s)</Label>
                                                <Input
                                                    id="interim_duration"
                                                    type="number"
                                                    min={1}
                                                    max={60}
                                                    className="mt-1"
                                                    value={editingUrl.interim_duration || 5}
                                                    onChange={(e) => setEditingUrl({ ...editingUrl, interim_duration: parseInt(e.target.value) || 5 })}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Label htmlFor="interim_visit_limit">Visitor Limit</Label>
                                                <Input
                                                    id="interim_visit_limit"
                                                    type="number"
                                                    min={0}
                                                    placeholder="0 = Unlimited"
                                                    className="mt-1"
                                                    value={editingUrl.interim_visit_limit || ""}
                                                    onChange={(e) => setEditingUrl({ ...editingUrl, interim_visit_limit: parseInt(e.target.value) || 0 })}
                                                />
                                                <p className="text-[0.7rem] text-muted-foreground mt-1">
                                                    Show only to first N visitors. 0 or empty for unlimited.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h4 className="flex items-center text-sm font-medium text-gray-900">
                                    Smart Targeting (Geo)
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="targeting_enabled"
                                            checked={editingUrl.targeting_enabled || false}
                                            onChange={(e) => setEditingUrl({ ...editingUrl, targeting_enabled: e.target.checked })}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <Label htmlFor="targeting_enabled" className="text-sm font-normal text-gray-700">
                                            Enable Geo-Targeting (Redirect by Country)
                                        </Label>
                                    </div>
                                </div>

                                {editingUrl.targeting_enabled && (
                                    <div className="space-y-3 pl-6">
                                        <p className="text-xs text-muted-foreground">
                                            Add destination URLs for specific countries. Users from these countries will be redirected there instead of the main URL.
                                        </p>

                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="col-span-1">
                                                <Label className="text-xs">Country Code</Label>
                                                <Input
                                                    placeholder="US, GB, IN"
                                                    id="new-geo-code"
                                                    className="h-8 text-xs"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Label className="text-xs">Target URL</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="https://example.com/us"
                                                        id="new-geo-url"
                                                        className="h-8 text-xs"
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        className="h-8 px-2"
                                                        onClick={() => {
                                                            const codeInput = document.getElementById('new-geo-code') as HTMLInputElement;
                                                            const urlInput = document.getElementById('new-geo-url') as HTMLInputElement;
                                                            const code = codeInput.value.toUpperCase().trim();
                                                            const url = urlInput.value.trim();

                                                            if (code && url) {
                                                                const currentGeo = editingUrl.geo_targeting || {};
                                                                setEditingUrl({
                                                                    ...editingUrl,
                                                                    geo_targeting: { ...currentGeo, [code]: url }
                                                                });
                                                                codeInput.value = '';
                                                                urlInput.value = '';
                                                            }
                                                        }}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-2">
                                            {Object.entries(editingUrl.geo_targeting || {}).map(([code, url]) => (
                                                <div key={code} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded border">
                                                    <span className="font-bold w-8">{code}</span>
                                                    <span className="flex-1 truncate text-gray-600" title={url}>{url}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                        onClick={() => {
                                                            const newGeo = { ...editingUrl.geo_targeting };
                                                            delete newGeo[code];
                                                            setEditingUrl({ ...editingUrl, geo_targeting: newGeo });
                                                        }}
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            ))}
                                            {(!editingUrl.geo_targeting || Object.keys(editingUrl.geo_targeting).length === 0) && (
                                                <p className="text-xs text-gray-400 italic">No rules added yet.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h4 className="flex items-center text-sm font-medium text-gray-900">
                                    Time Targeting
                                </h4>
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">
                                        Redirect users based on the time of day and day of the week (User's local time).
                                    </p>

                                    {/* List existing Time Rules */}
                                    <div className="space-y-2">
                                        {(editingUrl.time_targeting || []).map((rule, idx) => (
                                            <div key={idx} className="flex flex-col gap-2 bg-gray-50 p-2 rounded border">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-medium text-xs">
                                                        {rule.days.length === 7 ? "Every day" : rule.days.join(", ")} | {rule.startTime} - {rule.endTime}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                                                        onClick={() => {
                                                            const newRules = [...(editingUrl.time_targeting || [])];
                                                            newRules.splice(idx, 1);
                                                            setEditingUrl({ ...editingUrl, time_targeting: newRules });
                                                        }}
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                                <div className="text-xs text-gray-600 truncate" title={rule.url}>
                                                    → {rule.url}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add New Time Rule */}
                                    <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 space-y-3 mt-2">
                                        <div className="flex gap-2">
                                            <div className="w-1/3">
                                                <Label className="text-xs">Start Time</Label>
                                                <Input
                                                    type="time"
                                                    id="new-time-start"
                                                    className="h-8 text-xs bg-white"
                                                    defaultValue="09:00"
                                                />
                                            </div>
                                            <div className="w-1/3">
                                                <Label className="text-xs">End Time</Label>
                                                <Input
                                                    type="time"
                                                    id="new-time-end"
                                                    className="h-8 text-xs bg-white"
                                                    defaultValue="17:00"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-xs">Days</Label>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                                    <label key={day} className="flex items-center space-x-1 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 rule-day-checkbox"
                                                            value={day}
                                                            defaultChecked={['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day)}
                                                        />
                                                        <span className="text-xs text-gray-600">{day}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-xs">Target URL</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="https://example.com/promo"
                                                    id="new-time-url"
                                                    className="h-8 text-xs bg-white"
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="secondary"
                                                    className="h-8 px-3"
                                                    onClick={() => {
                                                        const startInput = document.getElementById('new-time-start') as HTMLInputElement;
                                                        const endInput = document.getElementById('new-time-end') as HTMLInputElement;
                                                        const urlInput = document.getElementById('new-time-url') as HTMLInputElement;
                                                        const checkboxes = document.querySelectorAll('.rule-day-checkbox') as NodeListOf<HTMLInputElement>;

                                                        const days = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
                                                        const start = startInput.value;
                                                        const end = endInput.value;
                                                        const url = urlInput.value.trim();

                                                        if (start && end && url && days.length > 0) {
                                                            const newRule = {
                                                                startTime: start,
                                                                endTime: end,
                                                                days,
                                                                url
                                                            };
                                                            setEditingUrl({
                                                                ...editingUrl,
                                                                time_targeting: [...(editingUrl.time_targeting || []), newRule]
                                                            });
                                                            urlInput.value = '';
                                                        } else {
                                                            alert("Please fill in all fields and select at least one day.");
                                                        }
                                                    }}
                                                >
                                                    Add Rule
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
        </div >
    )
}
