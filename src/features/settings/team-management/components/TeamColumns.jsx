import { useAuthContext } from "@/hooks/AuthContext";
import { formatId } from "@/lib/utils/formatId";

import { Link } from "react-router-dom";

export default function TeamColumns() {
  const { role } = useAuthContext();
  return [
    {
      header: "User ID",
      accessorFn: (row) => row.user?.id ?? "-",
      cell: ({ getValue }) => (
        <Link
          to={`/${role}/settings/users_management/${getValue()}`}
          className="font-medium text-foreground"
        >
          {formatId(getValue(), "USER")}
        </Link>
      ),
    },
    {
      header: "Name",
      accessorFn: (row) => row.user?.name ?? "-",
      cell: ({ getValue }) => (
        <span className="font-medium text-foreground">{getValue()}</span>
      ),
    },
    {
      header: "Email",
      accessorFn: (row) => row.user?.email ?? "-",
      cell: ({ getValue }) => (
        <a href={`mailto:${getValue()}`} className="text-foreground">
          {getValue()}
        </a>
      ),
    },
    {
      header: "Job Title",
      accessorFn: (row) => row.poste ?? "-",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    },
    {
      header: "Department",
      accessorFn: (row) => row.department ?? "-",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    },
  ];
}
