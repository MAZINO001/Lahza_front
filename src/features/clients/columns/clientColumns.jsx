import { Link } from "react-router-dom";
import { toast } from "sonner";

export const getClientColumns = (role) => {
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, { duration: 3000 });
  };

  return [
    {
      id: "full_name",
      header: "Full Name",
      accessorFn: (row) => row.client.user?.name ?? "-",
      cell: ({ row, getValue }) => {
        const clientId = row.original.client.id;

        return (
          <Link
            to={`/${role}/client/${clientId}`}
            className="font-medium text-foreground hover:underline"
          >
            {getValue()}
          </Link>
        );
      },
    },

    {
      header: "Company",
      accessorFn: (row) => row.client.company ?? "-",
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    },

    {
      header: "Email",
      accessorFn: (row) => row.client.user?.email ?? "-",
      cell: ({ getValue }) => (
        <p
          onClick={() => copyToClipboard(getValue(), "Client Email")}
          className=" text-foreground cursor-pointer hover:underline"
        >
          {getValue()}
        </p>
      ),
    },

    {
      header: "Phone",
      accessorFn: (row) => row.client.phone ?? "-",
      cell: ({ getValue }) => (
        <span className="text-foreground">{getValue()}</span>
      ),
    },

    {
      header: "Total Paid",
      accessorFn: (row) => row.totalPaid,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {Number(getValue()).toFixed(2)} MAD
        </span>
      ),
    },

    {
      header: "Balance Due",
      accessorFn: (row) => row.balanceDue,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {Number(getValue()).toFixed(2)} MAD
        </span>
      ),
    },
  ];
};
