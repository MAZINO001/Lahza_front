/* eslint-disable react-hooks/rules-of-hooks */
import {
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TooltipButton } from "@/components/common/TooltipButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialoge";
import { toast } from "sonner";
import { formatId } from "@/lib/utils/formatId";
import { StatusBadge } from "@/components/StatusBadge";

export function getSubscriptionColumns(role, packId, navigate, onDelete) {
  return [
    {
      id: "subscription_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subscription ID <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) => row.id ?? "-",
      cell: ({ row }) => {
        const id = row.original?.id;
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
            to={`/${role}/plans/${packId}/subscription/${id}`}
            className="font-medium text-foreground hover:underline ml-3"
          >
            {formatId(id, "SUBS")}
          </Link>
        );
      },
    },
    {
      id: "client_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client ID <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) => row.client?.id ?? "-",
      cell: ({ row }) => {
        const clientId = row.original?.client?.id;

        if (!clientId) {
          console.error("No client ID found for row:", row.original);
          return (
            <span className="font-medium text-muted-foreground ml-3">
              No ID
            </span>
          );
        }

        return (
          <Link
            to={`/${role}/client/${clientId}`}
            className="font-medium text-foreground hover:underline ml-3"
          >
            {formatId(clientId, "CLIENTS")}
          </Link>
        );
      },
    },

    {
      id: "company",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) => row.client?.company ?? "-",
      cell: ({ row, getValue }) => {
        const clientId = row.original?.client_id;
        return (
          <Link
            to={`/${role}/clients/${clientId}`}
            className="ml-3 font-medium text-foreground hover:underline"
          >
            {getValue()}
          </Link>
        );
      },
    },

    {
      id: "plan",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Plan <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) => row.plan?.name ?? "-",
      cell: ({ getValue }) => (
        <span className="ml-3 font-medium text-sm">{getValue()}</span>
      ),
    },

    {
      id: "status",
      header: "Status",
      accessorFn: (row) => row.status ?? "-",
      cell: ({ row }) => {
        const { status } = row.original;
        return <StatusBadge status={status} />;
      },
    },

    {
      id: "billing",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Billing <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) => {
        const price = row.plan_price?.price || "0";
        return parseFloat(price);
      },
      cell: ({ row }) => {
        const price = row.original.plan_price?.price || "0";
        const currency = row.original.plan_price?.currency || "USD";
        const interval = row.original.plan_price?.interval || "yearly";
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
        }).format(Number(price));
        return (
          <div className="ml-3">
            <div className="font-semibold">{formatted}</div>
            <div className="text-xs text-muted-foreground capitalize">
              /{interval}
            </div>
          </div>
        );
      },
    },

    {
      id: "started_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Started <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) => new Date(row.started_at).getTime(),
      cell: ({ row }) => {
        const date = new Date(row.original.started_at);
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return <div className="ml-3 text-sm">{formatted}</div>;
      },
    },

    {
      id: "next_billing_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Next Billing <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) =>
        row.next_billing_at ? new Date(row.next_billing_at).getTime() : 0,
      cell: ({ row }) => {
        if (!row.original.next_billing_at) {
          return <div className="ml-3 text-sm text-muted-foreground">N/A</div>;
        }
        const date = new Date(row.original.next_billing_at);
        const daysUntil = Math.ceil(
          (date - new Date()) / (1000 * 60 * 60 * 24),
        );
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return (
          <div className="ml-3">
            <div className="text-sm">{formatted}</div>
            <div className="text-xs text-muted-foreground">
              {daysUntil > 0
                ? `in ${daysUntil} days`
                : daysUntil === 0
                  ? "Today"
                  : "Overdue"}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const subscription = row.original;
        const [openConfirm, setOpenConfirm] = useState(false);
        const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

        const handleDelete = async () => {
          try {
            await onDelete?.(subscription.id);
            toast.success("Subscription cancelled successfully");
          } catch (error) {
            toast.error("Failed to cancel subscription");
          }
          setOpenConfirm(false);
        };

        return (
          <>
            <div className="flex items-center gap-2">
              <TooltipButton
                tooltip="Edit Subscription"
                variant="ghost"
                size="sm"
                onClick={() =>
                  navigate(`/${role}/subscriptions/${subscription.id}/edit`)
                }
                className="h-8 cursor-pointer"
              >
                <Edit className="h-4 w-4" />
              </TooltipButton>

              <TooltipButton
                tooltip="Cancel Subscription"
                variant="ghost"
                size="sm"
                onClick={() => setOpenConfirm(true)}
                className="h-8 cursor-pointer text-muted-foreground hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </TooltipButton>
            </div>

            <ConfirmDialog
              open={openConfirm}
              onClose={() => setOpenConfirm(false)}
              onConfirm={handleDelete}
              title="Cancel Subscription"
              description="Are you sure you want to cancel this subscription? This action cannot be undone."
              action="cancel"
            />
          </>
        );
      },
    },
  ];
}
