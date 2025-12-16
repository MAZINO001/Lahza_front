import React, { useMemo, useState } from "react";
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
import { ChevronDown, Upload } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import AddClientModel from "@/components/common/AddClientModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function ClientTable() {
  const { data: clients, isLoading } = useClients();
  const { role } = useAuthContext();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const columns = React.useMemo(
    () => getClientColumns(role, navigate),
    [role, navigate]
  );

  const clientStatuses = ["all", "active", "inactive", "unpaid", "overdue"];
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredData = useMemo(() => {
    return selectedStatus === "all"
      ? clients
      : clients.filter((item) => item.status === selectedStatus);
  }, [clients, selectedStatus]);

  const selectStatus = (status) => {
    setSelectedStatus(status);
  };

  const table = useReactTable({
    data: filteredData,
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
          <div className="flex items-end justify-between gap-4">
            <FormField
              placeholder="Filter clients..."
              value={table.getColumn("full_name")?.getFilterValue() ?? ""}
              onChange={(e) =>
                table.getColumn("full_name")?.setFilterValue(e.target.value)
              }
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-md flex-1 font-semibold rounded-md flex items-center gap-2 transition capitalize border border-border px-2 py-[4.3px]">
                  {selectedStatus} Clients
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuRadioGroup
                  value={selectedStatus}
                  onValueChange={selectStatus}
                >
                  {clientStatuses.map((status) => (
                    <DropdownMenuRadioItem key={status} value={status}>
                      <span className="capitalize">
                        {status.replace("_", " ")}
                      </span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setShowUploadModal(true)} variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Upload CSV
            </Button>
            <AddClientModel />
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
