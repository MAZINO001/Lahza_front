/* eslint-disable no-unused-vars */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatId } from "@/lib/utils/formatId";
import { MoreHorizontal, Eye, Download, Edit, Trash2 } from "lucide-react";

export const getReceiptColumns = (role, navigate) => [
  {
    accessorKey: "id",
    header: "Receipt ID",
    cell: ({ row }) => {
      const receipt = row.original;
      return (
        <div className="font-medium">{formatId(receipt.id, "RECEIPT")}</div>
      );
    },
  },
  {
    accessorKey: "clientName",
    header: "Client",
    cell: ({ row }) => {
      const receipt = row.original;
      return (
        <div>
          <div className="font-medium">{receipt.clientName}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const receipt = row.original;
      return (
        <div className="font-medium">
          $
          {receipt.totalAmount
            ? receipt.totalAmount.toFixed(2)
            : receipt.amount.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const receipt = row.original;

      return (
        <div className="flex items-center">
          <span>{receipt.paymentMethod}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const receipt = row.original;
      const statusColors = {
        paid: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        failed: "bg-red-100 text-red-800",
      };

      return (
        <Badge className={statusColors[receipt.status]}>{receipt.status}</Badge>
      );
    },
  },
  {
    accessorKey: "receiptDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("receiptDate"));
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return date ? formatted : "—";
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const receipt = row.original;

      return <div>action</div>;
    },
  },
];
