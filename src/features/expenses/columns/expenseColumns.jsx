import { ArrowUpDown, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipButton } from "@/components/common/TooltipButton";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function getExpenseColumns(role, navigate) {
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, { duration: 3000 });
  };

  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <Link
            to={`/${role}/expense/${expense.id}`}
            className="font-medium text-foreground hover:underline ml-3"
          >
            {row.getValue("title")}
          </Link>
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
        const amount = parseFloat(row.getValue("amount"));
        const currency = row.original.currency || "USD";
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
        }).format(amount);

        return <div className="ml-3 font-medium">{formatted}</div>;
      },
    },

    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category");
        return (
          <Badge variant="secondary" className="capitalize">
            {category || "—"}
          </Badge>
        );
      },
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
      header: "Payment Method",
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
      accessorKey: "date",
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
        const date = new Date(row.getValue("date"));
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return <div className="text-sm ml-3">{formatted}</div>;
      },
    },

    {
      accessorKey: "repeatedly",
      header: "Repeats",
      cell: ({ row }) => {
        const repeats = row.getValue("repeatedly");
        return (
          <Badge
            variant={repeats === "none" ? "outline" : "default"}
            className="capitalize"
          >
            {repeats}
          </Badge>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const expense = row.original;

        if (role === "client") {
          return <div className="text-muted-foreground">—</div>;
        }

        return (
          <div className="flex gap-1">
            <TooltipButton
              tooltip="Edit Expense"
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate(`/${role}/expense/${expense.id}/edit`, {
                  state: { expenseId: expense.id },
                })
              }
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4" />
            </TooltipButton>
          </div>
        );
      },
    },
  ];
}
