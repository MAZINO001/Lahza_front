// src/features/services/components/ServiceTable.jsx
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import FormField from "@/Components/Form/FormField";
import CsvUploadModal from "@/components/common/CsvUploadModal";
import { useAuthContext } from "@/hooks/AuthContext";
import { getServiceColumns } from "../columns/serviceColumns"; // ← your columns
import { DataTable } from "@/components/table/DataTable";
import { useServices } from "../hooks/useServiceQuery";

export function ServiceTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { role } = useAuthContext();
  const navigate = useNavigate();
  const { data: services, isLoading } = useServices();
  const columns = React.useMemo(
    () => getServiceColumns(role, navigate),
    [role, navigate]
  );

  const table = useReactTable({
    data: services,
    columns: columns,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full p-4 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <FormField
          placeholder="Filter by name..."
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
          <Link to={`/${role}/service/new`}>
            <Button>Add New Service</Button>
          </Link>
        </div>
      </div>

      <DataTable
        table={table}
        columns={columns}
        isInvoiceTable={false}
        isLoading={isLoading}
      />

      <CsvUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadServices`}
      />
    </div>
  );
}
