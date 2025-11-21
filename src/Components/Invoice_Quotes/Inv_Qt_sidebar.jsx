// import React from "react";
// import { Button } from "../ui/button";
// import { Menu, Plus } from "lucide-react";
// import { Link, useParams } from "react-router-dom";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { StatusBadge } from "../StatusBadge";
// import { useQueryClient } from "@tanstack/react-query";
// import api from "@/utils/axios";

// export default function Inv_Qt_sidebar({ type, data }) {
//   const title = type === "invoice" ? "All Invoices" : "All Quotes";
//   const { id: currentId } = useParams();
//   const { role } = useAuthContext();
//   const queryClient = useQueryClient();

//   const prefetchData = async (id) => {
//     const resource = type === "invoice" ? "invoices" : "quotes";
//     await queryClient.prefetchQuery({
//       queryKey: [resource.slice(0, -1), id],
//       queryFn: () =>
//         api
//           .get(`${import.meta.env.VITE_BACKEND_URL}/${resource}/${id}`)
//           .then((res) => res.data?.quote ?? res.data?.invoice ?? {})
//           .catch((err) => {
//             console.error(err);
//             return {};
//           }),
//       staleTime: 5 * 60 * 1000,
//     });
//   };
//   return (
//     <div className="w-[260px] bg-white border-r flex flex-col">
//       <div className="px-2 py-4 border-b flex items-center gap-3">
//         {/* <h1 className="text-lg flex-1 font-medium rounded">{title}</h1> */}
//         <h1 className="text-lg flex-1 font-medium rounded">

//         </h1>
//         <Link to={`/${role}/${type}/new`}>
//           <Button className="px-4 py-2 text-sm cursor-pointer">
//             <Plus className="w-4 h-4" />
//             New
//           </Button>
//         </Link>
//         <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
//           <Menu size={20} />
//         </button>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {data.map((data, index) => (
//           <Link
//             to={`/${role}/${type}/${data.id}`}
//             key={index}
//             onMouseEnter={() => prefetchData(data.id)}
//             onFocus={() => prefetchData(data.id)}
//             className={`block mb-1 rounded-tr-lg rounded-br-lg p-2 cursor-pointer border-l-2 transition ${
//               data.id == currentId
//                 ? "bg-blue-50 border-l-blue-500"
//                 : "border-l-transparent hover:bg-gray-100"
//             }`}
//           >
//             <div className="flex items-start justify-between mb-2">
//               <span className="font-medium text-gray-900">
//                 {data?.client?.user?.name}
//               </span>
//               <span className="font-semibold text-gray-900">
//                 {data.total_amount}
//               </span>
//             </div>
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-blue-600">
//                 {type == "invoice" ? data.invoice_number : data.quote_number}
//               </span>
//               <span className="text-gray-500">
//                 {type == "invoice" ? data.invoice_date : data.quotation_date}
//               </span>
//               <span className="px-2 py-0.5 rounded text-xs font-medium ">
//                 <StatusBadge status={data.status} />
//               </span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Menu, Plus, ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { StatusBadge } from "../StatusBadge";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Inv_Qt_sidebar({ type, data }) {
  const title = type === "invoice" ? "Invoices" : "Quotes";
  const { id: currentId } = useParams();
  const { role } = useAuthContext();
  const queryClient = useQueryClient();

  // Filter statuses
  const quoteStatuses = [
    "all",
    "draft",
    "sent",
    "confirmed",
    "signed",
    "rejected",
  ];
  const invoiceStatuses = [
    "all",
    "draft",
    "sent",
    "unpaid",
    "partially_paid",
    "paid",
    "overdue",
  ];

  const availableStatuses =
    type === "invoice" ? invoiceStatuses : quoteStatuses;

  // FIX: Default to "All"
  const [selectedStatus, setSelectedStatus] = useState("all");

  const selectStatus = (status) => {
    setSelectedStatus(status);
  };

  // FIX: Only filter when not "All"
  const filteredData =
    selectedStatus === "all"
      ? data
      : data.filter((item) => item.status === selectedStatus);

  const prefetchData = async (id) => {
    const resource = type === "invoice" ? "invoices" : "quotes";
    await queryClient.prefetchQuery({
      queryKey: [resource.slice(0, -1), id],
      queryFn: () =>
        api
          .get(`${import.meta.env.VITE_BACKEND_URL}/${resource}/${id}`)
          .then((res) => res.data?.quote ?? res.data?.invoice ?? {})
          .catch(() => ({})),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <div className=" w-[260px] bg-white border-r flex flex-col ">
      <div className="px-2 py-4 border-b flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-md flex-1 font-semibold rounded flex items-center gap-2 hover:bg-gray-50 px-2 py-1 -ml-2 transition capitalize">
              {selectedStatus} {title}
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuRadioGroup
              value={selectedStatus}
              onValueChange={selectStatus}
            >
              {availableStatuses.map((status) => (
                <DropdownMenuRadioItem key={status} value={status}>
                  <span className="capitalize">{status.replace("_", " ")}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to={`/${role}/${type}/new`}>
          <Button className="px-4 py-2 text-sm cursor-pointer">
            <Plus className="w-4 h-4" /> New
          </Button>
        </Link>

        {/* <button
          onClick={handleCloseSideBar}
          className="p-2 hover:bg-gray-100 rounded cursor-pointer"
        >
          <Menu size={20} />
        </button> */}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredData.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No {type === "invoice" ? "invoices" : "quotes"} found
          </div>
        ) : (
          filteredData.map((item) => (
            <Link
              to={`/${role}/${type}/${item.id}`}
              key={item.id}
              onMouseEnter={() => prefetchData(item.id)}
              onFocus={() => prefetchData(item.id)}
              className={`block mb-1 rounded-tr-lg rounded-br-lg p-2 cursor-pointer border-l-2 transition ${
                item.id == currentId
                  ? "bg-blue-50 border-l-blue-500"
                  : "border-l-transparent hover:bg-gray-100"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {item?.client?.user?.name}
                </span>
                <span className="font-semibold text-gray-900">
                  {item.total_amount}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600">
                  {type === "invoice" ? item.invoice_number : item.quote_number}
                </span>
                <span className="text-gray-500">
                  {type === "invoice" ? item.invoice_date : item.quotation_date}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-medium">
                  <StatusBadge status={item.status} />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
