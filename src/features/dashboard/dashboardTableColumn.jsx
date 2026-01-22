import { ArrowUpDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";
export const dashBoardTableColumns = (role) => {
  return [
    {
      accessorKey: "id",
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
        const InvoiceNumber = row.original?.id;
        return (
          <Link
            to={`${id}`}
            className="font-medium text-foreground hover:underline  ml-3"
          >
            {InvoiceNumber ?? id}
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
        const amount = parseFloat(row.getValue("total_amount"));

        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
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
            Math.ceil(
              (new Date() - new Date(due_date)) / (1000 * 60 * 60 * 24),
            ),
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

        const handlePay = () => {
          if (
            invoice.status === "partially_paid" ||
            invoice.status === "overdue"
          ) {
            toast.info(`Opening payment for ${invoice.id}`);
          }
        };

        const handleDownload = () => {
          toast.info(`Downloading invoice ${invoice.id}`);
        };
        return (
          <div className="flex items-center gap-2">
            {role === "client" &&
              (invoice.status === "partially_paid" ||
                invoice.status === "overdue") && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handlePay}
                  className="h-8"
                >
                  Pay
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
};
