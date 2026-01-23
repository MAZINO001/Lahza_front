// import React, { useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Plus, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
// import { Link, useParams } from "react-router-dom";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { StatusBadge } from "@/components/StatusBadge";
// import { useQueryClient } from "@tanstack/react-query";
// import api from "@/lib/utils/axios";
// import { usePayments } from "@/features/payments/hooks/usePaymentQuery";
// import { formatId } from "@/lib/utils/formatId";
// import FormField from "@/Components/Form/FormField";
// import EmptySearch1 from "@/components/empty-search-1";

// export default function Receipt_sidebar() {
//   const currentSection = "receipt";

//   const { id: currentId } = useParams();
//   const { role } = useAuthContext();
//   const queryClient = useQueryClient();

//   const { data: payments } = usePayments();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("date");
//   const [sortOrder, setSortOrder] = useState("desc");

//   const filteredData = useMemo(() => {
//     let filtered =
//       payments?.filter((payment) => payment.status === "paid") || [];

//     // Filter by invoice ID
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (payment) =>
//           payment.invoice_id
//             ?.toString()
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           formatId(payment.invoice_id || payment.id, "INVOICE")
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()),
//       );
//     }

//     // Sort by selected field
//     filtered.sort((a, b) => {
//       let aValue, bValue;

//       switch (sortBy) {
//         case "date":
//           aValue = new Date(a.created_at);
//           bValue = new Date(b.created_at);
//           break;
//         case "amount":
//           aValue = parseFloat(a.amount);
//           bValue = parseFloat(b.amount);
//           break;
//         default:
//           return 0;
//       }

//       if (sortOrder === "asc") {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//     return filtered;
//   }, [payments, searchTerm, sortBy, sortOrder]);

//   const prefetchData = async (id) => {
//     await queryClient.prefetchQuery({
//       queryKey: [id],
//       queryFn: () =>
//         api
//           .get(`${import.meta.env.VITE_BACKEND_URL}/payments/${id}`)
//           .then((res) => res.data?.quote ?? res.data?.invoice ?? {})
//           .catch(() => ({})),
//       staleTime: 0,
//     });
//   };

//   return (
//     <div className=" w-[280px] border-t border-r  flex flex-col ">
//       <div className="px-2 py-3 border-b space-y-3">
//         <FormField
//           placeholder="Search by Invoice ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full"
//         />

//         <div className="flex gap-2">
//           <Button
//             variant={sortBy === "date" ? "default" : "outline"}
//             size="sm"
//             onClick={() => {
//               if (sortBy === "date") {
//                 setSortOrder(sortOrder === "desc" ? "asc" : "desc");
//               } else {
//                 setSortBy("date");
//                 setSortOrder("desc");
//               }
//             }}
//             className="flex-1 text-xs"
//           >
//             Date
//             {sortBy === "date" &&
//               (sortOrder === "desc" ? (
//                 <ArrowDown className="w-3 h-3 ml-1" />
//               ) : (
//                 <ArrowUp className="w-3 h-3 ml-1" />
//               ))}
//           </Button>

//           <Button
//             variant={sortBy === "amount" ? "default" : "outline"}
//             size="sm"
//             onClick={() => {
//               if (sortBy === "amount") {
//                 setSortOrder(sortOrder === "desc" ? "asc" : "desc");
//               } else {
//                 setSortBy("amount");
//                 setSortOrder("desc");
//               }
//             }}
//             className="flex-1 text-xs"
//           >
//             Amount
//             {sortBy === "amount" &&
//               (sortOrder === "desc" ? (
//                 <ArrowDown className="w-3 h-3 ml-1" />
//               ) : (
//                 <ArrowUp className="w-3 h-3 ml-1" />
//               ))}
//           </Button>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {filteredData?.length === 0 ? (
//           <EmptySearch1 />
//         ) : (
//           filteredData?.map((item) => (
//             <Link
//               to={`/${role}/${currentSection}/${item.id}`}
//               key={item.id}
//               onMouseEnter={() => prefetchData(item.id)}
//               onFocus={() => prefetchData(item.id)}
//               className={`block mb-1 rounded-tr-lg rounded-br-lg p-2 cursor-pointer border-l-2 transition ${
//                 item.id == currentId
//                   ? "bg-blue-50 dark:bg-accent dark border-l-blue-500 "
//                   : "border-l-transparent hover:bg-accent-foreground/10"
//               }`}
//             >
//               <div className="flex items-start justify-between mb-2">
//                 <span className="font-medium text-foreground">
//                   {formatId(item.id, "RECEIPT")}
//                 </span>
//                 <span className="font-semibold text-foreground">
//                   {new Intl.NumberFormat("fr-MA", {
//                     style: "currency",
//                     currency: "MAD",
//                   }).format(parseFloat(item.amount))}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">
//                   {new Date(item.updated_at).toLocaleDateString("en-US", {
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
import { Plus, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { StatusBadge } from "@/components/StatusBadge";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { usePayments } from "@/features/payments/hooks/usePaymentQuery";
import { formatId } from "@/lib/utils/formatId";
import FormField from "@/Components/Form/FormField";
import EmptySearch1 from "@/components/empty-search-1";
import { cn } from "@/lib/utils";

export default function Receipt_sidebar() {
  const currentSection = "receipt";

  const { id: currentId } = useParams();
  const { role } = useAuthContext();
  const queryClient = useQueryClient();

  const { data: payments } = usePayments();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredData = useMemo(() => {
    let filtered =
      payments?.filter((payment) => payment.status === "paid") || [];

    // Filter by invoice ID
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.invoice_id
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          formatId(payment.invoice_id || payment.id, "INVOICE")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Sort by selected field
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case "amount":
          aValue = parseFloat(a.amount);
          bValue = parseFloat(b.amount);
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [payments, searchTerm, sortBy, sortOrder]);

  const prefetchData = async (id) => {
    await queryClient.prefetchQuery({
      queryKey: [id],
      queryFn: () =>
        api
          .get(`${import.meta.env.VITE_BACKEND_URL}/payments/${id}`)
          .then((res) => res.data?.quote ?? res.data?.invoice ?? {})
          .catch(() => ({})),
      staleTime: 0,
    });
  };

  return (
    <div className="w-[25%] md:w-[20%] border-t border-r border-border flex flex-col">
      {/* Search + Sort Controls */}
      <div className="border-b px-4 py-4 space-y-3">
        <FormField
          placeholder="Search by Invoice ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <div className="flex gap-2">
          <Button
            variant={sortBy === "date" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (sortBy === "date") {
                setSortOrder(sortOrder === "desc" ? "asc" : "desc");
              } else {
                setSortBy("date");
                setSortOrder("desc");
              }
            }}
            className="flex-1 gap-1.5 text-xs font-medium"
          >
            Date
            {sortBy === "date" &&
              (sortOrder === "desc" ? (
                <ArrowDown className="h-3.5 w-3.5" />
              ) : (
                <ArrowUp className="h-3.5 w-3.5" />
              ))}
          </Button>

          <Button
            variant={sortBy === "amount" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (sortBy === "amount") {
                setSortOrder(sortOrder === "desc" ? "asc" : "desc");
              } else {
                setSortBy("amount");
                setSortOrder("desc");
              }
            }}
            className="flex-1 gap-1.5 text-xs font-medium"
          >
            Amount
            {sortBy === "amount" &&
              (sortOrder === "desc" ? (
                <ArrowDown className="h-3.5 w-3.5" />
              ) : (
                <ArrowUp className="h-3.5 w-3.5" />
              ))}
          </Button>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filteredData?.length === 0 ? (
          <div className="flex h-full items-center justify-center p-6">
            <EmptySearch1 />
          </div>
        ) : (
          <div className="space-y-1">
            {filteredData?.map((item) => {
              const isActive = Number(item.id) === Number(currentId);

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
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium truncate leading-tight">
                      {formatId(item.id, "RECEIPT")}
                    </span>

                    <span className="font-semibold text-foreground whitespace-nowrap">
                      {new Intl.NumberFormat("fr-MA", {
                        style: "currency",
                        currency: "MAD",
                      }).format(parseFloat(item.amount || 0))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {new Date(item.updated_at).toLocaleDateString("en-US", {
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
