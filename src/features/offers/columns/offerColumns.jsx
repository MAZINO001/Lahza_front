/* eslint-disable react-hooks/rules-of-hooks */
// src/features/offers/columns/offerColumns.js
import { ArrowUpDown, Pencil, Trash, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { TooltipButton } from "@/components/common/TooltipButton";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import { StatusBadge } from "@/components/StatusBadge";
import { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialoge";
import { Button } from "@/components/ui/button";
export function getOfferColumns(role, navigate) {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Offer Title <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const offer = row.original;

        return (
          <Link
            to={`/${role}/offer/${offer.id}`}
            className="font-medium hover:underline ml-3"
          >
            {offer.title}
          </Link>
        );
      },
    },
    {
      accessorKey: "discount_type",
      header: "Type",
      cell: ({ row }) => (
        <span className="capitalize font-medium">
          {row.getValue("discount_type")}
        </span>
      ),
    },
    {
      accessorKey: "discount_value",
      header: "Discount",
      cell: ({ row }) => {
        const value = row.getValue("discount_value");
        const type = row.getValue("discount_type");
        return (
          <span className="font-medium">
            {type === "percent"
              ? `${value}%`
              : `MAD ${Number(value).toFixed(2)}`}
          </span>
        );
      },
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("start_date"));
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return date ? formatted : "—";
      },
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("end_date"));
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return date ? formatted : "—";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return <StatusBadge status={status} />;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const offer = row.original;
        const { HandleEditOffer, handleDeleteOffer } = globalFnStore();
        const [open, setOpen] = useState(false);
        return (
          <div className="flex gap-2">
            <TooltipButton
              tooltip="Edit Offer"
              onClick={() => HandleEditOffer(offer.id, navigate, role)}
              className="cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </TooltipButton>
            {role === "admin" && (
              <>
                <TooltipButton
                  tooltip="Delete Offer"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(true)}
                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  <Trash className="h-4 w-4" />
                </TooltipButton>

                <ConfirmDialog
                  open={open}
                  onClose={() => setOpen(false)}
                  onConfirm={() => {
                    handleDeleteOffer(offer.id);
                    setOpen(false);
                  }}
                  title="Remove Signature"
                  description="Are you sure you want to remove this signature? This action cannot be undone."
                  action="cancel"
                />
              </>
            )}
          </div>
        );
      },
    },
  ];
}
