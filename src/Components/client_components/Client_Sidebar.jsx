import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useClients,
  useDeleteClient,
} from "@/features/clients/hooks/useClients/useClientsData";
import AddClientModel from "../common/AddClientModel";
import { Button } from "../ui/button";
import Checkbox from "../Checkbox";
import EmptySearch1 from "@/components/empty-search-1";
import AlertDialogDestructive from "../alert-dialog-destructive-1";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

export default function Client_Sidebar({ currentId }) {
  const { role } = useAuthContext();
  const formatAmount = useCurrencyStore((state) => state.formatAmount);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);
  const { data: clients = [], isLoading, isError } = useClients();
  const deleteClientMutation = useDeleteClient();

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const clientStatuses = ["all", "active", "inactive", "unpaid", "overdue"];

  const filteredData = useMemo(() => {
    if (selectedStatus === "all") return clients;
    return clients.filter((item) => item.client?.status === selectedStatus);
  }, [clients, selectedStatus]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const deleteSelected = () => {
    selectedIds.forEach((id) => {
      deleteClientMutation.mutate(id, {
        onSettled: () => setSelectedIds([]),
      });
    });
  };

  if (isLoading) {
    return (
      <div className="w-[30%] border-r border-border p-4 text-sm text-muted-foreground flex items-center justify-center min-h-[200px]">
        Loading clients...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-[25%] border-r border-border p-4 text-sm text-destructive flex items-center justify-center min-h-[200px] text-center">
        Failed to load clients.
        <br />
        Please try again later.
      </div>
    );
  }

  return (
    <div className="w-[30%] md:w-[25%] border-t border-r border-border flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 justify-start gap-1.5 px-2 text-left bg-transparent font-medium hover:bg-accent/60  "
            >
              {selectedStatus === "all"
                ? "All Clients"
                : selectedStatus.charAt(0).toUpperCase() +
                  selectedStatus.slice(1) +
                  " Clients"}
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuRadioGroup
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              {clientStatuses.map((status) => (
                <DropdownMenuRadioItem key={status} value={status}>
                  {status === "all"
                    ? "All Clients"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedIds.length > 0 ? (
          <AlertDialogDestructive
            onDelete={deleteSelected}
            trigger={
              <Button variant="destructive" size="sm">
                Delete ({selectedIds.length})
              </Button>
            }
          />
        ) : (
          <AddClientModel />
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filteredData.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8">
            <EmptySearch1 />
          </div>
        ) : (
          <div className="space-y-1">
            {filteredData.map((item) => {
              const client = item?.client;
              const isActive = Number(client?.id) === Number(currentId);

              return (
                <div
                  key={client?.id}
                  className={cn(
                    "group flex items-start  gap-3 rounded-lg p-3 text-sm transition-all duration-150",
                    isActive
                      ? "bg-primary/10 border-l-primary text-primary font-medium shadow-sm"
                      : "border-l-transparent text-muted-foreground hover:bg-background/70 hover:text-foreground hover:shadow-sm",
                  )}
                >
                  <Checkbox
                    checked={selectedIds.includes(client?.id)}
                    onChange={() => toggleSelect(client?.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 shrink-0 cursor-pointer"
                  />

                  <Link
                    to={`/${role}/client/${client?.id}`}
                    className="flex-1 min-w-0"
                  >
                    <div className="font-medium truncate leading-tight">
                      {client?.user?.name ?? "Unnamed Client"}
                    </div>

                    <div className="text-sm text-muted-foreground mt-2">
                      {formatAmount(item.totalPaid || 0, "MAD")}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
