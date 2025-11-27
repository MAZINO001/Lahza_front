// src/pages/ActivityLogsPage.tsx
import * as React from "react";
import { useMemo, useState } from "react";
import { format } from "date-fns";
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
  Clock,
  Monitor,
  User,
  RotateCcw,
  Globe,
  Tag,
  FileText,
  Receipt,
  Package,
  Users,
  CreditCard,
  Folders,
  MessageSquare,
  Settings,
  Activity,
  PlusCircle,
  Edit3,
  Trash2,
  CalendarDays,
  Sun,
  Calendar,
  CalendarClock,
  Smartphone,
  Tablet,
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

import { TheActivityLogs } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";

const logs = TheActivityLogs;

export default function ActivityLogsPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [tableFilter, setTableFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const resetFilters = () => {
    setGlobalFilter("");
    setActionFilter("all");
    setTableFilter("all");
    setDateRange("all");
  };

  const filteredData = useMemo(() => {
    let filtered = [...logs];

    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    if (tableFilter !== "all") {
      filtered = filtered.filter((log) => log.table_name === tableFilter);
    }

    const now = new Date();
    if (dateRange === "today") {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.created_at);
        return format(logDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
      });
    } else if (dateRange === "7d") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter((log) => new Date(log.created_at) >= weekAgo);
    } else if (dateRange === "30d") {
      const monthAgo = new Date(now.setDate(now.getDate() - 30));
      filtered = filtered.filter((log) => new Date(log.created_at) >= monthAgo);
    }

    return filtered;
  }, [actionFilter, tableFilter, dateRange]);

  const { role } = useAuthContext();
  const columns = [
    {
      accessorKey: "log_id",
      header: "Log ID",
      cell: ({ row }) => {
        const id = row.original.id;
        const logId = `LOG-${String(id).padStart(5, "0")}`;
        return (
          <Link
            to={`/${role}/logs/${id}`}
            className="font-medium hover:underline cursor-pointer"
          >
            {logId}
          </Link>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Clock className="mr-2 h-4 w-4" />
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        const isToday =
          format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {isToday ? "Today" : format(date, "MMM d, yyyy")}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(date, "h:mm a")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center gap-3">
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.getValue("action");
        const variants = {
          created: "bg-green-100 text-green-800",
          updated: "bg-blue-100 text-blue-800",
          deleted: "bg-red-100 text-red-800",
        };
        return (
          <Badge className={variants[action] || "bg-gray-100 text-gray-800"}>
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "table_name",
      header: "Target",
      cell: ({ row }) => {
        const { table_name } = row.original;
        return (
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">{table_name}</Badge>
            </div>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "changes",
    //   header: "Changes",
    //   cell: ({ row }) => {
    //     const changes = row.original.changes || {};
    //     const entries = Object.entries(changes);

    //     if (entries.length === 0) {
    //       return <span className="text-muted-foreground text-sm">—</span>;
    //     }

    //     return (
    //       <div className="text-xs space-y-1">
    //         {entries.slice(0, 3).map(([key, value]) => {
    //           const val =
    //             typeof value === "object" ? value.new || value.old : value;
    //           return (
    //             <div key={key} className="flex gap-2">
    //               <span className="font-medium capitalize">{key}:</span>
    //               <span className="text-muted-foreground truncate max-w-48">
    //                 {String(val)}
    //               </span>
    //             </div>
    //           );
    //         })}
    //         {entries.length > 3 && (
    //           <span className="text-primary text-xs">
    //             +{entries.length - 3} more
    //           </span>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      id: "device",
      header: "Device",
      cell: ({ row }) => {
        const deviceType = row.original.device;
        return (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {deviceType === "Mobile" && (
              <>
                <Smartphone className="h-3.5 w-3.5" />
                <span>Mobile</span>
              </>
            )}

            {deviceType === "Desktop" && (
              <>
                <Monitor className="h-3.5 w-3.5" />
                <span>Desktop</span>
              </>
            )}

            {deviceType === "Tablet" && (
              <>
                <Tablet className="h-3.5 w-3.5" />
                <span>Tablet</span>
              </>
            )}

            {deviceType === "Server" && (
              <>
                <Server className="h-3.5 w-3.5" />
                <span>Server</span>
              </>
            )}

            {!["Mobile", "Desktop", "Tablet", "Server"].includes(
              deviceType || ""
            ) && (
              <>
                <Monitor className="h-3.5 w-3.5" />
                <span>{deviceType || "Unknown"}</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center justify-between gap-5 text-xs text-muted-foreground ">
          <div className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            {row.original.ip_country}
          </div>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full p-4 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search anything</Label>
              <Input
                placeholder="User, title, IP, changes..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-6">
                <div>
                  <Label>Action</Label>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                          All Actions
                        </div>
                      </SelectItem>

                      <SelectItem value="created">
                        <div className="flex items-center gap-2">
                          <PlusCircle className="h-3.5 w-3.5 text-green-600" />
                          Created
                        </div>
                      </SelectItem>

                      <SelectItem value="updated">
                        <div className="flex items-center gap-2">
                          <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                          Updated
                        </div>
                      </SelectItem>

                      <SelectItem value="deleted">
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
                          Deleted
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
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5" />
                          All Tables
                        </div>
                      </SelectItem>
                      <SelectItem value="offers">
                        <div className="flex items-center gap-2">
                          <Tag className="h-3.5 w-3.5 text-green-600" />
                          offers
                        </div>
                      </SelectItem>
                      <SelectItem value="quotes">
                        <div className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-blue-600" />
                          quotes
                        </div>
                      </SelectItem>
                      <SelectItem value="invoices">
                        <div className="flex items-center gap-2">
                          <Receipt className="h-3.5 w-3.5 text-purple-600" />
                          invoices
                        </div>
                      </SelectItem>
                      <SelectItem value="services">
                        <div className="flex items-center gap-2">
                          <Package className="h-3.5 w-3.5 text-orange-600" />
                          services
                        </div>
                      </SelectItem>
                      <SelectItem value="clients">
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-indigo-600" />
                          clients
                        </div>
                      </SelectItem>
                      <SelectItem value="payments">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                          payments
                        </div>
                      </SelectItem>
                      <SelectItem value="projects">
                        <div className="flex items-center gap-2">
                          <Folders className="h-3.5 w-3.5 text-pink-600" />
                          projects
                        </div>
                      </SelectItem>
                      <SelectItem value="tickets">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-3.5 w-3.5 text-red-600" />
                          tickets
                        </div>
                      </SelectItem>
                      <SelectItem value="settings">
                        <div className="flex items-center gap-2">
                          <Settings className="h-3.5 w-3.5 text-gray-600" />
                          settings
                        </div>
                      </SelectItem>
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
                          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                          All Time
                        </div>
                      </SelectItem>

                      <SelectItem value="today">
                        <div className="flex items-center gap-2">
                          <Sun className="h-3.5 w-3.5 text-orange-600" />
                          Today
                        </div>
                      </SelectItem>

                      <SelectItem value="7d">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-blue-600" />
                          Last 7 Days
                        </div>
                      </SelectItem>

                      <SelectItem value="30d">
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-3.5 w-3.5 text-purple-600" />
                          Last 30 Days
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Reset</Label>
                <Button
                  variant="outline"
                  className="mt-1"
                  value={actionFilter}
                  onClick={resetFilters}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  reset
                </Button>
              </div>
            </div>
          </div>
        </Card>
        {/* Table */}
        <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-medium">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
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
                    className="h-32 text-center text-muted-foreground"
                  >
                    No activity logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {table.getFilteredRowModel().rows.length} of {logs.length}{" "}
            logs
          </div>
          <div className="flex items-center gap-2">
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
    </div>
  );
}
