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
      header: "Created",
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

    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => {
    //     const user = row.original;
    //     const { HandleEditUser, handleDeleteUser } = globalFnStore();
    //     const [open, setOpen] = useState(false);
    //     return (
    //       <div className="flex gap-2">
    //         <Button
    //           size="sm"
    //           variant="ghost"
    //           onClick={() => HandleEditUser(user.id, navigate, role)}
    //           className="cursor-pointer"
    //         >
    //           <Pencil className="h-4 w-4" />
    //         </Button>
    //         {role === "admin" && (
    //           <>
    //             <Button
    //               variant="ghost"
    //               size="sm"
    //               onClick={() => setOpen(true)}
    //               className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
    //             >
    //               <Trash className="h-4 w-4" />
    //             </Button>

    //             <ConfirmDialog
    //               open={open}
    //               onClose={() => setOpen(false)}
    //               onConfirm={() => {
    //                 handleDeleteUser(user.id);
    //                 setOpen(false);
    //               }}
    //               title="Remove User"
    //               description="Are you sure you want to remove this user? This action cannot be undone."
    //               action="cancel"
    //             />
    //           </>
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ];
}
