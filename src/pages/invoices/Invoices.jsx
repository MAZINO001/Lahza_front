/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
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
  ChevronDown,
  MoreHorizontal,
  Download,
} from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/Components/StatusBadge";
import { mockInvoices } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import FormField from "@/Components/Form/FormField";

export const columns = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "invoice_number",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Invoice ID <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const id = row.original?.id;
      const InvoiceNumber = row.original?.invoice_number;
      return (
        <Link
          to={`${id}`}
          className="font-medium text-slate-900 hover:underline"
        >
          {InvoiceNumber ?? id}
        </Link>
      );
    },
  },
  // {
  //   accessorKey: "title",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Title
  //         <ArrowUpDown />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <div>{row.getValue("title")}</div>,
  // },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "balance_due",
    header: () => <div className="text-right">Deposit</div>,
    cell: ({ row }) => {
      const invoice = row.original;
      const depositAmount = invoice.balance_due;
      const depositPercentage = invoice.deposit_percentage;

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(depositAmount);

      return (
        <div className="text-right">
          <div className="font-medium">{formatted}</div>
          <div className="text-xs text-muted-foreground">
            ({depositPercentage}%)
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("due_date"));
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <StatusBadge status={status} />;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const invoice = row.original;

      const handlePay = () => {
        if (invoice.status === "pending" || invoice.status === "overdue") {
          alert(`Opening payment for ${invoice.invoice_number}`);
        }
      };

      const handleDownload = () => {
        alert(`Downloading invoice ${invoice.invoice_number}`);
      };

      return (
        <div className="flex items-center gap-2">
          {(invoice.status === "pending" || invoice.status === "overdue") && (
            <Button
              variant="default"
              size="sm"
              onClick={handlePay}
              className="h-8"
            >
              Pay
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="h-8"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
export default function Invoices() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const [Invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/invoices`,
        {
          withCredentials: true,
        }
      );

      setInvoices(res.data.invoices);
      console.log(res.data.invoices);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  };
  const table = useReactTable({
    data: Invoices,
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
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <FormField
          placeholder="Filter by status..."
          value={table.getColumn("status")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("status")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {role === "admin" ? (
          <Link to={`/${role}/invoices/new`}>
            <Button>Add New Invoice</Button>
          </Link>
        ) : (
          ""
        )}
      </div>
      <DropdownMenu>
        {/* <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger> */}
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="overflow-hidden rounded-md border">
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
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
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
    </div>
  );
}
