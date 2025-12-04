import {
    ArrowUpDown,
    Download,
    CreditCard,
    Send,
    FileSignature,
    Trash,
    LinkIcon,
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
import SignUploader from "@/Components/Invoice_Quotes/signUploader";
import PaymentPercentage from "@/Components/Invoice_Quotes/paymentPercentage";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import SignatureExamples from "@/Components/Invoice_Quotes/signatureExamples";
import { formatId } from "@/lib/utils/formatId";
import { useUploadSignature } from "../hooks/useUploadSignature";
export const DocumentsColumns = (role, navigate, currentSection) => {
    const isInvoice = currentSection === "invoices" || currentSection === "invoice";

    return [
        {
            accessorKey: "id",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    {isInvoice ? "Invoice ID" : "Quote ID"} <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const id = row.original?.id;
                const prefix = isInvoice ? "INVOICE" : "QUOTE";
                return (
                    <Link
                        to={`/${role}/${isInvoice ? "invoice" : "quote"}/${id}`}
                        className="font-medium text-slate-900 hover:underline ml-3"
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
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Balance Due <ArrowUpDown className="ml-1 h-4 w-4" />
                        </Button>
                    ),
                    cell: ({ row }) => {
                        const invoice = row.original;
                        const balanceDue = parseFloat(invoice.balance_due) || 0;
                        const totalAmount = parseFloat(invoice.total_amount) || 0;

                        const percentage = totalAmount > 0 ? ((balanceDue / totalAmount) * 100).toFixed(1) : 0;

                        const formatted = new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "MAD",
                        }).format(balanceDue);

                        return (
                            <div className="ml-3">
                                <div className="font-medium">{formatted}</div>
                                <div className="text-xs text-muted-foreground">{percentage}% remaining</div>
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
            }
            : {
                accessorKey: "quotation_date",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Quotation Date <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const value = row.getValue("quotation_date");
                    if (!value) return <div className="ml-3 text-muted-foreground">N/A</div>;

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
                const [signatureFile, setSignatureFile] = useState(null);



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
                        formData.append(
                            "type",
                            role === "admin" ? "admin_signature" : "client_signature"
                        );

                        const endpoint = isInvoice ? "invoices" : "quotes";
                        const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}/${document.id}/signature`;

                        await api.post(url, formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        });

                        toast.success("Signature uploaded successfully!");
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
                        const type =
                            role === "admin" ? "admin_signature" : "client_signature";
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
                        toast.success("Signature removed successfully");
                    } catch (error) {
                        const msg = error?.response?.data?.message || error.message;
                        toast.error(`Failed to remove signature: ${msg}`);
                    }
                };

                const { handleSendInvoice_Quote, handleDownloadInvoice_Quotes } =
                    globalFnStore();

                const handleSend = () => {
                    const type = isInvoice ? "invoice" : "quote";
                    handleSendInvoice_Quote(document.id, user.email, type);
                };

                const handleDownload = () => {
                    const type = isInvoice ? "invoice" : "quote";
                    handleDownloadInvoice_Quotes(document.id, type);
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
                                variant="outline"
                                size="sm"
                                onClick={handleSend}
                                className="h-8"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        )}

                        {!isInvoice && role === "client" && (
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

                        {isInvoice && role === "admin" && (
                            <PaymentPercentage
                                totalAmount={row.getValue("balance_due")}
                                onGenerateLink={(percentage) => {
                                    console.log("Generate link for", percentage + "%");
                                    toast.success(`Payment link for ${percentage}% generated!`);
                                }}
                                isOpen={isSignDialogOpen}
                                onOpenChange={setIsSignDialogOpen}
                            />
                        )}
                        {!isInvoice && role === "admin" && (
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
}