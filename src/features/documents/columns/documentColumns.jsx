/* eslint-disable react-hooks/rules-of-hooks */
import {
  ArrowUpDown,
  Download,
  CreditCard,
  Send,
  FileSignature,
  Trash,
  LinkIcon,
  SignatureIcon,
} from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/Components/StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/utils/axios";
import { useAuthContext } from "@/hooks/AuthContext";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import SignUploader from "@/features/documents/components/signUploader";
import PaymentPercentage from "@/features/documents/components/paymentPercentage";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import SignatureExamples from "@/features/documents/components/signatureExamples";
import { formatId } from "@/lib/utils/formatId";
import {
  useDeleteDocument,
  useCreateInvoiceFromQuote,
} from "@/features/documents/hooks/useDocumentsQuery";
import { ConfirmDialog } from "@/components/common/ConfirmDialoge";
export function DocumentsColumns(role, navigate, currentSection) {
  const isInvoice = currentSection === "invoice";
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {isInvoice ? "Invoice ID" : "Quote ID"}{" "}
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const id = row.original?.id;
        const prefix = isInvoice ? "INVOICE" : "QUOTE";

        // Debug: Log the row data to understand the structure
        console.log("Row data:", row.original);
        console.log("ID:", id);

        if (!id) {
          console.error("No ID found for row:", row.original);
          return (
            <span className="font-medium text-muted-foreground ml-3">
              No ID
            </span>
          );
        }

        return (
          <Link
            to={`/${role}/${isInvoice ? "invoice" : "quote"}/${id}`}
            className="font-medium text-foreground hover:underline ml-3"
          >
            {formatId(id, prefix)}
          </Link>
        );
      },
    },

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
        const amount = parseFloat(row.getValue("total_amount")) || 0;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "MAD",
        }).format(amount);
        return <div className="ml-3 font-medium">{formatted}</div>;
      },
    },

    ...(isInvoice
      ? [
        {
          accessorKey: "balance_due",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Balance Due <ArrowUpDown className="ml-1 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => {
            const invoice = row.original;
            const balanceDue = parseFloat(invoice.balance_due) || 0;
            const totalAmount = parseFloat(invoice.total_amount) || 0;

            const percentage =
              totalAmount > 0
                ? ((balanceDue / totalAmount) * 100).toFixed(1)
                : 0;

            const formatted = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "MAD",
            }).format(balanceDue);

            return (
              <div className="ml-3">
                <div className="font-medium">{formatted}</div>
                <div className="text-xs text-muted-foreground">
                  {percentage}% remaining
                </div>
              </div>
            );
          },
        },
      ]
      : []),

    isInvoice
      ? {
        accessorKey: "due_date",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
      }
      : {
        accessorKey: "quotation_date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Quotation Date <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const value = row.getValue("quotation_date");
          if (!value)
            return <div className="ml-3 text-muted-foreground">N/A</div>;

          const formatted = new Date(value).toLocaleDateString("en-US", {
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
        const dueDate = row.original.due_date;

        if (status === "overdue" && dueDate) {
          const daysOverdue = Math.max(
            0,
            Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24))
          );
          return (
            <div className="flex items-center gap-2">
              <StatusBadge status={status} />
              <span className="text-xs font-medium text-red-600">
                {daysOverdue} {daysOverdue === 1 ? "day" : "days"} overdue
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
        const document = row.original;
        const { user } = useAuthContext();
        const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
        const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
        const [signatureFile, setSignatureFile] = useState(null);
        const [open, setOpen] = useState(false);
        const createInvoice = useCreateInvoiceFromQuote();
        const deleteInvoice = useDeleteDocument("invoices");

        const handleSignatureUpload = (files) => {
          if (files && files.length > 0) {
            setSignatureFile(files[0]);
          }
        };

        const handleSubmitSignature = async () => {
          if (!signatureFile) {
            toast.error("Please select a signature");
            return;
          }

          try {
            const formData = new FormData();
            formData.append("signature", signatureFile.file);
            formData.append("type", "client_signature");

            const endpoint = isInvoice ? "invoices" : "quotes";
            const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}/${document.id}/signature`;

            await api.post(url, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

            toast.success("Signature uploaded successfully!");

            if (!isInvoice && role === "client") {
              const shouldCreateInvoice = confirm(
                "Would you like to create an invoice from this signed quote?"
              );

              if (shouldCreateInvoice) {
                try {
                  await createInvoice.mutateAsync(document.id);
                  toast.success(
                    "Quote signed and invoice created successfully!"
                  );
                } catch (err) {
                  console.error("Failed to create invoice:", err);
                  toast.error(
                    "Quote signed, but invoice creation failed. Please try again."
                  );
                }
              } else {
                toast.success("Quote signature uploaded successfully!");
              }
            }

            setIsSignDialogOpen(false);
            setSignatureFile(null);
          } catch (error) {
            console.error("Error uploading signature:", error);
            toast.error("Failed to upload signature");
          }
        };

        const handleRemoveSignature = async () => {
          if (!confirm("Are you sure you want to remove the signature?"))
            return;

          try {
            const type = "client_signature";
            const endpoint = isInvoice ? "invoices" : "quotes";
            await api.delete(
              `${import.meta.env.VITE_BACKEND_URL}/${endpoint}/${document.id}/signature`,
              {
                params: { type },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (!isInvoice) {
              try {
                const invoicesResponse = await api.get(
                  `${import.meta.env.VITE_BACKEND_URL}/invoices`
                );
                const invoices =
                  invoicesResponse.data?.invoices ||
                  invoicesResponse.data ||
                  [];

                console.log("Looking for invoice with quote_id:", document.id);
                console.log("Available invoices:", invoices);

                const associatedInvoice = invoices.find(
                  (invoice) => invoice.quote_id === document.id
                );

                console.log("Found associated invoice:", associatedInvoice);

                if (associatedInvoice) {
                  await deleteInvoice.mutateAsync(associatedInvoice.id);
                  toast.success("Associated invoice also removed");
                } else {
                  console.log("No invoice found for this quote");
                }
              } catch (invoiceError) {
                console.error(
                  "Failed to remove associated invoice:",
                  invoiceError
                );
                toast.error(
                  "Signature removed, but failed to remove associated invoice"
                );
              }
            }

            toast.success("Signature removed successfully");
          } catch (error) {
            const msg = error?.response?.data?.message || error.message;
            toast.error(`Failed to remove signature: ${msg}`);
          }
        };

        const { handleSendInvoice_Quote, handleDownloadInvoice_Quotes } =
          globalFnStore();

        const handleSend = () => {
          handleSendInvoice_Quote(document.id, user.email, currentSection);
        };

        const handleDownload = () => {
          handleDownloadInvoice_Quotes(document.id, currentSection);
        };

        const handlePay = () => {
          if (
            document.status === "partially_paid" ||
            document.status === "overdue" ||
            document.status === "unpaid"
          ) {
            alert(`Opening payment for ${document.id}`);
          }
        };
        return (
          <div className="flex items-center gap-2">
            {isInvoice &&
              role === "client" &&
              (document.status === "partially_paid" ||
                document.status === "overdue" ||
                document.status === "unpaid") && (
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
                variant="ghost"
                size="sm"
                onClick={handleSend}
                className="h-8 cursor-pointer"
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
                  <Button variant="ghost" size="sm" className="h-8 cursor-pointer">
                    <FileSignature className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogTitle>add you signature</DialogTitle>
                  <DialogHeader>
                    <DialogDescription className="space-y-6 mt-4">
                      <p className="text-center text-base">
                        Please upload a{" "}
                        <strong className="">clear black signature</strong> on a{" "}
                        <strong className="">pure white background</strong>.
                      </p>

                      <SignatureExamples />

                      <p className="text-sm text-center text-muted-foreground pt-4">
                        Accepted formats: PNG, JPG, JPEG • Max size: 5MB
                      </p>
                    </DialogDescription>
                  </DialogHeader>

                  <SignUploader onFileChange={handleSignatureUpload} />
                  <DialogFooter>
                    <Button
                      variant="ghost"
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
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(true)}
                  className="h-8 text-muted-foreground hover:text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  <SignatureIcon className="h-4 w-4" />
                </Button>

                <ConfirmDialog
                  open={open}
                  onClose={() => setOpen(false)}
                  onConfirm={() => {
                    handleRemoveSignature();
                    setOpen(false);
                  }}
                  title="Remove Signature"
                  description="Are you sure you want to remove this signature? This action cannot be undone."
                  action="cancel"
                />
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 cursor-pointer"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
