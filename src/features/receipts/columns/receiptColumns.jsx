/* eslint-disable no-unused-vars */
import { Badge } from "@/components/ui/badge";
import { formatId } from "@/lib/utils/formatId";
import { Link } from "react-router-dom";

export const getReceiptColumns = (role, navigate) => [
  {
    accessorKey: "id",
    header: "Receipt ID",
    cell: ({ row }) => {
      const payment = row.original;
      const id = payment.id;
      return (
        <Link
          to={`/${role}/receipt/${id}`}
          className="font-medium text-foreground hover:underline ml-3"
        >
          {formatId(id, "RECEIPT")}
        </Link>
      );
    },
  },
  {
    accessorKey: "invoice_id",
    header: "Invoice ID",
    cell: ({ row }) => {
      const payment = row.original;
      const invoiceId = payment.invoice_id;
      return invoiceId ? (
        <div className="font-medium">
          {formatId(invoiceId, "INVOICE")}
        </div>
      ) : (
        <div className="text-muted-foreground">—</div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const payment = row.original;
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("fr-MA", {
        style: "currency",
        currency: "MAD",
      }).format(amount);
      return (
        <div className="font-medium">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
    cell: ({ row }) => {
      const method = row.getValue("payment_method");
      return (
        <div className="flex items-center">
          <span className="capitalize">{method ? method.replace(/_/g, " ") : '—'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const statusColors = {
        paid: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        failed: "bg-red-100 text-red-800",
      };

      return (
        <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return !isNaN(date) ? formatted : "—";
    },
  },
];
