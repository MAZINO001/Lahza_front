// src/features/services/components/ServiceTable.jsx
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import FormField from "@/Components/Form/FormField";
import { useAuthContext } from "@/hooks/AuthContext";
import { DataTable } from "@/components/table/DataTable";
import { ProjectColumns } from "../columns/projectColumns";
import { useProjects } from "../hooks/useProjects";

export function ProjectsTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const { role } = useAuthContext();
  const navigate = useNavigate();
  const { data: projects, isLoading } = useProjects();

  const columns = React.useMemo(
    () => ProjectColumns(role, navigate),
    [role, navigate]
  );

  const table = useReactTable({
    data: projects,
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
    <div className="w-full p-4 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <FormField
            placeholder="Filter by name..."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <DataTable
          table={table}
          columns={columns}
          isInvoiceTable={false}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
