/* eslint-disable react-hooks/exhaustive-deps */
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
import { getSubscriptionColumns } from "../columns/subscribersColumns";
import { ChevronDown, CreditCard } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useSubscriptions,
  useDeleteSubscription,
} from "../hooks/useSubscriptions";
import { usePlans } from "../hooks/usePlans";
import { toast } from "sonner";

export function SubscribersTable({ packId, onViewChange }) {
  const { data: subscriptions, isLoading } = useSubscriptions();
  const { data: plansData } = usePlans(packId);

  const deleteSubscription = useDeleteSubscription();
  const { role } = useAuthContext();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState("newest");
  const [activeFilter, setActiveFilter] = useState("all");
  const [globalFilter, setGlobalFilter] = useState("");

  const handleDeleteSubscription = (subscriptionId) => {
    deleteSubscription.mutateAsync(subscriptionId);
    toast.success("Subscription cancelled successfully");
  };

  const columns = React.useMemo(
    () =>
      getSubscriptionColumns(role, packId, navigate, handleDeleteSubscription),
    [role, packId, navigate],
  );

  const sortOptions = ["newest", "oldest"];
  const statusOptions = ["all", "active", "cancelled"];

  const filteredData = useMemo(() => {
    if (!subscriptions || !Array.isArray(subscriptions)) return [];

    let filtered = [...subscriptions];

    // Filter by packId - get plans that belong to this pack, then filter subscriptions by those plans
    if (packId && plansData?.data) {
      const planIdsForPack = plansData.data.map(plan => plan.id);
      filtered = filtered.filter(sub => planIdsForPack.includes(sub.plan_id));
    }

    // Filter by status
    if (activeFilter !== "all") {
      filtered = filtered.filter((sub) => sub.status === activeFilter);
    }

    // Filter by global search (company name or client id)
    if (globalFilter.trim()) {
      filtered = filtered.filter((sub) => {
        const clientId = String(sub.client_id || "").toLowerCase();
        const company = (sub.client?.company || "").toLowerCase();
        const searchTerm = globalFilter.toLowerCase();
        return clientId.includes(searchTerm) || company.includes(searchTerm);
      });
    }

    // Sort
    if (selectedSort === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } else if (selectedSort === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    }

    return filtered;
  }, [subscriptions, selectedSort, activeFilter, globalFilter, packId, plansData]);

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
    <div className="w-full pb-4 px-4 min-h-screen">
      <div className="flex justify-between mb-4">
        <div className="flex items-end justify-between gap-4">
          <FormField
            placeholder="Search by company or client ID..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 rounded-md flex items-center gap-2 transition capitalize border border-border px-2 py-[4.3px] bg-background">
                Sort: {selectedSort}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuRadioGroup
                value={selectedSort}
                onValueChange={setSelectedSort}
              >
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem key={option} value={option}>
                    <span className="capitalize">{option}</span>
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

        {role === "client" && onViewChange && (
          <Button
            variant="outline"
            onClick={() => onViewChange("cards")}
            className="flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            View All Plans
          </Button>
        )}
      </div>

      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        tableType="subscribers"
        role={role}
      />
    </div>
  );
}
