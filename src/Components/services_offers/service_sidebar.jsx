import React, { useState } from "react";
import { Button } from "../ui/button";
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
import { useServices } from "@/features/services/hooks/useServiceQuery";
import { useOffers } from "@/features/offers/hooks/useOffersQuery";

export default function ServicesSidebar({ type, currentId }) {
  const title = type === "service" ? "Services" : "Offers";

  const servicesQuery = useServices();
  const offersQuery = useOffers();

  const { role } = useAuthContext();
  const queryClient = useQueryClient();

  const [selectedFilter, setSelectedFilter] = useState("all");

  const data = type === "service" ? servicesQuery.data || [] : offersQuery.data || [];
  const isLoading = type === "service" ? servicesQuery.isLoading : offersQuery.isLoading;
  const isError = type === "service" ? servicesQuery.isError : offersQuery.isError;

  const filteredData = data.filter((item) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "active") return item.status === "active";
    if (selectedFilter === "inActive") return item.status === "inactive";
    return true;
  });

  const prefetchItem = async (currentId) => {
    await queryClient.prefetchQuery({
      queryKey: [type, currentId],
      queryFn: () =>
        api
          .get(`${import.meta.env.VITE_BACKEND_URL}/${type}s/${currentId}`)
          .then((res) => res.data ?? {}),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <div className="w-[260px] bg-white border-r flex flex-col">
      <div className="px-2 py-4 border-b flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-md flex-1 font-semibold rounded flex items-center gap-2 hover:bg-gray-50 px-2 py-1 -ml-2 transition capitalize">
              {selectedFilter === "all"
                ? "All"
                : selectedFilter === "inActive"
                  ? "Inactive"
                  : selectedFilter}{" "}
              {title}
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuRadioGroup
              value={selectedFilter}
              onValueChange={setSelectedFilter}
            >
              <DropdownMenuRadioItem value="all">
                All {title}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="active">
                Active {title}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inActive">
                Inactive {title}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to={`/${role}/${type}/new`}>
          <Button className="px-4 py-2 text-sm">
            <Plus className="w-4 h-4" /> New
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No {title.toLowerCase()} found
          </div>
        ) : (
          filteredData.map((item) => (
            <Link
              key={item.id}
              to={`/${role}/${type}/${item.id}`}
              onMouseEnter={() => prefetchItem(item.id)}
              onFocus={() => prefetchItem(item.id)}
              className={`block mb-1 rounded-tr-lg rounded-br-lg p-3 cursor-pointer border-l-2 transition-all ${item.id == currentId
                ? "bg-blue-50 border-l-blue-500"
                : "border-l-transparent hover:bg-gray-50"
                }`}
            >
              <div className="flex flex-col gap-2">
                <div className="font-medium text-gray-900 truncate">
                  {type === "service" ? item.name : item.title}
                </div>

                <div className="flex justify-between items-center">
                  {type === "service" && (
                    <span className="text-lg font-semibold text-blue-600">
                      ${Number(item.base_price).toFixed(2)}
                    </span>
                  )}
                  <StatusBadge status={item.status} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
