// // src/features/activity-logs/components/ActivityLogsTable.tsx
// import * as React from "react";
// import { useMemo, useState } from "react";
// import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
// import {
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     useReactTable,
// } from "@tanstack/react-table";
// import {
//     ArrowUpDown,
//     Activity,
//     PlusCircle,
//     Edit3,
//     Trash2,
//     RotateCcw,
//     CalendarDays,
//     Sun,
//     Calendar,
//     CalendarClock,
//     Globe,
//     Smartphone,
//     Tablet,
//     Monitor,
//     Server,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";

// import { useAuthContext } from "@/hooks/AuthContext";

// import { TheActivityLogs } from "@/lib/mockData";
// import { ActivityLogsColumns } from "../columns/activityLogsColumn";

// export function ActivityLogsTable() {
//     const data = TheActivityLogs
//     const { role } = useAuthContext();

//     const [globalFilter, setGlobalFilter] = useState("");
//     const [actionFilter, setActionFilter] = useState("all");
//     const [tableFilter, setTableFilter] = useState("all");
//     const [dateRange, setDateRange] = useState("all");
//     const [fromDate, setFromDate] = useState("");
//     const [toDate, setToDate] = useState("");

//     const resetFilters = () => {
//         setGlobalFilter("");
//         setActionFilter("all");
//         setTableFilter("all");
//         setDateRange("all");
//         setFromDate("");
//         setToDate("");
//     };

//     const filteredData = useMemo(() => {
//         let filtered = [...data];

//         if (actionFilter !== "all") {
//             filtered = filtered.filter((log) => log.action === actionFilter);
//         }

//         if (tableFilter !== "all") {
//             filtered = filtered.filter((log) => log.table_name === tableFilter);
//         }

//         const logDate = (d) => new Date(d);

//         if (fromDate || toDate) {
//             filtered = filtered.filter((log) => {
//                 const ld = logDate(log.created_at);
//                 const from = fromDate ? startOfDay(logDate(fromDate)) : null;
//                 const to = toDate ? endOfDay(logDate(toDate)) : null;

//                 const afterFrom = from ? isAfter(ld, from) || ld.getTime() === from.getTime() : true;
//                 const beforeTo = to ? isBefore(ld, to) || ld.getTime() === to.getTime() : true;

//                 return afterFrom && beforeTo;
//             });
//         } else if (dateRange !== "all") {
//             const now = new Date();
//             if (dateRange === "today") {
//                 const today = format(now, "yyyy-MM-dd");
//                 filtered = filtered.filter(
//                     (log) => format(logDate(log.created_at), "yyyy-MM-dd") === today
//                 );
//             } else if (dateRange === "7d") {
//                 const weekAgo = new Date(now.setDate(now.getDate() - 7));
//                 filtered = filtered.filter((log) => logDate(log.created_at) >= weekAgo);
//             } else if (dateRange === "30d") {
//                 const monthAgo = new Date(now.setDate(now.getDate() - 30));
//                 filtered = filtered.filter((log) => logDate(log.created_at) >= monthAgo);
//             }
//         }

//         return filtered;
//     }, [data, actionFilter, tableFilter, dateRange, fromDate, toDate]);

//     const columns = React.useMemo(
//         () => ActivityLogsColumns(role),
//         [role]
//     );

//     const table = useReactTable({
//         data: filteredData,
//         columns,
//         state: { globalFilter },
//         onGlobalFilterChange: setGlobalFilter,
//         getCoreRowModel: getCoreRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//     });

//     return (
//         <div className="space-y-4 p-4">
//             <Card className="p-4">
//                 <div className="lg:col-span-2">
//                     <Label>Search anything</Label>
//                     <Input
//                         placeholder="User, IP, table..."
//                         value={globalFilter}
//                         onChange={(e) => setGlobalFilter(e.target.value)}
//                         className="mt-1"
//                     />
//                 </div>
//                 <div className="flex items-center justify-between gap-4">
//                     <div>
//                         <Label>Action</Label>
//                         <Select value={actionFilter} onValueChange={setActionFilter}>
//                             <SelectTrigger className="mt-1">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="all">All Actions</SelectItem>
//                                 <SelectItem value="created">
//                                     <div className="flex items-center gap-2">
//                                         <PlusCircle className="h-3.5 w-3.5 text-green-600" /> Created
//                                     </div>
//                                 </SelectItem>
//                                 <SelectItem value="updated">
//                                     <div className="flex items-center gap-2">
//                                         <Edit3 className="h-3.5 w-3.5 text-blue-600" /> Updated
//                                     </div>
//                                 </SelectItem>
//                                 <SelectItem value="deleted">
//                                     <div className="flex items-center gap-2">
//                                         <Trash2 className="h-3.5 w-3.5 text-red-600" /> Deleted
//                                     </div>
//                                 </SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div>
//                         <Label>Table</Label>
//                         <Select value={tableFilter} onValueChange={setTableFilter}>
//                             <SelectTrigger className="mt-1">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="all">All Tables</SelectItem>
//                                 {["offers", "quotes", "invoices", "services", "clients", "payments", "projects", "tickets", "settings"].map((t) => (
//                                     <SelectItem key={t} value={t}>
//                                         {t}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div>
//                         <Label>Date Range</Label>
//                         <Select value={dateRange} onValueChange={setDateRange}>
//                             <SelectTrigger className="mt-1">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="all">
//                                     <div className="flex items-center gap-2">
//                                         <CalendarDays className="h-3.5 w-3.5" /> All Time
//                                     </div>
//                                 </SelectItem>
//                                 <SelectItem value="today">
//                                     <div className="flex items-center gap-2">
//                                         <Sun className="h-3.5 w-3.5 text-orange-600" /> Today
//                                     </div>
//                                 </SelectItem>
//                                 <SelectItem value="7d">Last 7 Days</SelectItem>
//                                 <SelectItem value="30d">Last 30 Days</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>



//                     <div>
//                         <Label>From</Label>
//                         <Input
//                             type="date"
//                             value={fromDate}
//                             onChange={(e) => {
//                                 setFromDate(e.target.value);
//                                 if (dateRange !== "all") setDateRange("all");
//                             }}
//                         />
//                     </div>
//                     <div>
//                         <Label>To</Label>
//                         <Input
//                             type="date"
//                             value={toDate}
//                             min={fromDate}
//                             onChange={(e) => {
//                                 setToDate(e.target.value);
//                                 if (dateRange !== "all") setDateRange("all");
//                             }}
//                         />
//                     </div>
//                     <div>
//                         <Label>Reset</Label>
//                         <Button onClick={resetFilters} className="w-full mt-1 cursor-pointer">
//                             <RotateCcw className="mr-2 h-4 w-4" /> Reset
//                         </Button>
//                     </div>
//                 </div>
//             </Card>

//             {/* Table */}
//             <div className="rounded-md border bg-white overflow-hidden">
//                 <Table>
//                     <TableHeader>
//                         {table.getHeaderGroups().map((headerGroup) => (
//                             <TableRow key={headerGroup.id}>
//                                 {headerGroup.headers.map((header) => (
//                                     <TableHead key={header.id}>
//                                         {header.isPlaceholder
//                                             ? null
//                                             : flexRender(header.column.columnDef.header, header.getContext())}
//                                     </TableHead>
//                                 ))}
//                             </TableRow>
//                         ))}
//                     </TableHeader>
//                     <TableBody>
//                         {table.getRowModel().rows?.length ? (
//                             table.getRowModel().rows.map((row) => (
//                                 <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
//                                     {row.getVisibleCells().map((cell) => (
//                                         <TableCell key={cell.id}>
//                                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
//                                     No activity logs found.
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>

//             {/* Pagination */}
//             <div className="flex items-center justify-between">
//                 <div className="text-sm text-muted-foreground">
//                     Showing {table.getFilteredRowModel().rows.length} of {data.length} logs
//                 </div>
//                 <div className="flex gap-2">
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => table.previousPage()}
//                         disabled={!table.getCanPreviousPage()}
//                     >
//                         Previous
//                     </Button>
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => table.nextPage()}
//                         disabled={!table.getCanNextPage()}
//                     >
//                         Next
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }
// src/features/activity-logs/components/ActivityLogsTable.tsx
import * as React from "react";
import { useMemo, useState } from "react";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    Activity,
    PlusCircle,
    Edit3,
    Trash2,
    RotateCcw,
    CalendarDays,
    Sun,
    Calendar,
    CalendarClock,
    Globe,
    Smartphone,
    Tablet,
    Monitor,
    Server,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useAuthContext } from "@/hooks/AuthContext";

import { TheActivityLogs } from "@/lib/mockData";
import { ActivityLogsColumns } from "../columns/activityLogsColumn";
import { DataTable } from "@/components/table/DataTable";
import { TablePagination } from "@/components/table/TablePagination";

export function ActivityLogsTable() {
    const data = TheActivityLogs
    const { role } = useAuthContext();

    const [globalFilter, setGlobalFilter] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [tableFilter, setTableFilter] = useState("all");
    const [dateRange, setDateRange] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const resetFilters = () => {
        setGlobalFilter("");
        setActionFilter("all");
        setTableFilter("all");
        setDateRange("all");
        setFromDate("");
        setToDate("");
    };

    const filteredData = useMemo(() => {
        let filtered = [...data];

        if (actionFilter !== "all") {
            filtered = filtered.filter((log) => log.action === actionFilter);
        }

        if (tableFilter !== "all") {
            filtered = filtered.filter((log) => log.table_name === tableFilter);
        }

        const logDate = (d) => new Date(d);

        if (fromDate || toDate) {
            filtered = filtered.filter((log) => {
                const ld = logDate(log.created_at);
                const from = fromDate ? startOfDay(logDate(fromDate)) : null;
                const to = toDate ? endOfDay(logDate(toDate)) : null;

                const afterFrom = from ? isAfter(ld, from) || ld.getTime() === from.getTime() : true;
                const beforeTo = to ? isBefore(ld, to) || ld.getTime() === to.getTime() : true;

                return afterFrom && beforeTo;
            });
        } else if (dateRange !== "all") {
            const now = new Date();
            if (dateRange === "today") {
                const today = format(now, "yyyy-MM-dd");
                filtered = filtered.filter(
                    (log) => format(logDate(log.created_at), "yyyy-MM-dd") === today
                );
            } else if (dateRange === "7d") {
                const weekAgo = new Date(now.setDate(now.getDate() - 7));
                filtered = filtered.filter((log) => logDate(log.created_at) >= weekAgo);
            } else if (dateRange === "30d") {
                const monthAgo = new Date(now.setDate(now.getDate() - 30));
                filtered = filtered.filter((log) => logDate(log.created_at) >= monthAgo);
            }
        }

        return filtered;
    }, [data, actionFilter, tableFilter, dateRange, fromDate, toDate]);

    const columns = React.useMemo(
        () => ActivityLogsColumns(role),
        [role]
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-4 p-4">
            <Card className="p-4">
                <div className="lg:col-span-2">
                    <Label>Search anything</Label>
                    <Input
                        placeholder="User, IP, table..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <Label>Action</Label>
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="created">
                                    <div className="flex items-center gap-2">
                                        <PlusCircle className="h-3.5 w-3.5 text-green-600" /> Created
                                    </div>
                                </SelectItem>
                                <SelectItem value="updated">
                                    <div className="flex items-center gap-2">
                                        <Edit3 className="h-3.5 w-3.5 text-blue-600" /> Updated
                                    </div>
                                </SelectItem>
                                <SelectItem value="deleted">
                                    <div className="flex items-center gap-2">
                                        <Trash2 className="h-3.5 w-3.5 text-red-600" /> Deleted
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Table</Label>
                        <Select value={tableFilter} onValueChange={setTableFilter}>
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tables</SelectItem>
                                {["offers", "quotes", "invoices", "services", "clients", "payments", "projects", "tickets", "settings"].map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Date Range</Label>
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-3.5 w-3.5" /> All Time
                                    </div>
                                </SelectItem>
                                <SelectItem value="today">
                                    <div className="flex items-center gap-2">
                                        <Sun className="h-3.5 w-3.5 text-orange-600" /> Today
                                    </div>
                                </SelectItem>
                                <SelectItem value="7d">Last 7 Days</SelectItem>
                                <SelectItem value="30d">Last 30 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>



                    <div>
                        <Label>From</Label>
                        <Input
                            type="date"
                            value={fromDate}
                            onChange={(e) => {
                                setFromDate(e.target.value);
                                if (dateRange !== "all") setDateRange("all");
                            }}
                        />
                    </div>
                    <div>
                        <Label>To</Label>
                        <Input
                            type="date"
                            value={toDate}
                            min={fromDate}
                            onChange={(e) => {
                                setToDate(e.target.value);
                                if (dateRange !== "all") setDateRange("all");
                            }}
                        />
                    </div>
                    <div>
                        <Label>Reset</Label>
                        <Button onClick={resetFilters} className="w-full mt-1 cursor-pointer">
                            <RotateCcw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                    </div>
                </div>
            </Card>

            <DataTable
                table={table}
                columns={columns}

            //  isLoading={isLoading}
            />

        </div>
    );
}