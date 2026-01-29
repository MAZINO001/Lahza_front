import * as React from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAuthContext } from "@/hooks/AuthContext";
import { DataTable } from "../table/DataTable";
import { dashBoardTableColumns } from "@/features/dashboard/dashboardTableColumn";
import { useDocuments } from "@/features/documents/hooks/useDocuments/useDocumentsQueryData";
import { useState } from "react"
export default function Invoices() {
  const { role } = useAuthContext();

  const { data: documents = [], isLoading } = useDocuments("invoices");

  const columns = React.useMemo(
    () => dashBoardTableColumns(role),
    [role]
  );


  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: documents,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
}
