/* eslint-disable no-unused-vars */
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatId } from "@/lib/utils/formatId";

export const getClientColumns = (role) => [
  {
    id: "full_name",
    header: "Full Name",
    accessorFn: (row) => row.user?.name,
    cell: ({ row, getValue }) => {
      const id = row.original.id;
      return (
        <Link
          to={`/admin/client/${id}`}
          className="font-medium text-slate-900 hover:underline"
        >
          {getValue()}
        </Link>
      );
    },
  },
  {
    accessorFn: (row) => row.company || "-",
    header: "Company",
    cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
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
    accessorKey: "total_to_pay",
    header: "Total To Pay",
    cell: ({ row }) => <span className="text-slate-600">$1200.00</span>,
  },

  {
    accessorKey: "spending_total",
    header: "Total Spent",
    cell: ({ row }) => <span className="text-slate-600">$1200.00</span>,
  },
];
