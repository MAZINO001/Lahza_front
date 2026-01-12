// src/features/tickets/columns/ticketColumns.jsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatId } from "@/lib/utils/formatId";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

export const getTicketColumns = (role, navigate) => [
  {
    accessorKey: "id",
    header: "Ticket ID",
    cell: ({ row }) => {
      const ticket = row.original;
      return <div className="font-medium">{formatId(ticket.id, "TICKET")}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const ticket = row.original;
      return (
        <div>
          <div className="font-medium">{ticket.title}</div>
          <div className="text-sm text-muted-foreground">
            {ticket.description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const ticket = row.original;
      const categoryColors = {
        website: "bg-red-50 text-red-700 border-red-200",
        hosting: "bg-orange-50 text-orange-700 border-orange-200",
        billing: "bg-blue-50 text-blue-700 border-blue-200",
        general: "bg-green-50 text-green-700 border-green-200",
      };

      return (
        <Badge
          className={
            categoryColors[ticket.category] ||
            "bg-gray-50 text-gray-700 border-gray-200"
          }
        >
          {ticket.category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const ticket = row.original;
      const priorityColors = {
        high: "bg-red-100 text-red-800 border-red-200",
        medium: "bg-orange-100 text-orange-800 border-orange-200",
        low: "bg-gray-100 text-gray-800 border-gray-200",
        critical: "bg-red-200 text-red-900 border-red-300",
      };

      return (
        <Badge
          className={
            priorityColors[ticket.priority] ||
            "bg-gray-100 text-gray-800 border-gray-200"
          }
        >
          {ticket.priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const ticket = row.original;
      const statusColors = {
        open: "bg-yellow-100 text-yellow-800 border-yellow-200",
        "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
        resolved: "bg-green-100 text-green-800 border-green-200",
        closed: "bg-gray-100 text-gray-800 border-gray-200",
      };

      return (
        <Badge
          className={
            statusColors[ticket.status] ||
            "bg-gray-100 text-gray-800 border-gray-200"
          }
        >
          {ticket.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => {
      const ticket = row.original;
      return <div className="font-medium">{ticket.createdBy}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const ticket = row.original;
      return (
        <div className="text-sm">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ticket = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(ticket.id)}
            >
              Copy ticket ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(`/${role}/tickets/${ticket.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigate(`/${role}/tickets/new?edit=${ticket.id}`)
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Ticket
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ticket ${ticket.id}?`
                  )
                ) {
                  // TODO: Implement delete functionality
                  console.log("Deleting ticket:", ticket.id);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
