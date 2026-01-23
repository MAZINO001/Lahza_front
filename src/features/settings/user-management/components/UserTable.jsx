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
import { useAuthContext } from "@/hooks/AuthContext";
import { getUserManagementColumns } from "./UserColumns";
import { DataTable } from "@/components/table/DataTable";
import { Upload } from "lucide-react";
import { useUsers } from "@/features/settings/hooks/useUsersQuery";
import AddClientModel from "@/components/common/AddClientModel";

export default function UserTable() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: users = { data: [] }, isLoading } = useUsers(currentPage);

  console.log("users", users);
  {
    const { role } = useAuthContext();
    const navigate = useNavigate();

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

    const columns = React.useMemo(
      () => getUserManagementColumns(role, navigate),
      [role, navigate]
    );

    const table = useReactTable({
      data: users.data,
      columns,
      state: { sorting, columnFilters },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      manualPagination: true,
      pageCount: users.last_page || 1,
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
            <AddClientModel />
          </div>
        </div>

        <DataTable
          table={table}
          columns={columns}
          isInvoiceTable={false}
          isLoading={isLoading}
          paginationData={users}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  }
}
