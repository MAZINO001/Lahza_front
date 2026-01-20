/* eslint-disable react-hooks/exhaustive-deps */
// src/features/invoices/components/InvoiceTable.jsx
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
import { useDocuments } from "../hooks/useDocumentsQuery";
import { DocumentsColumns } from "../columns/documentColumns";
import { DataTable } from "@/components/table/DataTable";

export function DocumentTable({ type }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { role } = useAuthContext();
  const navigate = useNavigate();

  const currentSection = type === "invoices" ? "invoice" : "quote";

  const { data: documents = [], isLoading } = useDocuments(type);

  console.log(documents);

  const columns = React.useMemo(
    () => DocumentsColumns(role, navigate, currentSection),
    [role, navigate],
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const table = useReactTable({
    data: documents,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,

    globalFilterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;

      const id = row.original?.id?.toString() || "";
      const status = row.original?.status?.toString().toLowerCase() || "";
      const searchTerm = filterValue.toLowerCase();

      const idMatch = id.includes(searchTerm);
      const statusMatch = status.includes(searchTerm);
      return idMatch || statusMatch;
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full p-4 h-screen">
      <div className="flex items-center justify-between mb-4">
        <FormField
          placeholder={`Search by ID or Status...`}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        {role === "admin" && (
          <div className="flex gap-3">
            <Button onClick={() => setShowUploadModal(true)} variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Upload CSV
            </Button>
            <Link to={`/${role}/${currentSection}/new`}>
              <Button>Add New {currentSection}</Button>
            </Link>
          </div>
        )}
      </div>
      <DataTable
        table={table}
        columns={columns}
        isInvoiceTable={type === "invoices"}
        isLoading={isLoading}
        globalFilter={globalFilter}
        tableType={type}
        role={role}
      />
      <CsvUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadInvoices`}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
