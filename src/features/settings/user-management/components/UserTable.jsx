/* eslint-disable no-unused-vars */
// src/features/settings/components/management/usermanagement/UserTable.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import FormField from "@/components/Form/FormField";
import CsvUploadModal from "@/components/common/CsvUploadModal";
import { useAuthContext } from "@/hooks/AuthContext";
import { getUserManagementColumns } from "./UserColumns";
import { DataTable } from "@/components/table/DataTable";
import { Upload, UserPlus } from "lucide-react";
import { useUsers } from "@/features/settings/hooks/useUsersQuery";

export default function UserTable() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  // const { data: users = [], isLoading } = useUsers();

  const users = [
    {
      id: "1",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      phone: "123-456-7890",
      role: "admin",
      department: "IT",
      created_at: "2023-01-15T10:00:00Z",
      status: "active",
    },
    {
      id: "2",
      name: "Bob Johnson",
      email: "bob.j@example.com",
      phone: null,
      role: "editor",
      department: "Marketing",
      created_at: "2023-03-20T11:30:00Z",
      status: "inactive",
    },
    {
      id: "3",
      name: "Charlie Brown",
      email: "charlie.b@example.com",
      phone: "098-765-4321",
      role: "viewer",
      department: "Sales",
      created_at: "2023-02-10T09:15:00Z",
      status: "active",
    },
    {
      id: "4",
      name: "Diana Prince",
      email: "diana.p@example.com",
      phone: "111-222-3333",
      role: "admin",
      department: "HR",
      created_at: "2023-04-01T14:00:00Z",
      status: "suspended",
    },
    {
      id: "5",
      name: "Eve Adams",
      email: "eve.a@example.com",
      phone: null,
      role: "editor",
      department: "IT",
      created_at: "2023-05-05T16:45:00Z",
      status: "active",
    },
  ];

  const isLoading = false;

  const { role } = useAuthContext();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = React.useMemo(
    () => getUserManagementColumns(role, navigate),
    [role, navigate]
  );

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="flex justify-between mb-4">
        <FormField
          placeholder="Filter users..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button onClick={() => setShowUploadModal(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </Button>
          <Link to={`/${role}/user/new`}>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        table={table}
        columns={columns}
        isInvoiceTable={false}
        isLoading={isLoading}
      />
    </div>
  );
}
