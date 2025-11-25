/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import * as React from "react";
import CsvUploadModal from "@/components/common/CsvUploadModal";

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
  Download,
  CreditCard,
  Send,
  FileSignature,
  Trash,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import SignUploader from "@/Components/Invoice_Quotes/signUploader";

import { useEffect } from "react";
import api from "@/utils/axios";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import { useAuthContext } from "@/hooks/AuthContext";
export default function Invoices() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const columns = [
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
            to={`/${role}/invoice/${id}`}
            className="font-medium text-slate-900 hover:underline  ml-3"
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
      accessorKey: "total_amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_amount"));

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "MAD",
        }).format(amount);

        return <div className=" ml-3 font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "balance_due",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Deposit <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const invoice = row.original;
        const balanceDue = parseFloat(invoice.balance_due);
        const totalAmount = parseFloat(invoice.total_amount);

        // Avoid division by zero or NaN
        const depositPercentage = totalAmount
          ? ((balanceDue / totalAmount) * 100).toFixed(1)
          : 0;

        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(balanceDue);

        return (
          <div className="ml-3">
            <div className=" font-medium">{formatted}</div>
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
        return <div className="ml-3">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const due_date = row.original.due_date;

        if (status === "overdue") {
          const daysOverdue = Math.max(
            0,
            Math.ceil((new Date() - new Date(due_date)) / (1000 * 60 * 60 * 24))
          );

          return (
            <div className="flex items-center gap-2">
              <StatusBadge status={status} />
              <span className="text-xs text-red-600">
                {daysOverdue} {daysOverdue === 1 ? "day" : "days"}
              </span>
            </div>
          );
        }

        return <StatusBadge status={status} />;
      },
    },

    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const invoice = row.original;
        const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
        const [signatureFile, setSignatureFile] = useState(null);

        const handleSignatureUpload = (files) => {
          if (files && files.length > 0) {
            setSignatureFile(files[0]);
          }
        };

        const handleSubmitSignature = async () => {
          if (!signatureFile) {
            alert("Please upload a signature first");
            return;
          }
          try {
            const formData = new FormData();
            formData.append("signature", signatureFile.file);
            formData.append(
              "type",
              role === "admin" ? "admin_signature" : "client_signature"
            );

            const url = `${import.meta.env.VITE_BACKEND_URL}/invoices/${invoice.id}/signature`;

            const res = await api.post(url, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

            alert(`Signature uploaded!`);
            setIsSignDialogOpen(false);
            setSignatureFile(null);
            // Optionally refetch table data here
          } catch (error) {
            console.error("Error uploading signature:", error);
            alert("Failed to upload signature");
          }
        };

        const handleRemoveSignature = async () => {
          if (!confirm("Are you sure you want to remove the signature?"))
            return;

          try {
            const type =
              role === "admin" ? "admin_signature" : "client_signature";
            await api.delete(
              `${import.meta.env.VITE_BACKEND_URL}/invoices/${invoice.id}/signature`,
              {
                params: { type },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            alert("Signature removed successfully");
            // Optionally refetch data
          } catch (error) {
            const msg = error?.response?.data?.message || error.message;
            alert(`Failed to remove signature: ${msg}`);
          }
        };

        const { handleSendInvoice_Quote, handleDownloadInvoice_Quotes } =
          globalFnStore();

        const handleSendInvoice = () => {
          handleSendInvoice_Quote(invoice.id, user.email, "invoice");
        };

        const handleDownload = () => {
          handleDownloadInvoice_Quotes(invoice.id, "invoice");
        };

        const handlePay = () => {
          if (
            invoice.status === "partially_paid" ||
            invoice.status === "overdue" ||
            invoice.status === "unpaid"
          ) {
            // Your payment logic
            alert(`Opening payment for ${invoice.invoice_number}`);
          }
        };

        return (
          <div className="flex items-center gap-2">
            {role === "client" &&
              (invoice.status === "partially_paid" ||
                invoice.status === "overdue" ||
                invoice.status === "unpaid") && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handlePay}
                  className="h-8"
                >
                  <CreditCard className="h-4 w-4" />
                </Button>
              )}

            {role === "admin" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendInvoice}
                className="h-8"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}

            {role === "client" && (
              <Dialog
                open={isSignDialogOpen}
                onOpenChange={setIsSignDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <FileSignature className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      Sign Invoice {invoice.invoice_number}
                    </DialogTitle>
                    <DialogDescription className="space-y-6">
                      <div className="text-center">
                        <p className="font-medium">
                          Please upload a{" "}
                          <strong className="text-green-600">
                            clear black signature
                          </strong>{" "}
                          on a{" "}
                          <strong className="text-green-600">
                            pure white background
                          </strong>
                          .
                        </p>
                      </div>

                      {/* Good & Bad Examples Side by Side */}
                      <div className="grid grid-cols-2 gap-8">
                        {/* GOOD Example */}
                        <div className="flex flex-col items-center space-y-3">
                          <div className="relative">
                            <img
                              src="../../../public/images/exemple-1.png"
                              alt="Good signature example"
                              className="w-56 h-40 object-contain bg-white rounded-lg shadow-md border"
                            />
                            <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2 shadow-lg">
                              <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={4}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                          <p className="text-lg font-semibold text-green-700">
                            Good Example
                          </p>
                        </div>

                        <div className="flex flex-col items-center space-y-3">
                          <div className="relative">
                            <img
                              src="../../../public/images/exemple-2.png"
                              alt="Bad signature example - avoid this"
                              className="w-56 h-40 object-contain bg-white rounded-lg shadow-md border"
                            />
                            <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg">
                              <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={4}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </div>
                          </div>
                          <p className="text-lg font-semibold text-red-700">
                            Avoid This
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Accepted: PNG, JPG, JPEG • Max 5MB • Must be black ink
                        on white background
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                  <SignUploader onFileChange={handleSignatureUpload} />
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsSignDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitSignature}
                      disabled={!signatureFile}
                    >
                      Submit Signature
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {role === "admin" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveSignature}
                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-4 w-4" />
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
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const [Invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role, user } = useAuthContext();
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const res = await api.get(`${import.meta.env.VITE_BACKEND_URL}/invoices`);

      setInvoices(res.data.invoices);
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

        {role === "admin" && (
          <div className="flex gap-2">
            <Button onClick={() => setShowUploadModal(true)}>Upload CSV</Button>

            <Link to={`/${role}/invoice/new`}>
              <Button>Add New Invoice</Button>
            </Link>
          </div>
        )}
      </div>
      <DropdownMenu>
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

          <CsvUploadModal
            open={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadInvoices`}
            onSuccess={loadInvoices}
          />
        </div>
      </div>
    </div>
  );
}
