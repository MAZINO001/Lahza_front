import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import FormField from "@/Components/Form/FormField";
import { useAuthContext } from "@/hooks/AuthContext";
import { getExpenseColumns } from "../columns/expenseColumns";
import { DataTable } from "@/components/table/DataTable";
import { Plus, Upload } from "lucide-react";
import CsvUploadModal from "@/components/common/CsvUploadModal";
import { useExpenses } from "../hooks/useExpenses/useExpensesData";

export default function ExpenseTable() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { role } = useAuthContext();
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const { data: expenses = [] } = useExpenses();
  const isLoading = false;

  const columns = React.useMemo(
    () => getExpenseColumns(role, navigate),
    [role, navigate],
  );

  const table = useReactTable({
    data: expenses,
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
    <div className="w-full p-4 min-h-screen">
      <div className="flex justify-between mb-4">
        <FormField
          placeholder="Filter expenses..."
          value={table.getColumn("title")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button onClick={() => setShowUploadModal(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </Button>
          {role === "admin" && (
            <Link to={`/${role}/expense/new`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Expense
              </Button>
            </Link>
          )}
        </div>
      </div>

      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        tableType="expenses"
        role={role}
      />

      <CsvUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadExpenses`}
      />
    </div>
  );
}
