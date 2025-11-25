/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/Components/StatusBadge";
import {
  ArrowUpDown,
  Download,
  FileSignature,
  Send,
  Trash,
} from "lucide-react";
import { Link } from "react-router-dom";
import FormField from "@/Components/Form/FormField";
import api from "@/utils/axios";
import SignUploader from "@/Components/Invoice_Quotes/signUploader";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import { useAuthContext } from "@/hooks/AuthContext";

// Function to create an invoice from a quote
const createInvoiceFromQuote = async (quote) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_BACKEND_URL}/quotes/${quote.id}/create-invoice`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating invoice from quote:", error);
    throw error;
  }
};
export default function QuotesTable() {
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
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quote ID <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const id = row.getValue("id");
        const QuoteNumber = row.original?.quote_number;
        return (
          <Link
            to={`/${role}/quote/${id}`}
            className="ml-3 font-medium text-slate-900 hover:underline"
          >
            {QuoteNumber ?? id}
          </Link>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={row.getValue("status")}
          is_fully_signed={row.original?.is_fully_signed}
        />
      ),
    },
    {
      accessorKey: "quotation_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quotation Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue("quotation_date");
        if (!value) return "N/A";

        const formatted = new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return <div className=" ml-3">{formatted}</div>;
      },
    },
    {
      accessorKey: "total_amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-end"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const total_amount = parseFloat(row.getValue("total_amount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "MAD",
        }).format(total_amount);

        return <div className="ml-3 font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const quote = row.original;
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

            const url = `${import.meta.env.VITE_BACKEND_URL}/quotes/${quote.id}/signature`;
            const res = await api.post(url, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

            alert("Signature uploaded successfully!");

            // Update local quotes state
            setQuotes((prevQuotes) =>
              prevQuotes.map((q) =>
                q.id === quote.id
                  ? { ...q, is_fully_signed: true, status: "signed" }
                  : q
              )
            );

            // Auto-create invoice after successful client signature
            try {
              const invoice = await createInvoiceFromQuote(quote);
              alert("Quote signed and invoice created successfully!");
            } catch (err) {
              console.error("Failed to create invoice:", err);
              alert(
                "Quote signed, but invoice creation failed. Please try again."
              );
            }

            setIsSignDialogOpen(false);
            setSignatureFile(null);
          } catch (error) {
            console.error("Error uploading signature:", error);
            alert("Failed to upload signature");
          }
        };

        const handleRemoveSignature = async () => {
          if (!confirm("Are you sure you want to remove this signature?"))
            return;

          try {
            const type =
              role === "admin" ? "admin_signature" : "client_signature";
            await api.delete(
              `${import.meta.env.VITE_BACKEND_URL}/quotes/${quote.id}/signature`,
              {
                params: { type },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            alert("Signature removed successfully");

            // Optional: update local state to reflect removal
            setQuotes((prev) =>
              prev.map((q) =>
                q.id === quote.id
                  ? { ...q, is_fully_signed: false, status: "pending" }
                  : q
              )
            );
          } catch (error) {
            const msg = error?.response?.data?.message || error.message;
            alert(`Failed to remove signature: ${msg}`);
          }
        };

        const { handleSendInvoice_Quote, handleDownloadInvoice_Quotes } =
          globalFnStore();

        const handleSendQuote = () => {
          handleSendInvoice_Quote(quote.id, user.email, "quote");
        };

        const handleDownload = () => {
          handleDownloadInvoice_Quotes(quote.id, "quote");
        };

        return (
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendQuote}
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
                    <DialogTitle>Sign Quote {quote.quote_number}</DialogTitle>
                    <DialogDescription>
                      Upload an image of your signature to accept this quote.
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
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const { role, user } = useAuthContext();
  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const res = await api.get(`${import.meta.env.VITE_BACKEND_URL}/quotes`);

      setQuotes(res.data.quotes);
    } catch (error) {
      console.error("Error loading quotes:", error);
    } finally {
      setLoading(false);
    }
  };
  const table = useReactTable({
    data: quotes,
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
          <Link to={`/${role}/quote/new`}>
            <Button>Add New Quote</Button>
          </Link>
        ) : (
          <Button>Request New Quote</Button>
        )}
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
                  No quotes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
