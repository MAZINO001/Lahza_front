/* eslint-disable react-hooks/rules-of-hooks */
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
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.getValue("phone");
        return phone ? (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{phone}</span>
          </div>
        ) : (
          <span className="text-gray-400">—</span>
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
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
        const department = row.getValue("department");
        return department ? (
          <span className="font-medium">{department}</span>
        ) : (
          <span className="text-gray-400">—</span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("created_at");
        return date ? (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {new Date(date).toLocaleDateString()}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        );
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
        const user = row.original;
        const { HandleEditUser, handleDeleteUser } = globalFnStore();
        const [open, setOpen] = useState(false);
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => HandleEditUser(user.id, navigate, role)}
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
                    handleDeleteUser(user.id);
                    setOpen(false);
                  }}
                  title="Remove User"
                  description="Are you sure you want to remove this user? This action cannot be undone."
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
