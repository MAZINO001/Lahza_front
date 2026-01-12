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
            .includes(searchTerm.toLowerCase())
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
    <div className=" w-[280px] bg-background border-r  flex flex-col ">
      <div className="px-2 py-3 border-b space-y-3">
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
            className="flex-1 text-xs"
          >
            Date
            {sortBy === "date" &&
              (sortOrder === "desc" ? (
                <ArrowDown className="w-3 h-3 ml-1" />
              ) : (
                <ArrowUp className="w-3 h-3 ml-1" />
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
            className="flex-1 text-xs"
          >
            Amount
            {sortBy === "amount" &&
              (sortOrder === "desc" ? (
                <ArrowDown className="w-3 h-3 ml-1" />
              ) : (
                <ArrowUp className="w-3 h-3 ml-1" />
              ))}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredData?.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No Receipt found
          </div>
        ) : (
          filteredData?.map((item) => (
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
                  {formatId(item?.invoice_id || item?.id, "INVOICE")}
                </span>
                <span className="font-semibold text-foreground">
                  {new Intl.NumberFormat("fr-MA", {
                    style: "currency",
                    currency: "MAD",
                  }).format(parseFloat(item.amount))}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600">
                  {formatId(item.id, "RECEIPT")}
                </span>
                <span className="text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
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
