// import { ChevronDown } from "lucide-react";
// import React, { useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuthContext } from "@/hooks/AuthContext";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   useClients,
//   useDeleteClient,
// } from "@/features/clients/hooks/useClients/useClientsData";
// import AddClientModel from "../common/AddClientModel";
// import { Button } from "../ui/button";
// import Checkbox from "../Checkbox";
// import EmptySearch1 from "@/components/empty-search-1";
// import AlertDialogDestructive from "../alert-dialog-destructive-1";

// export default function Client_Sidebar({ currentId }) {
//   const { data: clients = [], isLoading, isError } = useClients();
//   const [selectedIds, setSelectedIds] = useState([]);

//   console.log(clients);

//   const { role } = useAuthContext();

//   const clientStatuses = ["all", "active", "inactive", "unpaid", "overdue"];
//   const [selectedStatus, setSelectedStatus] = useState("all");

//   const filteredData = useMemo(() => {
//     if (selectedStatus === "all") return clients;
//     return clients.filter((item) => item.client?.status === selectedStatus);
//   }, [clients, selectedStatus]);

//   const deleteClientMutation = useDeleteClient();

//   const deleteSelected = () => {
//     selectedIds.forEach((id) => {
//       deleteClientMutation.mutate(id, {
//         onSettled: () => setSelectedIds([]),
//       });
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="w-[25%] border-r p-4 text-sm text-muted-foreground">
//         Loading clients...
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="w-[25%] border-r p-4 text-sm text-red-500">
//         Failed to load clients
//       </div>
//     );
//   }

//   const toggleSelect = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );
//   };

//   return (
//     <div className="w-[25%] border-t border-r border-border h-full ">
//       <div className="px-2 py-4 border-b flex items-center justify-between">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button className="text-md flex-1 font-semibold rounded flex items-center gap-2 hover:bg-background px-2 py-1 -ml-2 transition capitalize">
//               {selectedStatus} Clients
//               <ChevronDown className="w-4 h-4" />
//             </button>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent align="start" className="w-56">
//             <DropdownMenuRadioGroup
//               value={selectedStatus}
//               onValueChange={setSelectedStatus}
//             >
//               {clientStatuses.map((status) => (
//                 <DropdownMenuRadioItem key={status} value={status}>
//                   <span className="capitalize">{status.replace("_", " ")}</span>
//                 </DropdownMenuRadioItem>
//               ))}
//             </DropdownMenuRadioGroup>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {selectedIds.length > 0 ? (
//           <AlertDialogDestructive
//             onDelete={deleteSelected}
//             trigger={
//               <Button variant="destructive">
//                 Delete ({selectedIds.length})
//               </Button>
//             }
//           />
//         ) : (
//           <AddClientModel />
//         )}
//       </div>

//       <div className="cursor-pointer  overflow-auto h-full">
//         {filteredData.length === 0 ? (
//           <EmptySearch1 />
//         ) : (
//           filteredData.map((item) => {
//             const client = item?.client;
//             const isActive = client?.id == currentId;

//             return (
//               <div
//                 key={client?.id}
//                 className={`mb-1 rounded-tr-lg rounded-br-lg p-2 border-l-2 transition flex gap-4 items-center w-full ${
//                   isActive
//                     ? "bg-blue-50 dark:bg-accent border-l-blue-500"
//                     : "border-l-transparent hover:bg-accent-foreground/10"
//                 }`}
//               >
//                 <Checkbox
//                   type="checkbox"
//                   checked={selectedIds.includes(client?.id)}
//                   onChange={() => toggleSelect(client?.id)}
//                   onClick={(e) => e.stopPropagation()}
//                   className="w-4 h-4 mt-1 cursor-pointer"
//                 />

//                 <Link to={`/${role}/client/${client?.id}`} className="flex-1">
//                   <div className="font-medium text-foreground truncate">
//                     {client?.user?.name ?? "-"}
//                   </div>

//                   <div className="text-sm text-muted-foreground">
//                     {Number(item.totalPaid).toFixed(2)} MAD
//                   </div>
//                 </Link>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }

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

export default function Client_Sidebar({ currentId }) {
  const { role } = useAuthContext();

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
      <div className="w-[25%] border-r border-border p-6 text-sm text-muted-foreground flex items-center justify-center min-h-[200px]">
        Loading clients...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-[25%] border-r border-border p-6 text-sm text-destructive flex items-center justify-center min-h-[200px] text-center">
        Failed to load clients.
        <br />
        Please try again later.
      </div>
    );
  }

  return (
    <div className="w-[25%] md:w-[20%] border-t border-r border-border flex flex-col">
      {/* Header */}
      <div className="border-b px-4 py-4 flex items-center justify-between gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex-1 justify-start gap-1.5 px-2 text-left font-medium hover:bg-accent/60"
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
              const isActive = Number(client.id) === Number(currentId);

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
                      {Number(item.totalPaid || 0).toFixed(2)} MAD
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
