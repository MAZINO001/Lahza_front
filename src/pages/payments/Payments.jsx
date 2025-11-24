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
import { useState } from "react";
import { ArrowUpDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockPayments } from "@/lib/mockData";
import { StatusBadge } from "@/Components/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
// Mock data

// Table columns
export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "payment_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Payment ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "client_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Client
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "project_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Project
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "invoice_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Invoice ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "paid_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Paid At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("paid_at"));
      return (
        <div>{isNaN(date) ? "N/A" : date.toLocaleDateString("en-US")}</div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="justify-end"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MAD",
      }).format(row.getValue("amount"));
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "deposit_amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="justify-end"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Deposit
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const invoice = row.original;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(invoice.deposit_amount);
      return (
        <div className="text-right">
          <div className="font-medium">{formatted}</div>
          <div className="text-xs text-muted-foreground">
            ({invoice.deposit_percentage}%)
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Payment Method
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const dueDate = new Date(row.original.due_date);
      const paidAt = row.original.paid_at
        ? new Date(row.original.paid_at)
        : null;
      const today = new Date();

      const isOverdue = !paidAt && dueDate < today;

      let overdueText = "";
      if (isOverdue) {
        const diffTime = today.getTime() - dueDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
          overdueText = `${diffDays} day${diffDays > 1 ? "s" : ""}`;
        } else if (diffDays < 365) {
          const months = Math.floor(diffDays / 30);
          overdueText = `${months} month${months > 1 ? "s" : ""}`;
        } else {
          const years = Math.floor(diffDays / 365);
          overdueText = `${years} year${years > 1 ? "s" : ""}`;
        }
      }

      return (
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          {isOverdue && (
            <span className="text-red-500 font-normal text-sm">
              {overdueText}
            </span>
          )}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const payment = row.original;

      const handlePay = () => {
        if (payment.status === "pending" || payment.status === "overdue") {
          alert(`Opening payment for ${payment.payment_id}`);
        }
      };

      const handleDownload = () => {
        alert(`Downloading invoice ${payment.invoice_id}`);
      };

      return (
        <div className="flex items-center gap-2">
          {/* {(payment.status === "pending" || payment.status === "overdue") && (
            <Button variant="default" size="sm" onClick={handlePay}>
              Pay
            </Button>
          )} */}
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

// Payments component
export default function Payments({ data = mockPayments }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

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
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    <div className="w-full p-4">
      <div className="flex justify-start mb-4">
        <Input
          placeholder="Filter by project..."
          value={table.getColumn("project_name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("project_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
