/* eslint-disable react-refresh/only-export-components */
// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useState } from "react";
// import { StatusBadge } from "@/Components/StatusBadge";
// import { Receipt, Calendar, DollarSign, CreditCard } from "lucide-react";
// import { mockInvoices } from "@/lib/mockData";

// // Mock user data
// const mockUser = {
//   id: "client-001-uuid-here",
//   email: "demo@example.com",
//   name: "Demo User",
// };

// export default function InvoicesPage() {
//   const user = mockUser;
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [depositPercentage, setDepositPercentage] = useState(30);

//   useEffect(() => {
//     loadInvoices();
//   }, []);

//   const loadInvoices = async () => {
//     if (!user) return;

//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     // Load mock data
//     setInvoices(mockInvoices);
//     setLoading(false);
//   };

//   const handlePayInvoice = (invoice) => {
//     setSelectedInvoice(invoice);
//     setDepositPercentage(invoice.deposit_percentage);
//     setShowPaymentModal(true);
//   };

//   const handleSubmitPayment = async () => {
//     if (!selectedInvoice) return;

//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     const depositAmount = (selectedInvoice.amount * depositPercentage) / 100;

//     // Update invoice in state
//     setInvoices(
//       invoices.map((inv) =>
//         inv.id === selectedInvoice.id
//           ? {
//               ...inv,
//               status: "paid",
//               paid_at: new Date().toISOString(),
//               payment_method: "Online Payment",
//               deposit_percentage: depositPercentage,
//               deposit_amount: depositAmount,
//             }
//           : inv
//       )
//     );

//     alert("Payment processed successfully!");
//     setShowPaymentModal(false);
//     setSelectedInvoice(null);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center lg:text-left">
//           Invoices
//         </h1>
//         <p className="text-slate-600 text-center lg:text-left">
//           Manage and pay your invoices
//         </p>
//       </div>

//       {invoices.length === 0 ? (
//         <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
//           <Receipt className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-slate-900 mb-2">
//             No invoices yet
//           </h3>
//           <p className="text-slate-600">Your invoices will appear here</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50 border-b border-slate-200">
//                 <tr>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
//                     Invoice #
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
//                     Title
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
//                     Amount
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
//                     Deposit
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
//                     Due Date
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
//                     Status
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {invoices.map((invoice) => (
//                   <tr
//                     key={invoice.id}
//                     className="border-b border-slate-100 hover:bg-slate-50"
//                   >
//                     <td className="py-3 px-4 text-sm font-medium text-slate-900">
//                       {invoice.invoice_number}
//                     </td>
//                     <td className="py-3 px-4 text-sm text-slate-600">
//                       {invoice.title}
//                     </td>
//                     <td className="py-3 px-4 text-sm font-medium text-slate-900">
//                       ${invoice.amount.toLocaleString()}
//                     </td>
//                     <td className="py-3 px-4 text-sm text-slate-600">
//                       {invoice.deposit_percentage}% ($
//                       {invoice.deposit_amount.toLocaleString()})
//                     </td>
//                     <td className="py-3 px-4 text-sm text-slate-600">
//                       {new Date(invoice.due_date).toLocaleDateString()}
//                     </td>
//                     <td className="py-3 px-4">
//                       <StatusBadge status={invoice.status} />
//                     </td>
//                     <td className="py-3 px-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
//                       {invoice.status === "pending" && (
//                         <button
//                           onClick={() => handlePayInvoice(invoice)}
//                           className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
//                         >
//                           Pay Now
//                         </button>
//                       )}

//                       {invoice.status === "paid" && (
//                         <span className="text-sm text-slate-500">
//                           Paid{" "}
//                           {invoice.paid_at
//                             ? new Date(invoice.paid_at).toLocaleDateString()
//                             : ""}
//                         </span>
//                       )}

//                       <button
//                         // onClick={() => handleDownloadInvoice(invoice)}
//                         className="text-sm bg-white border border-slate-300 text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
//                       >
//                         Download
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {showPaymentModal && selectedInvoice && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative">
//             <h2 className="text-2xl font-bold text-slate-900 mb-6">
//               Payment Details
//             </h2>

//             <div className="bg-slate-50 rounded-lg p-4 mb-6">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm text-slate-600">Invoice Number</span>
//                 <span className="font-medium text-slate-900">
//                   {selectedInvoice.invoice_number}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm text-slate-600">Total Amount</span>
//                 <span className="font-medium text-slate-900">
//                   ${selectedInvoice.amount.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-slate-600">Due Date</span>
//                 <span className="font-medium text-slate-900">
//                   {new Date(selectedInvoice.due_date).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-slate-700 mb-3">
//                 Select Deposit Percentage
//               </label>
//               <div className="grid grid-cols-3 gap-3">
//                 {[30, 40, 50].map((percentage) => {
//                   const amount = (selectedInvoice.amount * percentage) / 100;
//                   return (
//                     <button
//                       key={percentage}
//                       onClick={() => setDepositPercentage(percentage)}
//                       className={`p-4 rounded-lg border-2 transition-all cursor-pointer${
//                         depositPercentage === percentage
//                           ? "border-slate-900 bg-slate-50"
//                           : "border-slate-200 hover:border-slate-300"
//                       }`}
//                     >
//                       <div className="text-2xl font-bold text-slate-900 mb-1">
//                         {percentage}%
//                       </div>
//                       <div className="text-sm text-slate-600">
//                         ${amount.toLocaleString()}
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//               <div className="flex items-start">
//                 <DollarSign className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
//                 <div>
//                   <p className="text-sm font-medium text-blue-900 mb-1">
//                     Payment Amount
//                   </p>
//                   <p className="text-2xl font-bold text-blue-900">
//                     $
//                     {(
//                       (selectedInvoice.amount * depositPercentage) /
//                       100
//                     ).toLocaleString()}
//                   </p>
//                   <p className="text-xs text-blue-700 mt-1">
//                     Remaining: $
//                     {(
//                       (selectedInvoice.amount * (100 - depositPercentage)) /
//                       100
//                     ).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Card Information
//               </label>
//               <div className="space-y-3">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Card Number"
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
//                   />
//                   <CreditCard className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <input
//                     type="text"
//                     placeholder="MM/YY"
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
//                   />
//                   <input
//                     type="text"
//                     placeholder="CVC"
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setShowPaymentModal(false)}
//                 className="flex-1 bg-slate-100 text-slate-700 py-2.5 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitPayment}
//                 className="flex-1 bg-slate-900 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-slate-800 transition-colors cursor-pointer"
//               >
//                 Pay $
//                 {(
//                   (selectedInvoice.amount * depositPercentage) /
//                   100
//                 ).toLocaleString()}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
      const invoice_number = row.getValue("invoice_number");
      const formattedId = `QUOTE-${invoice_number.toString().padStart(4, "0")}`;
      return (
        <Link
          to={`/client/quotes/${invoice_number}`}
          className="font-medium text-slate-900 hover:underline"
        >
          {formattedId}
        </Link>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
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
    accessorKey: "deposit_amount",
    header: () => <div className="text-right">Deposit</div>,
    cell: ({ row }) => {
      const invoice = row.original;
      const depositAmount = invoice.deposit_amount;
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
          // Add your payment logic here
        }
      };

      const handleDownload = () => {
        alert(`Downloading invoice ${invoice.invoice_number}`);
        // Add your download logic here
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

export default function Invoices() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: mockInvoices,
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
    <div className="w-full p-4">
      <div className="flex items-center pb-4">
        <Input
          placeholder="Filter by title..."
          value={table.getColumn("title")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
