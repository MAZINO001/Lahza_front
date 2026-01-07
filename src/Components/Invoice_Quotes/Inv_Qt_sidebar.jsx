/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Menu, Plus, ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { StatusBadge } from "../StatusBadge";
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
    <div className=" w-[280px] bg-background border-r flex flex-col ">
      <div className="px-2 py-4 border-b flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-md flex-1 font-semibold rounded flex items-center gap-2 hover:bg-background px-2 py-1 -ml-2 transition capitalize">
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

        <Link to={`/${role}/${currentSection}/new`}>
          <Button className="px-4 py-2 text-sm cursor-pointer">
            <Plus className="w-4 h-4" /> New
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredData.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No {type === "invoices" ? "documents" : "quotes"} found
          </div>
        ) : (
          filteredData.map((item) => (
            <Link
              to={`/${role}/${currentSection}/${item.id}`}
              key={item.id}
              onMouseEnter={() => prefetchData(item.id)}
              onFocus={() => prefetchData(item.id)}
              className={`block mb-1 rounded-tr-lg rounded-br-lg p-2 cursor-pointer border-l-2 transition ${
                item.id == currentId
                  ? "bg-blue-50 border-l-blue-500"
                  : "border-l-transparent hover:bg-background"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-medium text-foreground">
                  {item?.client?.user?.name}
                </span>
                <span className="font-semibold text-foreground">
                  {item.total_amount} MAD
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600">
                  {type === "invoices" ? item.id : item.quote_number}
                </span>
                <span className="text-muted-foreground">
                  {type === "invoices"
                    ? item.invoice_date
                    : item.quotation_date}
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
