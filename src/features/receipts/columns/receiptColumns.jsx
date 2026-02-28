import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatId } from "@/lib/utils/formatId";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

export function getReceiptColumns(
  role,
  navigate,
  formatAmount,
  selectedCurrency,
) {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Receipt ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // header: "Receipt ID",
      cell: ({ row }) => {
        const payment = row.original;
        const { id } = payment;
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const payment = row.original;
        const invoiceId = payment.invoice_id;
        return invoiceId ? (
          <div className="font-medium ml-3">
            {formatId(invoiceId, "INVOICE")}
          </div>
        ) : (
          <div className="text-muted-foreground ml-3">—</div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount")) || 0;
        return (
          <div className="font-medium ml-3">
            {formatAmount(amount || 0, "MAD")}
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
            <span className="capitalize">
              {method ? method.replace(/_/g, " ") : "—"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return <StatusBadge status={status}>{status}</StatusBadge>;
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return <div className="ml-3"> {isNaN(date) ? "—" : formatted} </div>;
      },
    },
  ];
}
