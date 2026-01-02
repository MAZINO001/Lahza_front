/* eslint-disable no-unused-vars */
// src/features/tasks/components/TasksTable.jsx
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import FormField from "@/components/Form/FormField";
import { getTaskColumns } from "../columns/taskColumns";
import { useTasks } from "../hooks/useTasksQuery";
import { DataTable } from "@/components/table/DataTable";
import { ArrowLeft, Plus } from "lucide-react";
import { useAuthContext } from "@/hooks/AuthContext";

export function TasksTable() {
  const { id: projectId } = useParams();
  const { data: tasks = [], isLoading } = useTasks(projectId);
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = React.useMemo(
    () => getTaskColumns(navigate, role, projectId),
    [navigate, role, projectId]
  );

  const table = useReactTable({
    data: tasks,
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <Link
            to={-1}
            className="flex items-center gap-2 text-md text-muted-foreground hover:text-foreground transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <FormField
            placeholder="Filter tasks..."
            value={table.getColumn("title")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Link to={`../task/new`} relative="path">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Task
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
