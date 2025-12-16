/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  LinkIcon,
  ArrowUpDown,
  Download,
  Pencil,
  Eye,
  Copy,
  Check,
  Ban,
  CircleX,
  CircleCheck,
} from "lucide-react";
import { formatId } from "@/lib/utils/formatId";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditPayment from "../components/EditPayment";
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
import { useState } from "react";
import { toast } from "sonner";
import { useCancelPayment, useConfirmPayment } from "../hooks/usePaymentQuery";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "@/components/common/ConfirmDialoge";
export function paymentColumns(role) {
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, {
      duration: 3000,
    });
  };

  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment ID
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),

      cell: ({ row }) => {
        const id = row.getValue("id");
        return (
          <div className="font-mono text-sm">{formatId(id, "PAYMENT")}</div>
        );
      },
    },
    {
      accessorKey: "invoice_id",
      header: "Invoice ID",
      cell: ({ row }) => {
        const id = row.getValue("invoice_id");
        return (
          <Link to={`/${role}/invoice/${id}`}>{formatId(id, "INVOICE")}</Link>
        );
      },
    },
    {
      accessorKey: "client_name",
      header: "Client Name",
      cell: ({ row }) => {
        const user = "unknown";
        // const user = row.getValue("user");;
        console.log(user);
        return <div> {user}</div>;
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="float-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total"));
        const formatted = new Intl.NumberFormat("fr-MA", {
          style: "currency",
          currency: "MAD",
        }).format(amount);

        return <div className="ml-3">{formatted}</div>;
      },
    },
    {
      accessorKey: "amount",
      header: "Paid Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("fr-MA", {
          style: "currency",
          currency: "MAD",
        }).format(amount);

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "currency",
      header: "Currency",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">
          {row.getValue("currency")?.toUpperCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        return <StatusBadge status={status}>{status}</StatusBadge>;
      },
    },
    {
      accessorKey: "payment_method",
      header: "Method",
      cell: ({ row }) => {
        const method = row.getValue("payment_method");
        return method ? (
          <span className="capitalize">{method.replace(/_/g, " ")}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
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
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return (
          <div className="text-sm">
            {isNaN(date)
              ? "Invalid Date"
              : date.toLocaleDateString("fr-MA", {
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const payment = row.original;
        const [open, setOpen] = useState(false);

        const handleViewSession = () => {
          if (payment.stripe_session_id) {
            window.open(
              `https://dashboard.stripe.com/test/payments/${payment.stripe_payment_intent_id || payment.stripe_session_id}`,
              "_blank"
            );
          }
        };
        const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
        const confirmPayment = useConfirmPayment();
        const cancelPayment = useCancelPayment();
        return (
          <div className="flex gap-2">
            {payment.stripe_session_id && row.getValue("status") === "paid" && (
              <Button variant="outline" size="sm" onClick={handleViewSession}>
                <Eye />
              </Button>
            )}
            {row.getValue("status") === "pending" &&
              (row.getValue("payment_method") === "stripe" ||
                row.getValue("payment_method") === "bank") && (
                <div className="text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (payment.payment_method === "stripe") {
                        copyToClipboard(payment.payment_url, "Payment Url");
                      }

                      if (payment.payment_method === "bank") {
                        copyToClipboard(
                          "007 640 0014332000000260 29",
                          "Payment Url"
                        );
                      }
                    }}
                  >
                    <Copy className="mr-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            {row.getValue("payment_method") === "bank" &&
              row.getValue("status") === "pending" &&
              role === "admin" && (
                <>
                  <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    <CircleCheck className="h-4 w-4" />
                  </Button>
                  <ConfirmDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    onConfirm={() => {
                      confirmPayment.mutate(row.getValue("id"));
                      setOpen(false);
                    }}
                    title="Cancel Payment"
                    description="Are you sure you want to cancel this payment? This action cannot be undone."
                    action="confirm"
                  />
                </>
              )}
            {row.getValue("payment_method") === "bank" &&
              row.getValue("status") === "paid" &&
              role === "admin" && (
                <>
                  <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    <CircleX className="h-4 w-4" />
                  </Button>

                  <ConfirmDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    onConfirm={() => {
                      cancelPayment.mutate(row.getValue("id"));
                      setOpen(false);
                    }}
                    title="Cancel Payment"
                    description="Are you sure you want to cancel this payment? This action cannot be undone."
                    action="cancel"
                  />
                </>
              )}
            {role === "admin" && row.getValue("status") === "pending" && (
              <Dialog
                open={isSignDialogOpen}
                onOpenChange={setIsSignDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>

                <DialogContent
                  className="sm:max-w-md"
                  onInteractOutside={(e) => e.preventDefault()}
                  onPointerDownOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                >
                  <DialogHeader>
                    <DialogDescription className="space-y-6 mt-4">
                      <EditPayment
                        payment={payment}
                        onClose={() => setIsSignDialogOpen(false)}
                      />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
          </div>
        );
      },
    },
  ];
}
