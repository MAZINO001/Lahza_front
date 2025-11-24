import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus, ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ServicesSidebar({ data = [] }) {
  const title = "Services";
  const { id: currentId } = useParams();
  const { role } = useAuthContext();
  const queryClient = useQueryClient();

  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredData = data.filter((service) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "active") return service.status === "active";
    if (selectedFilter === "inActive") return service.status === "inactive"; // or "inActive" — match your backend exactly!
    return true;
  });

  const prefetchService = async (id) => {
    await queryClient.prefetchQuery({
      queryKey: ["service", id],
      queryFn: () =>
        api
          .get(`${import.meta.env.VITE_BACKEND_URL}/services/${id}`)
          .then((res) => res.data?.service ?? {})
          .catch(() => ({})),
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
                All Services
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="active">
                Active
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inActive">
                Inactive
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to={`/${role}/service/new`}>
          <Button className="px-4 py-2 text-sm">
            <Plus className="w-4 h-4" /> New
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No services found
          </div>
        ) : (
          filteredData.map((service) => (
            <Link
              key={service.id}
              to={`/${role}/service/${service.id}`}
              onMouseEnter={() => prefetchService(service.id)}
              onFocus={() => prefetchService(service.id)}
              className={`block mb-1 rounded-tr-lg rounded-br-lg p-3 cursor-pointer border-l-2 transition-all ${
                service.id == currentId
                  ? "bg-blue-50 border-l-blue-500"
                  : "border-l-transparent hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="font-medium text-gray-900 truncate">
                  {service.name}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-blue-600">
                    ${Number(service.base_price).toFixed(2)}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      service.status === "active"
                        ? "bg-green-100 text-green-800"
                        : service.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {service.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
