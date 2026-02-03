import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Filter,
  Plus,
  Eye,
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
import { useAuthContext } from "@/hooks/AuthContext";
import { Badge } from "@/components/ui/badge";
import { AddProjectModal } from "@/components/common/AddProjectModal";
import { AddInvoiceModal } from "@/components/common/AddInvoiceModal";
import { AddQuoteModal } from "@/components/common/AddQuoteModal";
import { Link } from "react-router-dom";

export default function TransactionSection({
  title,
  data = [],
  isLoading,
  isOpen,
  columns = [],
  onToggle,
  currentId,
  count,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const { role } = useAuthContext();

  const filteredData = useMemo(
    () => data?.filter((data) => data?.client_id == currentId),
    [data, currentId]
  );
  const totalPages = Math.ceil((filteredData?.length || 0) / 10) || 1;

  const handleOpenModal = () => {
    if (title.toLowerCase() === "invoices") {
      setInvoiceModalOpen(true);
    } else if (title.toLowerCase() === "quotes") {
      setQuoteModalOpen(true);
    } else if (title.toLowerCase() === "projects") {
      setProjectModalOpen(true);
    }
  };

  const table = useReactTable({
    data: filteredData ?? [],
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
    return (
      <>
        <div className="p-4">Loading...</div>
        {/* Add Invoice Modal */}
        <AddInvoiceModal
          open={invoiceModalOpen}
          onOpenChange={setInvoiceModalOpen}
        />

        {/* Add Quote Modal */}
        <AddQuoteModal
          open={quoteModalOpen}
          onOpenChange={setQuoteModalOpen}
        />

        {/* Add Project Modal */}
        <AddProjectModal
          open={projectModalOpen}
          onOpenChange={setProjectModalOpen}
        />
      </>
    );
  }

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={onToggle}
        className="border border-border rounded-lg bg-background"
      >
        <div className="flex items-center justify-between p-4">
          <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{title}</span>
              <Badge className="w-5 h-5">{count || 0}</Badge>
            </div>
          </CollapsibleTrigger>

          {role !== "client" && title.toLowerCase() !== "payments" && (
            <Button size="sm" onClick={handleOpenModal}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          )}
          {title.toLowerCase() === "payments" && (
            <Link to={`/${role}/payments`}>
              <Button size="sm">See All</Button>
            </Link>
          )}
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
                  tableType={title?.toLowerCase()}
                  role={role}
                />
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        open={invoiceModalOpen}
        onOpenChange={setInvoiceModalOpen}
      />

      {/* Add Quote Modal */}
      <AddQuoteModal
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
      />

      {/* Add Project Modal */}
      <AddProjectModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
      />
    </>
  );
}
