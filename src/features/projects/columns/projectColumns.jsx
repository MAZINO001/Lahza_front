import { ArrowUpDown, CopyPlus, Pencil, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { TooltipButton } from "@/components/common/TooltipButton";
import { Button } from "@/components/ui/button";
import { formatId } from "@/lib/utils/formatId";
import { StatusBadge } from "@/components/StatusBadge";
import { globalFnStore } from "@/hooks/GlobalFnStore";

export function ProjectColumns(role, navigate) {
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
            to={`/${role}/project/${id}`}
            className="font-medium text-foreground hover:underline ml-3"
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

    ...(role !== "client"
      ? [
          {
            accessorKey: "client_id",
            header: "Client ID",
            cell: ({ row }) => {
              const id = row.getValue("client_id");

              return (
                <Link
                  to={`/${role}/client/${id}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {formatId(id, "CLIENT")}
                </Link>
              );
            },
          },
        ]
      : []),
    {
      accessorKey: "invoices",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice Id <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const invoices = row.getValue("invoices") || [];
        return (
          <div className="flex flex-col gap-2">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  to={`/${role}/invoice/${invoice.id}`}
                  className="font-medium text-foreground hover:underline ml-3"
                >
                  {formatId(invoice.id, "INVOICE")}
                </Link>
              ))
            ) : (
              <span>-</span>
            )}
          </div>
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
      accessorKey: "estimated_end_date",
      header: "Est. End",
      cell: ({ row }) => {
        const date = new Date(row.getValue("estimated_end_date"));
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return date ? formatted : "—";
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { HandleCloneProject } = globalFnStore();
        if (role === "client") {
          return <div className="text-muted-foreground">—</div>;
        }

        return (
          <div className="flex gap-2">
            <TooltipButton
              tooltip="Clone Project"
              onClick={() =>
                HandleCloneProject(row.getValue("id"), navigate, role)
              }
              className="cursor-pointer"
            >
              <CopyPlus className="h-4 w-4" />
            </TooltipButton>
          </div>
        );
      },
    },
  ];
}
