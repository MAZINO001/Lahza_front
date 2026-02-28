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
import { useClients } from "../hooks/useClients/useClients";
import { getClientColumns } from "../columns/clientColumns";
import CSVUploadModal from "@/components/common/CSVUploadModal";
import { ChevronDown, Plus, Upload } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import AddClientModel from "@/components/common/AddClientModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

export function ClientTable() {
  const { data: clients, isLoading } = useClients();
  const { role } = useAuthContext();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [clientType, setClientType] = useState("all");
  const [location, setLocation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("Z-A");
  const formatAmount = useCurrencyStore((state) => state.formatAmount);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);
  const columns = React.useMemo(
    () => getClientColumns(role, formatAmount),
    [role, formatAmount],
  );

  const clientOrder = ["A-Z", "Z-A"];
  const clientTypeSelect = {
    clientType: ["all", "company", "individual"],
    location: ["all", "national", "foreign"],
  };

  const filteredData = useMemo(() => {
    if (!clients) return [];

    let filtered = [...clients];

    if (clientType !== "all") {
      filtered = filtered.filter(
        (client) => client.client.client_type === clientType,
      );
    }

    if (location !== "all") {
      filtered = filtered.filter((client) => {
        const isMorocco = client.client.country === "Maroc";

        return location === "national" ? isMorocco : !isMorocco;
      });
    }

    if (selectedStatus === "A-Z") {
      filtered.sort((a, b) =>
        (a.client?.user?.name || "").localeCompare(b.client?.user?.name || ""),
      );
    } else if (selectedStatus === "Z-A") {
      filtered.sort((a, b) =>
        (b.client?.user?.name || "").localeCompare(a.client?.user?.name || ""),
      );
    }

    return filtered;
  }, [clients, selectedStatus, clientType, location]);

  console.log(filteredData);

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
            placeholder="Filter clients By Name..."
            value={table.getColumn("full_name")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("full_name")?.setFilterValue(e.target.value)
            }
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 h-9 rounded-md text-sm flex items-center gap-2 transition capitalize border border-border px-2 py-[4.3px] bg-background">
                Order {selectedStatus}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuRadioGroup
                value={selectedStatus}
                onValueChange={selectStatus}
              >
                {clientOrder.map((status) => (
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
              <button className="flex h-9 rounded-md text-sm items-center gap-2 transition capitalize border border-border px-2 py-[4.3px] bg-background">
                {clientType === "all" ? "All Types" : clientType} •{" "}
                {location === "all" ? "All Locations" : location}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              <p className="px-2 py-1 text-xs text-muted-foreground">
                Client Type
              </p>
              <DropdownMenuRadioGroup
                value={clientType}
                onValueChange={setClientType}
              >
                {clientTypeSelect.clientType.map((type) => (
                  <DropdownMenuRadioItem key={type} value={type}>
                    <span className="capitalize">
                      {type === "all" ? "All Types" : type}
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <p className="px-2 py-1 text-xs text-muted-foreground">
                Location
              </p>
              <DropdownMenuRadioGroup
                value={location}
                onValueChange={setLocation}
              >
                {clientTypeSelect.location.map((loc) => (
                  <DropdownMenuRadioItem key={loc} value={loc}>
                    <span className="capitalize">
                      {loc === "all"
                        ? "All Locations"
                        : loc.replace("Morocco", " Morocco")}
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

      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        tableType="clients"
        role={role}
        customComponent={<AddClientModel />}
      />

      <CSVUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadClients`}
      />
    </div>
  );
}
