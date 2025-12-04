// src/features/offers/columns/offerColumns.js
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import { StatusBadge } from "@/components/StatusBadge";

export const getOfferColumns = (role, navigate) => [
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
                    className="font-medium hover:underline"
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
                    {type === "percent" ? `${value}%` : `MAD ${Number(value).toFixed(2)}`}
                </span>
            );
        },
    },
    {
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ row }) => {
            const date = row.getValue("start_date");
            return date ? new Date(date).toLocaleDateString() : "—";
        },
    },
    {
        accessorKey: "end_date",
        header: "End Date",
        cell: ({ row }) => {
            const date = row.getValue("end_date");
            return date ? new Date(date).toLocaleDateString() : "—";
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

            return (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => HandleEditOffer(offer.id, navigate, role)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteOffer(offer.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];