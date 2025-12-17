import { ArrowUpDown, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatId } from "@/lib/utils/formatId";
import { StatusBadge } from "@/components/StatusBadge";
import { globalFnStore } from "@/hooks/GlobalFnStore";

export const ProjectColumns = (role, navigate) => {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project ID <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const id = row.getValue("id");
        return (
          <Link
            to={`/admin/project/${id}`}
            className="font-medium text-foreground hover:underline"
          >
            {formatId(id, "PROJECT")}
          </Link>
        );
      },
    },

    {
      accessorKey: "name",
      header: "Project Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },

    {
      accessorKey: "client_id",
      header: "Client",
      cell: ({ row }) => {
        const id = row.getValue("client_id");

        return (
          <Link to={`/${role}/client/${id}`}>{formatId(id, "CLIENT")}</Link>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return <StatusBadge status={status}>{status}</StatusBadge>;
      },
    },

    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row }) => (
        <span className="text-slate-700">
          {new Date(row.getValue("start_date")).toLocaleDateString()}
        </span>
      ),
    },

    {
      accessorKey: "estimated_end_date",
      header: "Est. End",
      cell: ({ row }) => (
        <span className="text-slate-700">
          {new Date(row.getValue("estimated_end_date")).toLocaleDateString()}
        </span>
      ),
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { HandleEditProject } = globalFnStore();
        console.log(row.getValue("estimated_end_date"));
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                HandleEditProject(row.getValue("id"), navigate, role)
              }
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
};
