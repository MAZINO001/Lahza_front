/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { LinkIcon, ArrowUpDown, Download, Pencil } from "lucide-react";
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
export const paymentColumns = (role) => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Payment ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),

    cell: ({ row }) => {
      const id = row.getValue("id");
      return <div className="font-mono text-sm">{formatId(id, "PAYMENT")}</div>;
    },
  },
  {
    accessorKey: "invoice_id",
    header: "Invoice ID",
    cell: ({ row }) => {
      const id = row.getValue("invoice_id");
      return <div>{formatId(id, "INVOICE")}</div>;
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
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.original.currency?.toUpperCase() || "USD",
      }).format(amount);

      return <div className="ml-3">{formatted}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Paid Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.original.currency?.toUpperCase() || "USD",
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
            : date.toLocaleDateString("en-US", {
                // year: "numeric",
                month: "short",
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
      const handleViewSession = () => {
        if (payment.stripe_session_id) {
          window.open(
            `https://dashboard.stripe.com/test/payments/${payment.stripe_payment_intent_id || payment.stripe_session_id}`,
            "_blank"
          );
        }
      };
      const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);

      return (
        <div className="flex gap-2">
          {payment.stripe_session_id && (
            <Button variant="outline" size="sm" onClick={handleViewSession}>
              View
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>

          {role === "admin" &&
            // row.getValue("payment_method") === "stripe" &&
            row.getValue("status") === "pending" && (
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
                        //   onSubmit={handleUpdatePayment}
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
