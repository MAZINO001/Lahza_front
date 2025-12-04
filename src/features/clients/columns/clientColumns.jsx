import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatId } from "@/lib/utils/formatId";

export const getClientColumns = (role) => [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                User ID <ArrowUpDown className="ml-1 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const id = row.getValue("id");
            return (
                <Link
                    to={`/admin/client/${id}`}
                    className="font-medium text-slate-900 hover:underline"
                >
                    {formatId(id, "QUOTE")}
                </Link>
            );
        },
    },
    {
        id: "full_name",
        header: "Full Name",
        accessorFn: (row) => row.user?.name,
        cell: ({ getValue }) => <div>{getValue()}</div>,
    },
    {
        header: "Email",
        accessorFn: (row) => row.user?.email,
        cell: ({ getValue }) => (
            <a href={`mailto:${getValue()}`} className="cursor-pointer">
                {getValue()}
            </a>
        ),
    },

    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
            <div className="text-slate-700">{row.getValue("phone")}</div>
        ),
    },
    {
        accessorFn: (row) => row.company || "-",
        header: "Company",
        cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
    },
    {
        accessorKey: "client_type",
        header: "Client Type",
        cell: ({ row }) => (
            <span className="text-slate-600">{row.getValue("client_type")}</span>
        ),
    },
    {
        accessorKey: "spending_total",
        header: "Total Spent",
        cell: ({ row }) => <span className="text-slate-600">$1200.00</span>,
    },
    // {
    //   accessorKey: "city",
    //   header: "City",
    //   cell: ({ row }) => <div>{row.getValue("city")}</div>,
    // },
    // {
    //   accessorKey: "country",
    //   header: "Country",
    //   cell: ({ row }) => <div>{row.getValue("country")}</div>,
    // },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   header: "Actions",
    //   cell: ({ row }) => {
    //     const user = row.original;

    //     const handleView = () => {
    //       alert(`Viewing ${user.company}`);
    //     };

    //     return (
    //       <div className="flex items-center gap-2">
    //         <Button
    //           size="sm"
    //           variant="outline"
    //           className="h-8"
    //           onClick={handleView}
    //         >
    //           <Eye className="w-4 h-4 mr-1" /> View
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
];
