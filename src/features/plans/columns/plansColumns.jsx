import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function getPlansColumns(role, navigate, onDelete) {
  return [
    {
      id: "name",
      header: () => <Button variant="ghost">Plan Name</Button>,
      accessorFn: (row) => row.name ?? "-",
      cell: ({ row, getValue }) => {
        const planId = row.original?.id;

        return (
          <Link
            to={`/${role}/plans/${planId}`}
            className="font-medium text-foreground hover:underline ml-3"
          >
            {getValue()}
          </Link>
        );
      },
    },

    {
      header: "Pack",
      accessorFn: (row) => row.pack?.name ?? "-",
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    },

    {
      header: "Description",
      accessorFn: (row) => row.description ?? "-",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground text-sm max-w-xs truncate">
          {getValue()}
        </span>
      ),
    },

    {
      header: "Pricing",
      accessorFn: (row) => {
        if (!row.prices?.length) return "-";
        const lowestPrice = Math.min(...row.prices.map((p) => p.price));
        const currency = row.prices[0]?.currency || "USD";
        return `${lowestPrice.toFixed(2)} ${currency}`;
      },
      cell: ({ row, getValue }) => {
        const prices = row.original?.prices || [];
        if (!prices.length) return <span>-</span>;

        return (
          <div className="space-y-1">
            {prices.slice(0, 2).map((price, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">
                  {price.price.toFixed(2)} {price.currency}
                </span>
                <span className="text-muted-foreground ml-1">
                  /{price.interval}
                </span>
              </div>
            ))}
            {prices.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{prices.length - 2} more
              </span>
            )}
          </div>
        );
      },
    },

    {
      header: "Features",
      accessorFn: (row) => row.custom_fields?.length || 0,
      cell: ({ getValue }) => (
        <Badge variant="secondary">{getValue()} features</Badge>
      ),
    },

    {
      header: "Status",
      accessorFn: (row) => row.is_active,
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "default" : "secondary"}>
          {getValue() ? "Active" : "Inactive"}
        </Badge>
      ),
    },

    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const plan = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/${role}/plans/${plan.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(plan.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
