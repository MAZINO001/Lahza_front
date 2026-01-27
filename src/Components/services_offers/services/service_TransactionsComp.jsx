import React, { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";

export default function TransactionSection({
  title,
  data = [],
  isLoading,
  columns = [],
  role,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});


  const table = useReactTable({
    data: data ?? [],
    columns: columns ?? [],
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div>
      {table && (
        <DataTable
          table={table}
          columns={columns}
          isInvoiceTable={title === "Invoices"}
          isLoading={isLoading}
          tableType={title?.toLowerCase()}
          role={role}
        />
      )}
    </div>
  );
}
