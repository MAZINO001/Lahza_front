import React, { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import FormField from "@/Components/Form/FormField";
import { useAuthContext } from "@/hooks/AuthContext";
import { useClients } from "../hooks/useClientsQuery";
import { getClientColumns } from "../columns/clientColumns";
import CSVUploadModal from "@/components/common/CSVUploadModal";
import { Upload } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";

export function ClientTable() {
  const { data: clients = [], isLoading } = useClients();
  const { role } = useAuthContext();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const columns = React.useMemo(
    () => getClientColumns(role, navigate),
    [role, navigate]
  );

  const table = useReactTable({
    data: clients,
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
    <div className="w-full p-4 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-4">
          <FormField
            placeholder="Filter clients..."
            value={table.getColumn("full_name")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("full_name")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex gap-2">
            <Button onClick={() => setShowUploadModal(true)} variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Upload CSV
            </Button>
            <Button onClick={() => navigate(`/${role}/client/new`)}>
              Add New Client
            </Button>
          </div>
        </div>

        <DataTable table={table} columns={columns} isLoading={isLoading} />

        <CSVUploadModal
          open={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadServices`}
        />
      </div>
    </div>
  );
}
