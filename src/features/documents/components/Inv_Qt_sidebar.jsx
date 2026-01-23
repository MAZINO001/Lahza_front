// import React, { useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Menu, Plus, ChevronDown } from "lucide-react";
// import { Link, useParams } from "react-router-dom";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { StatusBadge } from "@/components/StatusBadge";
// import { useQueryClient } from "@tanstack/react-query";
// import api from "@/lib/utils/axios";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useDocuments } from "@/features/documents/hooks/useDocumentsQuery";
// import EmptySearch1 from "@/components/empty-search-1";

// export default function Inv_Qt_sidebar({ type }) {
//   const currentSection = type === "invoices" ? "invoice" : "quote";
//   const {
//     data: documents = [],
//     isLoading: documentsLoading,
//     isError: documentsError,
//   } = useDocuments(type);

//   const title = type === "invoices" ? "Invoices" : "Quotes";
//   const { id: currentId } = useParams();
//   const { role } = useAuthContext();
//   const queryClient = useQueryClient();

//   const quoteStatuses = [
//     "all",
//     "draft",
//     "sent",
//     "confirmed",
//     "signed",
//     "rejected",
//   ];
//   const invoiceStatuses = [
//     "all",
//     "draft",
//     "sent",
//     "unpaid",
//     "partially_paid",
//     "paid",
//     "overdue",
//   ];

//   const availableStatuses =
//     type === "invoices" ? invoiceStatuses : quoteStatuses;

//   const [selectedStatus, setSelectedStatus] = useState("all");

//   const selectStatus = (status) => {
//     setSelectedStatus(status);
//   };

//   const filteredData = useMemo(() => {
//     return selectedStatus === "all"
//       ? documents
//       : documents.filter((item) => item.status === selectedStatus);
//   }, [documents, selectedStatus]);

//   const prefetchData = async (id) => {
//     await queryClient.prefetchQuery({
//       queryKey: [type, id],
//       queryFn: () =>
//         api
//           .get(`${import.meta.env.VITE_BACKEND_URL}/${type}/${id}`)
//           .then((res) => res.data?.quote ?? res.data?.invoice ?? {})
//           .catch(() => ({})),
//       staleTime: 0,
//     });
//   };

//   return (
//     <div className=" w-[280px] border-t border-r flex flex-col ">
//       <div className="px-2 py-4 border-b flex items-center gap-3">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button className="text-md flex-1 font-semibold rounded flex items-center gap-2 hover:bg-background px-2 py-1 -ml-2 transition capitalize">
//               {selectedStatus} {title}
//               <ChevronDown className="w-4 h-4" />
//             </button>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent align="start" className="w-56">
//             <DropdownMenuRadioGroup
//               value={selectedStatus}
//               onValueChange={selectStatus}
//             >
//               {availableStatuses.map((status) => (
//                 <DropdownMenuRadioItem key={status} value={status}>
//                   <span className="capitalize">{status.replace("_", " ")}</span>
//                 </DropdownMenuRadioItem>
//               ))}
//             </DropdownMenuRadioGroup>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <Link to={`/${role}/${currentSection}/new`}>
//           <Button className="px-4 py-2 text-sm cursor-pointer">
//             <Plus className="w-4 h-4" /> New
//           </Button>
//         </Link>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {filteredData.length === 0 ? (
//           <EmptySearch1 />
//         ) : (
//           filteredData.map((item) => (
//             <Link
//               to={`/${role}/${currentSection}/${item.id}`}
//               key={item.id}
//               onMouseEnter={() => prefetchData(item.id)}
//               onFocus={() => prefetchData(item.id)}
//               className={`block mb-1 rounded-tr-lg rounded-br-lg p-2 cursor-pointer border-l-2 transition ${
//                 item.id == currentId
//                   ? "bg-blue-50 dark:bg-accent border-l-blue-500"
//                   : "border-l-transparent hover:bg-accent-foreground/10"
//               }`}
//             >
//               <div className="flex items-start justify-between mb-2">
//                 <span className="font-medium text-foreground">
//                   {item?.client?.user?.name}
//                 </span>
//                 <span className="font-semibold text-foreground">
//                   {item.total_amount} MAD
//                 </span>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">
//                   {new Date(
//                     type === "invoices"
//                       ? item.invoice_date
//                       : item.quotation_date,
//                   ).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </span>

//                 <span className="px-2 py-0.5 rounded text-xs font-medium">
//                   <StatusBadge status={item.status} />
//                 </span>
//               </div>
//             </Link>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Plus, ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { StatusBadge } from "@/components/StatusBadge";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDocuments } from "@/features/documents/hooks/useDocumentsQuery";
import EmptySearch1 from "@/components/empty-search-1";
import { cn } from "@/lib/utils";

export default function Inv_Qt_sidebar({ type }) {
  const currentSection = type === "invoices" ? "invoice" : "quote";
  const {
    data: documents = [],
    isLoading: documentsLoading,
    isError: documentsError,
  } = useDocuments(type);

  const title = type === "invoices" ? "Invoices" : "Quotes";
  const { id: currentId } = useParams();
  const { role } = useAuthContext();
  const queryClient = useQueryClient();

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
    type === "invoices" ? invoiceStatuses : quoteStatuses;

  const [selectedStatus, setSelectedStatus] = useState("all");

  const selectStatus = (status) => {
    setSelectedStatus(status);
  };

  const filteredData = useMemo(() => {
    return selectedStatus === "all"
      ? documents
      : documents.filter((item) => item.status === selectedStatus);
  }, [documents, selectedStatus]);

  const prefetchData = async (id) => {
    await queryClient.prefetchQuery({
      queryKey: [type, id],
      queryFn: () =>
        api
          .get(`${import.meta.env.VITE_BACKEND_URL}/${type}/${id}`)
          .then((res) => res.data?.quote ?? res.data?.invoice ?? {})
          .catch(() => ({})),
      staleTime: 0,
    });
  };
  return (
    <div className="w-[25%] md:w-[20%] border-t border-r border-border flex flex-col">
      <div className="border-b px-4 py-4 flex items-center justify-between gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex-1 justify-start gap-1.5 px-2 text-left font-medium hover:bg-accent/60"
            >
              {selectedStatus === "all"
                ? "All Documents"
                : selectedStatus.charAt(0).toUpperCase() +
                  selectedStatus.slice(1)}
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuRadioGroup
              value={selectedStatus}
              onValueChange={selectStatus}
            >
              {availableStatuses.map((status) => (
                <DropdownMenuRadioItem key={status} value={status}>
                  {status === "all"
                    ? "All"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" asChild>
          <Link to={`/${role}/${currentSection}/new`}>
            <Plus className="mr-1.5 h-4 w-4" />
            New
          </Link>
        </Button>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filteredData.length === 0 ? (
          <div className="flex h-full items-center justify-center p-6">
            <EmptySearch1 />
          </div>
        ) : (
          <div className="space-y-1">
            {filteredData.map((item) => {
              const isActive = Number(item.id) === Number(currentId);
              const name = item?.client?.user?.name || "Unnamed Client";
              const amount = Number(item.total_amount || 0);

              return (
                <Link
                  key={item.id}
                  to={`/${role}/${currentSection}/${item.id}`}
                  onMouseEnter={() => prefetchData(item.id)}
                  onFocus={() => prefetchData(item.id)}
                  className={cn(
                    "group relative flex flex-col gap-2 rounded-lg p-3 text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/10 border-l-primary text-primary font-medium shadow-sm"
                      : "border-l-transparent text-muted-foreground hover:bg-background/70 hover:text-foreground hover:shadow-sm",
                  )}
                >
                  {/* Top row: Name + Amount */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium truncate leading-tight">
                      {name}
                    </span>

                    <span className="font-semibold whitespace-nowrap">
                      {new Intl.NumberFormat("fr-MA", {
                        style: "currency",
                        currency: "MAD",
                      }).format(amount)}
                    </span>
                  </div>

                  {/* Bottom row: Date + Status */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {new Date(
                        type === "invoices"
                          ? item.invoice_date
                          : item.quotation_date,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>

                    <StatusBadge status={item.status} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
