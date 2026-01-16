import { ChevronDown } from "lucide-react";
import React, { useMemo, useState } from "react";
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
} from "@/features/clients/hooks/useClientsQuery";
import AddClientModel from "../common/AddClientModel";
import { Button } from "../ui/button";
import Checkbox from "../Checkbox";

export default function Client_Sidebar({ currentId }) {
  const { data: clients = [], isLoading, isError } = useClients();
  const [selectedIds, setSelectedIds] = useState([]);

  const { role } = useAuthContext();

  const clientStatuses = ["all", "active", "inactive", "unpaid", "overdue"];
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredData = useMemo(() => {
    if (selectedStatus === "all") return clients;
    return clients.filter((item) => item.client?.status === selectedStatus);
  }, [clients, selectedStatus]);

  const deleteClientMutation = useDeleteClient();

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;

    selectedIds.forEach((id) => {
      deleteClientMutation.mutate(id);
    });

    setSelectedIds([]);
  };

  if (isLoading) {
    return (
      <div className="w-[25%] border-r p-4 text-sm text-muted-foreground">
        Loading clients...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-[25%] border-r p-4 text-sm text-red-500">
        Failed to load clients
      </div>
    );
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-[25%]  bg-background border-r border-border h-full ">
      <div className="px-2 py-4 border-b flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-md flex-1 font-semibold rounded flex items-center gap-2 hover:bg-background px-2 py-1 -ml-2 transition capitalize">
              {selectedStatus} Clients
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuRadioGroup
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              {clientStatuses.map((status) => (
                <DropdownMenuRadioItem key={status} value={status}>
                  <span className="capitalize">{status.replace("_", " ")}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedIds.length > 0 ? (
          <Button onClick={deleteSelected} variant="destructive">
            Delete ({selectedIds.length})
          </Button>
        ) : (
          <AddClientModel />
        )}
      </div>

      <div className="cursor-pointer  overflow-auto h-full">
        {filteredData.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No client found
          </div>
        ) : (
          filteredData.map((item) => {
            const client = item.client;
            const isActive = client.id == currentId;

            return (
              <div
                key={client.id}
                className={`mb-1 rounded-tr-lg rounded-br-lg p-2 border-l-2 transition flex gap-4 items-center w-full ${
                  isActive
                    ? "bg-blue-50 border-l-blue-500"
                    : "border-l-transparent hover:bg-accent-foreground"
                }`}
              >
                <Checkbox
                  type="checkbox"
                  checked={selectedIds.includes(client.id)}
                  onChange={() => toggleSelect(client.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 mt-1 cursor-pointer"
                />

                <Link to={`/${role}/client/${client.id}`} className="flex-1">
                  <div className="font-medium text-foreground truncate">
                    {client.user?.name ?? "-"}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {Number(item.totalPaid).toFixed(2)} MAD
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
