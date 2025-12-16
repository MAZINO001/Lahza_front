import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Filter,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";

export default function TransactionSection({
  title,
  data = [],
  isLoading,
  isOpen,
  columns = [],
  onToggle,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;
  const { role } = useAuthContext();
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
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="border border-border rounded-lg bg-white"
    >
      <div className="flex items-center justify-between p-4">
        <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
          <span className="font-medium text-gray-900">{title}</span>
        </CollapsibleTrigger>

        <Link to={`/${role}/${title.toLowerCase().slice(0, -1)}/new`}>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </Link>
      </div>
      <CollapsibleContent>
        <div className="border-t border-border">
          <div className="pt-4 px-4">
            {table && (
              <DataTable
                table={table}
                columns={columns}
                isInvoiceTable={title === "Invoices"}
                isLoading={isLoading}
              />
            )}
          </div>

          <div className="p-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total Count:{" "}
              <a href="#" className="text-blue-600 hover:underline">
                View
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-700 px-2">
                {currentPage} - {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
