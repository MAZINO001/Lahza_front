/* eslint-disable react-hooks/rules-of-hooks */
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TooltipButton } from "@/components/common/TooltipButton";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import { Badge } from "@/components/ui/badge";
import AlertDialogDestructive from "@/components/alert-dialog-destructive-1";
import { useDeleteService } from "@/features/services/hooks/useServicesData";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CategoryBadge } from "@/components/CategoryBadge";

export function getServiceColumns(role, navigate) {
  return [
    {
      accessorKey: "image",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hidden sm:flex"
        >
          Service Image <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const service = row.original;
        return (
          <img
            src={service.image}
            alt={service.name}
            className="h-12 w-20 object-cover rounded-md hidden sm:block"
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Service Name <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const service = row.original;
        return (
          <Link
            to={`/${role}/service/${service.id}`}
            className="ml-3 font-medium hover:underline"
          >
            {service.name}
          </Link>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground truncate max-w-40 hidden sm:block">
          <CategoryBadge category={row.getValue("category")} />
        </div>
      ),
    },

    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground truncate max-w-40 hidden sm:block">
          <div
            dangerouslySetInnerHTML={{ __html: row.getValue("description") }}
          />
        </div>
      ),
    },
    {
      accessorKey: "base_price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Base Price <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("base_price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "MAD",
        }).format(amount);
        return <div className="ml-3 font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const service = row.original;
        const { HandleEditService, handleDeleteService } = globalFnStore();
        const onEdit = () => {
          HandleEditService(service.id, navigate, role);
        };

        const deleteMutation = useDeleteService();
        const onDelete = async () => {
          await handleDeleteService(service.id, deleteMutation);
        };

        return (
          <div className="flex items-center gap-2">
            <TooltipButton
              tooltip="Edit Service"
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </TooltipButton>
            {role === "admin" && (
              <AlertDialogDestructive
                onDelete={() => onDelete()}
                trigger={
                  <TooltipButton
                    tooltip="Delete Service"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </TooltipButton>
                }
              />
            )}
          </div>
        );
      },
    },
  ];
}
