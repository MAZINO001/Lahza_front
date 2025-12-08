/* eslint-disable no-unused-vars */
import { ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useForm } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClients } from "@/features/clients/hooks/useClientsQuery";
export default function Client_Sidebar({ currentId }) {
  const {
    data: clients = [],
    isLoading: clientsLoading,
    isError: clientsError,
  } = useClients();

  const { role } = useAuthContext();
  const {
    register,
    handleSubmit,
    watch: Watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const clientStatuses = ["all", "active", "inactive", "unpaid", "overdue"];
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredData = useMemo(() => {
    return selectedStatus === "all"
      ? clients
      : clients.filter((item) => item.status === selectedStatus);
  }, [clients, selectedStatus]);


  const selectStatus = (status) => {
    setSelectedStatus(status);
  };
  return (
    <div className="w-[25%] bg-white border-r border-gray-200">
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
              onValueChange={selectStatus}
            >
              {clientStatuses.map((status) => (
                <DropdownMenuRadioItem key={status} value={status}>
                  <span className="capitalize">{status.replace("_", " ")}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2 items-center">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New
          </Button>
        </div>
      </div>

      <div className="cursor-pointer">
        {filteredData.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No Client found
          </div>
        ) : (
          filteredData.map((c, index) => (
            <Link
              to={`/${role}/client/${c.id}`}
              key={index}
              className={`flex items-center justify-between rounded-tr-lg rounded-br-lg  px-2 py-4 cursor-pointer border-l-2 transition ${c.id === currentId
                ? "bg-blue-50 border-l-blue-500"
                : "border-l-transparent hover:bg-gray-100"
                }`}
            >
              <div className="font-medium text-gray-900 max-w-[70%]">{c.user?.name}</div>
              <div className="text-md text-gray-500">MAD 0.00</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
