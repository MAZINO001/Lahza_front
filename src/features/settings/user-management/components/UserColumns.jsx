import {
  ArrowUpDown,
  Pencil,
  Trash,
  Trash2,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import { StatusBadge } from "@/components/StatusBadge";
import { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialoge";

export function getUserManagementColumns(role, navigate) {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;

        return (
          <Link
            to={`/${role}/settings/users_management/${user.id}`}
            className="font-medium hover:underline"
          >
            {user.name}
          </Link>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email");
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">{email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const userRole = row.getValue("role");
        return <span className="capitalize font-medium">{userRole}</span>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Joined At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return <div className="text-sm">{formatted}</div>;
      },
    },
  ];
}
