// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { toast } from "sonner";

// export function getClientColumns(role, formatAmount) {
//   const copyToClipboard = (text, label) => {
//     navigator.clipboard.writeText(text);
//     toast.success(`${label} copied!`, { duration: 3000 });
//   };

//   return [
//     {
//       id: "full_name",
//       header: () => <Button variant="ghost">Full Name</Button>,
//       // header: "Full Name",
//       accessorFn: (row) => row.client?.user?.name ?? "-",
//       cell: ({ row, getValue }) => {
//         const clientId = row.original?.client?.id;

//         return (
//           <Link
//             to={`/${role}/client/${clientId}`}
//             className=" text-foreground hover:underline ml-3"
//           >
//             {getValue()}
//           </Link>
//         );
//       },
//     },

//     {
//       header: "Company",
//       accessorFn: (row) => row.client?.company ?? "-",
//       cell: ({ getValue }) => <span className="">{getValue()}</span>,
//     },

//     {
//       header: "Email",
//       accessorFn: (row) => row.client?.user?.email ?? "-",
//       cell: ({ getValue }) => (
//         <p
//           onClick={() => copyToClipboard(getValue(), "Client Email")}
//           className=" text-foreground cursor-pointer hover:underline"
//         >
//           {getValue()}
//         </p>
//       ),
//     },

//     {
//       header: "Phone",
//       accessorFn: (row) => row.client?.phone ?? "-",
//       cell: ({ getValue }) => (
//         <span className="text-foreground">{getValue()}</span>
//       ),
//     },

//     {
//       header: "Total Paid",
//       accessorFn: (row) => row?.totalPaid,
//       cell: ({ getValue, row }) => {
//         const currency = row.original?.currency ?? "MAD";
//         return (
//           <span className="text-muted-foreground">
//             {formatAmount(Number(getValue()) || 0, currency.toUpperCase())}
//           </span>
//         );
//       },
//     },

//     {
//       header: "Balance Due",
//       accessorFn: (row) => row?.balanceDue,
//       cell: ({ getValue, row }) => {
//         const currency = row.original?.currency ?? "MAD";
//         return (
//           <span className="text-muted-foreground">
//             {formatAmount(Number(getValue()) || 0, currency.toUpperCase())}
//           </span>
//         );
//       },
//     },
//   ];
// }

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function getClientColumns(role, formatAmount) {
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, { duration: 3000 });
  };

  return [
    {
      id: "full_name",
      header: "Full Name",
      accessorFn: (row) => row.client?.user?.name ?? "-",
      cell: ({ row, getValue }) => {
        const clientId = row.original?.client?.id;
        return (
          <Link
            to={`/${role}/client/${clientId}`}
            className="text-foreground hover:underline ml-3"
          >
            {getValue()}
          </Link>
        );
      },
    },
    {
      id: "company",
      header: "Company",
      accessorFn: (row) => row.client?.company ?? "-",
      cell: ({ getValue }) => <span>{getValue()}</span>,
    },
    {
      id: "email",
      header: "Email",
      accessorFn: (row) => row.client?.user?.email ?? "-",
      cell: ({ getValue }) => (
        <p
          onClick={() => copyToClipboard(getValue(), "Client Email")}
          className="text-foreground cursor-pointer hover:underline"
        >
          {getValue()}
        </p>
      ),
    },
    {
      id: "phone",
      header: "Phone",
      accessorFn: (row) => row.client?.phone ?? "-",
      cell: ({ getValue }) => (
        <span className="text-foreground">{getValue()}</span>
      ),
    },
    {
      id: "total_paid",
      header: "Total Paid",
      accessorFn: (row) => row?.totalPaid,
      cell: ({ getValue, row }) => {
        const currency = row.original?.currency ?? "MAD";
        return (
          <span className="text-muted-foreground">
            {formatAmount(Number(getValue()) || 0, currency.toUpperCase())}
          </span>
        );
      },
    },
    {
      id: "balance_due",
      header: "Balance Due",
      accessorFn: (row) => row?.balanceDue,
      cell: ({ getValue, row }) => {
        const currency = row.original?.currency ?? "MAD";
        return (
          <span className="text-muted-foreground">
            {formatAmount(Number(getValue()) || 0, currency.toUpperCase())}
          </span>
        );
      },
    },
  ];
}
