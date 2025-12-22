/* eslint-disable react-hooks/rules-of-hooks */
import { ArrowUpDown, Pencil, Trash, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialoge";
export function getServiceColumns(role, navigate) {
  return [
    {
      accessorKey: "image",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
            className="h-12 w-20 object-cover rounded-md"
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
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-sm text-slate-600 truncate max-w-40">
          {row.getValue("description")}
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
        const [open, setOpen] = useState(false);
        const onEdit = () => {
          HandleEditService(service.id, navigate, role);
        };

        const onDelete = async () => {
          await handleDeleteService(service.id);
        };

        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            {role === "admin" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(true)}
                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>

                <ConfirmDialog
                  open={open}
                  onClose={() => setOpen(false)}
                  onConfirm={() => {
                    onDelete();
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
