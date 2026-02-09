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
import { usePlans } from "../hooks/usePlans";
import { getPlansColumns } from "../columns/plansColumns";
import { ChevronDown, Plus } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import { PlanForm } from "./PlanForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeletePlan } from "../hooks/usePlans";

export function PlanesTable({ packId }) {
  const { data: plans, isLoading } = usePlans(packId);
  const { role } = useAuthContext();
  const navigate = useNavigate();
  const deletePlan = useDeletePlan();


  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("A-Z");
  const [selectedPack, setSelectedPack] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");

  const columns = React.useMemo(
    () => getPlansColumns(role, navigate, (planId) => {
      if (window.confirm("Are you sure you want to delete this plan?")) {
        deletePlan.mutate(planId);
      }
    }),
    [role, navigate, deletePlan],
  );

  const planOrder = ["A-Z", "Z-A"];
  const statusOptions = ["all", "active", "inactive"];

  const filteredData = useMemo(() => {
    if (!plans || !Array.isArray(plans)) return [];

    let filtered = [...plans];

    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (plan) => plan.is_active === (activeFilter === "active")
      );
    }

    if (selectedStatus === "A-Z") {
      filtered.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    } else if (selectedStatus === "Z-A") {
      filtered.sort((a, b) =>
        (b.name || "").localeCompare(a.name || "")
      );
    }

    return filtered;
  }, [plans, selectedStatus, activeFilter]);

  const selectStatus = (status) => {
    setSelectedStatus(status);
  };

  const table = useReactTable({
    data: filteredData || [],
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
        <div className="flex items-end justify-between gap-4">
          <FormField
            placeholder="Filter plans by name..."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 rounded-md flex items-center gap-2 transition capitalize border border-border px-2 py-[4.3px] bg-background">
                Order {selectedStatus}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuRadioGroup
                value={selectedStatus}
                onValueChange={selectStatus}
              >
                {planOrder.map((status) => (
                  <DropdownMenuRadioItem key={status} value={status}>
                    <span className="capitalize">
                      {status.replace("_", " ")}
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex rounded-md items-center gap-2 transition capitalize border border-border px-2 py-[4.3px] bg-background">
                {activeFilter === "all" ? "All Status" : activeFilter}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuRadioGroup
                value={activeFilter}
                onValueChange={setActiveFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownMenuRadioItem key={status} value={status}>
                    <span className="capitalize">
                      {status === "all" ? "All Status" : status}
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Plan
          </Button>
        </div>
      </div>

      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        tableType="plans"
        role={role}
      />

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
          </DialogHeader>
          <PlanForm
            packId={packId}
            onSuccess={() => setShowCreateModal(false)}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
