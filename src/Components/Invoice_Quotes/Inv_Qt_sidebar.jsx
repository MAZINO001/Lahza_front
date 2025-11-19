import React from "react";
import { Button } from "../ui/button";
import { Menu, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { StatusBadge } from "../StatusBadge";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axios";

export default function Inv_Qt_sidebar({ type, data }) {
  const title = type === "invoice" ? "All Invoices" : "All Quotes";
  const { id: currentId } = useParams();
  const { role } = useAuth();
  const queryClient = useQueryClient();

  const prefetchData = async (id) => {
    const resource = type === "invoice" ? "invoices" : "quotes";
    await queryClient.prefetchQuery({
      queryKey: [resource.slice(0, -1), id],
      queryFn: () =>
        api
          .get(`${import.meta.env.VITE_BACKEND_URL}/${resource}/${id}`)
          .then((res) => res.data?.quote ?? res.data?.invoice ?? {})
          .catch((err) => {
            console.error(err);
            return {};
          }),
      staleTime: 5 * 60 * 1000,
    });
  };
  return (
    <div className="w-[260px] bg-white border-r flex flex-col">
      <div className="px-2 py-4 border-b flex items-center gap-3">
        <h1 className="text-lg flex-1 font-medium rounded">{title}</h1>
        <Link to={`/${role}/${type}/new`}>
          <Button className="px-4 py-2 text-sm cursor-pointer">
            <Plus className="w-4 h-4" />
            New
          </Button>
        </Link>
        <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
          <Menu size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {data.map((data, index) => (
          <Link
            to={`/${role}/${type}/${data.id}`}
            key={index}
            onMouseEnter={() => prefetchData(data.id)}
            onFocus={() => prefetchData(data.id)}
            className={`block mb-1 rounded-tr-lg rounded-br-lg p-2 cursor-pointer border-l-2 transition ${
              data.id == currentId
                ? "bg-blue-50 border-l-blue-500"
                : "border-l-transparent hover:bg-gray-100"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-medium text-gray-900">
                {data?.client?.user?.name}
              </span>
              <span className="font-semibold text-gray-900">
                {data.total_amount}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-600">
                {type == "invoice" ? data.invoice_number : data.quote_number}
              </span>
              <span className="text-gray-500">
                {type == "invoice" ? data.invoice_date : data.quotation_date}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium ">
                <StatusBadge status={data.status} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
