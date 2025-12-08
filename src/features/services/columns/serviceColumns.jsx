import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { globalFnStore } from "@/hooks/GlobalFnStore";

export const getServiceColumns = (role, navigate) => [
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
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            className="cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
