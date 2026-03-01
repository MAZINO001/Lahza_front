// import React, { useState } from "react";
// import { Button } from "../ui/button";
// import { Plus, ChevronDown } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { useQueryClient } from "@tanstack/react-query";
// import api from "@/lib/utils/axios";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { StatusBadge } from "../StatusBadge";
// import { useServices } from "@/features/services/hooks/useServices";
// import { useOffers } from "@/features/offers/hooks/useOffersQuery";
// import EmptySearch1 from "@/components/empty-search-1";

// export default function ServicesSidebar({ type, currentId }) {
//   const title = type === "service" ? "Services" : "Offers";

//   const servicesQuery = useServices();
//   const offersQuery = useOffers();

//   const { role } = useAuthContext();
//   const queryClient = useQueryClient();

//   const [selectedFilter, setSelectedFilter] = useState("all");

//   const data =
//     type === "service" ? servicesQuery.data || [] : offersQuery.data || [];
//   const isLoading =
//     type === "service" ? servicesQuery.isLoading : offersQuery.isLoading;
//   const isError =
//     type === "service" ? servicesQuery.isError : offersQuery.isError;

//   const filteredData = data.filter((item) => {
//     if (selectedFilter === "all") return true;
//     if (selectedFilter === "active") return item.status === "active";
//     if (selectedFilter === "inActive") return item.status === "inactive";
//     return true;
//   });

//   const prefetchItem = async (currentId) => {
//     await queryClient.prefetchQuery({
//       queryKey: [type, currentId],
//       queryFn: () =>
//         api
//           .get(`${import.meta.env.VITE_BACKEND_URL}/${type}s/${currentId}`)
//           .then((res) => res.data ?? {}),
//       staleTime: 0,
//     });
//   };

//   return (
//     <div className="w-[260px] border-t border-r flex flex-col">
//       <div className="px-2 py-4 border-b flex items-center gap-3">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button className="text-md flex-1 font-semibold rounded flex items-center gap-2 hover:bg-background px-2 py-1 -ml-2 transition capitalize">
//               {selectedFilter === "all"
//                 ? "All"
//                 : selectedFilter === "inActive"
//                   ? "Inactive"
//                   : selectedFilter}{" "}
//               {title}
//               <ChevronDown className="w-4 h-4" />
//             </button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="start" className="w-56">
//             <DropdownMenuRadioGroup
//               value={selectedFilter}
//               onValueChange={setSelectedFilter}
//             >
//               <DropdownMenuRadioItem value="all">
//                 All {title}
//               </DropdownMenuRadioItem>
//               <DropdownMenuRadioItem value="active">
//                 Active {title}
//               </DropdownMenuRadioItem>
//               <DropdownMenuRadioItem value="inActive">
//                 Inactive {title}
//               </DropdownMenuRadioItem>
//             </DropdownMenuRadioGroup>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <Link to={`/${role}/${type}/new`}>
//           <Button className="px-4 py-2 text-sm">
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
//               key={item.id}
//               to={`/${role}/${type}/${item.id}`}
//               onMouseEnter={() => prefetchItem(item.id)}
//               onFocus={() => prefetchItem(item.id)}
//               className={`block mb-1 rounded-tr-lg rounded-br-lg p-3 cursor-pointer border-l-2 transition-all ${
//                 item.id == currentId
//                   ? "bg-blue-50 dark:bg-accent border-l-blue-500"
//                   : "border-l-transparent hover:bg-accent-foreground/10"
//               }`}
//             >
//               <div className="flex flex-col gap-2">
//                 <div className="font-medium text-foreground truncate">
//                   {type === "service" ? item.name : item.title}
//                 </div>

//                 <div className="flex justify-between items-center">
//                   {type === "service" && (
//                     <span className="text-lg font-semibold text-blue-600">
//                       {Number(item.base_price).toFixed(2)} MAD
//                     </span>
//                   )}
//                   <StatusBadge status={item.status} />
//                 </div>
//               </div>
//             </Link>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "../StatusBadge";
import { useServices } from "@/features/services/hooks/useServices";
import { useOffers } from "@/features/offers/hooks/useOffersQuery";
import EmptySearch1 from "@/components/empty-search-1";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import { useTranslation } from "react-i18next";

export default function ServicesSidebar({ type, currentId }) {
  const { t } = useTranslation();
  const title =
    type === "service"
      ? t("sidebar.services_offers.title_services")
      : t("sidebar.services_offers.title_offers");
  const isService = type === "service";
  const formatAmount = useCurrencyStore((state) => state.formatAmount);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);
  const servicesQuery = useServices();
  const offersQuery = useOffers();

  const { role } = useAuthContext();
  const queryClient = useQueryClient();

  const [selectedFilter, setSelectedFilter] = useState("all");

  const data = isService ? servicesQuery.data || [] : offersQuery.data || [];
  const isLoading = isService ? servicesQuery.isLoading : offersQuery.isLoading;
  const isError = isService ? servicesQuery.isError : offersQuery.isError;

  const filteredData = data.filter((item) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "active") return item.status === "active";
    if (selectedFilter === "inActive") return item.status === "inactive";
    return true;
  });

  const prefetchItem = async (id) => {
    await queryClient.prefetchQuery({
      queryKey: [type, id],
      queryFn: () =>
        api
          .get(`${import.meta.env.VITE_BACKEND_URL}/${type}s/${id}`)
          .then((res) => res.data ?? {}),
      staleTime: 0,
    });
  };

  return (
    <div className="w-[30%] md:w-[25%] border-r border-border  flex flex-col">
      <div className="border-b border-t px-4 py-4 flex items-center justify-between gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex-1 justify-start gap-2 px-2 text-left font-medium hover:bg-accent/60"
            >
              {selectedFilter === "all"
                ? t("sidebar.services_offers.filter_all", { title })
                : selectedFilter === "inActive"
                  ? t("sidebar.services_offers.filter_inactive", { title })
                  : t("sidebar.services_offers.filter_active", { title })}
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuRadioGroup
              value={selectedFilter}
              onValueChange={setSelectedFilter}
            >
              <DropdownMenuRadioItem value="all">
                {t("sidebar.services_offers.filter_all", { title })}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="active">
                {t("sidebar.services_offers.filter_active", { title })}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inActive">
                {t("sidebar.services_offers.filter_inactive", { title })}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" asChild>
          <Link to={`/${role}/${type}/new`}>
            <Plus className="mr-1.5 h-4 w-4" />
            {t("sidebar.services_offers.new_button")}
          </Link>
        </Button>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            {t("sidebar.services_offers.loading", {
              title: title.toLowerCase(),
            })}
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center text-destructive text-sm p-4 text-center">
            {t("sidebar.services_offers.error", { title: title.toLowerCase() })}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <EmptySearch1 />
          </div>
        ) : (
          <div className="space-y-1">
            {filteredData.map((item) => {
              const isActive = Number(item.id) === Number(currentId);
              const name = isService ? item.name : item.title;

              return (
                <Link
                  key={item.id}
                  to={`/${role}/${type}/${item.id}`}
                  onMouseEnter={() => prefetchItem(item.id)}
                  onFocus={() => prefetchItem(item.id)}
                  className={cn(
                    "group flex flex-col gap-2 rounded-lg p-3 text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/10 border-l-primary text-primary font-medium shadow-sm"
                      : "border-l-transparent text-muted-foreground hover:bg-background/70 hover:text-foreground hover:shadow-sm",
                  )}
                >
                  <div className="font-medium truncate leading-tight">
                    {name}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    {isService && (
                      <span
                        className={cn(
                          "font-semibold",
                          isActive ? "text-primary" : "text-foreground/90",
                        )}
                      >
                        {formatAmount(item.base_price || 0, "MAD")}
                      </span>
                    )}
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
