// /* eslint-disable no-unused-vars */
// import { ChevronDown, MoreHorizontal, Plus } from "lucide-react";
// import React, { useMemo, useState } from "react";
// import { Button } from "../ui/button";
// import { Link, useParams } from "react-router-dom";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { useForm } from "react-hook-form";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useClients } from "@/features/clients/hooks/useClientsQuery";
// import AddClientModel from "../common/AddClientModel";
// import { usePayment } from "@/features/payments/hooks/usePaymentQuery";
// export default function Client_Sidebar({ currentId }) {
//   const {
//     data: clients,
//     isLoading: clientsLoading,
//     isError: clientsError,
//   } = useClients();

//   const { role } = useAuthContext();
//   const clientStatuses = ["all", "active", "inactive", "unpaid", "overdue"];
//   const [selectedStatus, setSelectedStatus] = useState("all");

//   const filteredData = useMemo(() => {
//     return selectedStatus === "all"
//       ? clients
//       : clients.filter((item) => item.status === selectedStatus);
//   }, [clients, selectedStatus]);

//   const selectStatus = (status) => {
//     setSelectedStatus(status);
//   };
//   return (
//     <div className="w-[25%] bg-white border-r border-border">
//       <div className="px-2 py-4 border-b flex items-center justify-between">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button className="text-md flex-1 font-semibold rounded flex items-center gap-2 hover:bg-gray-50 px-2 py-1 -ml-2 transition capitalize">
//               {selectedStatus} Clients
//               <ChevronDown className="w-4 h-4" />
//             </button>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent align="start" className="w-56">
//             <DropdownMenuRadioGroup
//               value={selectedStatus}
//               onValueChange={selectStatus}
//             >
//               {clientStatuses.map((status) => (
//                 <DropdownMenuRadioItem key={status} value={status}>
//                   <span className="capitalize">{status.replace("_", " ")}</span>
//                 </DropdownMenuRadioItem>
//               ))}
//             </DropdownMenuRadioGroup>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <div className="flex gap-2 items-center">
//           <AddClientModel />
//         </div>
//       </div>

//       <div className="cursor-pointer">
//         {filteredData.length === 0 ? (
//           <div className="p-4 text-center text-gray-500 text-sm">
//             No Client found
//           </div>
//         ) : (
//           filteredData.map((c, index) => (
//             <Link
//               to={`/${role}/client/${c.id}`}
//               key={index}
//               className={`block mb-1 rounded-tr-lg rounded-br-lg p-2 cursor-pointer border-l-2 transition ${
//                 c.id == currentId
//                   ? "bg-blue-50 border-l-blue-500"
//                   : "border-l-transparent hover:bg-gray-100"
//               }`}
//             >
//               <div className="font-medium text-gray-900 max-w-[70%]">
//                 {c.user?.name}
//               </div>
//               <div className="text-md text-gray-500">0.00 MAD</div>
//             </Link>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
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
import { useClients } from "@/features/clients/hooks/useClientsQuery";
import AddClientModel from "../common/AddClientModel";

export default function Client_Sidebar({ currentId }) {
  const { data: clients = [], isLoading, isError } = useClients();
  const { role } = useAuthContext();

  const clientStatuses = ["all", "active", "inactive", "unpaid", "overdue"];
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredData = useMemo(() => {
    if (selectedStatus === "all") return clients;
    return clients.filter((item) => item.client?.status === selectedStatus);
  }, [clients, selectedStatus]);

  if (isLoading) {
    return (
      <div className="w-[25%] border-r p-4 text-sm text-gray-500">
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

  return (
    <div className="w-[25%] bg-white border-r border-border">
      {/* Header */}
      <div className="px-2 py-4 border-b flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-md flex-1 font-semibold rounded flex items-center gap-2 hover:bg-gray-50 px-2 py-1 -ml-2 transition capitalize">
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

        <AddClientModel />
      </div>

      {/* Client list */}
      <div className="cursor-pointer">
        {filteredData.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No client found
          </div>
        ) : (
          filteredData.map((item) => {
            const client = item.client;
            const isActive = client.id == currentId;

            return (
              <Link
                key={client.id}
                to={`/${role}/client/${client.id}`}
                className={`block mb-1 rounded-tr-lg rounded-br-lg p-2 border-l-2 transition ${
                  isActive
                    ? "bg-blue-50 border-l-blue-500"
                    : "border-l-transparent hover:bg-gray-100"
                }`}
              >
                <div className="font-medium text-gray-900 truncate">
                  {client.user?.name ?? "-"}
                </div>

                <div className="text-sm text-gray-500">
                  {Number(item.totalPaid).toFixed(2)} MAD
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
