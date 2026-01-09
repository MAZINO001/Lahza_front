// src/features/receipts/components/ReceiptTable.jsx
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FormField from "@/Components/Form/FormField";
import CsvUploadModal from "@/components/common/CsvUploadModal";
import { useAuthContext } from "@/hooks/AuthContext";
import { getReceiptColumns } from "../columns/receiptColumns";
import { useReceipts } from "../hooks/useReceipts";
import { DataTable } from "@/components/table/DataTable";
import { Upload } from "lucide-react";

export function ReceiptTable() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { data: receipts = [], isLoading } = useReceipts();
  const { role } = useAuthContext();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = React.useMemo(
    () => getReceiptColumns(role, navigate),
    [role, navigate]
  );

  const table = useReactTable({
    data: receipts,
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
    <div className="w-full p-4 bg-background min-h-screen">
      <div className="flex justify-between mb-4">
        <FormField
          placeholder="Filter receipts..."
          value={table.getColumn("clientName")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("clientName")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button onClick={() => setShowUploadModal(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </Button>
          <Link to={`/${role}/receipts/new`}>
            <Button>Add New Receipt</Button>
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
        uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadReceipts`}
      />
    </div>
  );
}
