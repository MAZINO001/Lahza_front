/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const getClientColumns = (role) => {
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, {
      duration: 3000,
    });
  };
  return [
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
        <p
          onClick={() => copyToClipboard(getValue(), "Client Email")}
          className="cursor-pointer"
        >
          {getValue()}
        </p>
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
      cell: ({ row }) => <span className="text-slate-600">0.00 MAD</span>,
    },

    {
      accessorKey: "spending_total",
      header: "Total Spent",
      cell: ({ row }) => <span className="text-slate-600">0.00 MAD</span>,
    },
  ];
};
