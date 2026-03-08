// // src/features/receipts/components/ReceiptTable.jsx
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import FormField from "@/Components/Form/FormField";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { getReceiptColumns } from "../columns/receiptColumns";
// import { DataTable } from "@/components/table/DataTable";
// import { usePayments } from "@/features/payments/hooks/usePayments/usePaymentsData";
// import { useCurrencyStore } from "@/hooks/useCurrencyStore";

// export function ReceiptTable() {
//   const { data: payments = [], isLoading } = usePayments();
//   const { role } = useAuthContext();
//   const navigate = useNavigate();

//   const formatAmount = useCurrencyStore((state) => state.formatAmount);
//   const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);

//   const paidPayments = React.useMemo(
//     () => payments.filter((payment) => payment.status === "paid"),
//     [payments],
//   );

//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);

//   const columns = React.useMemo(
//     () => getReceiptColumns(role, navigate, formatAmount, selectedCurrency),
//     [role, navigate, formatAmount, selectedCurrency],
//   );

//   const table = useReactTable({
//     data: paidPayments,
//     columns,
//     state: { sorting, columnFilters },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   return (
//     <div className="w-full p-4 min-h-screen">
//       <div className="flex justify-between mb-4">
//         <FormField
//           placeholder="Filter receipts..."
//           value={table.getColumn("invoice_id")?.getFilterValue() ?? ""}
//           onChange={(e) =>
//             table.getColumn("invoice_id")?.setFilterValue(e.target.value)
//           }
//           className="w-full sm:max-w-sm"
//         />
//       </div>
//       <DataTable
//         table={table}
//         columns={columns}
//         isInvoiceTable={false}
//         isLoading={isLoading}
//         tableType="receipts"
//         role={role}
//       />
//     </div>
//   );
// }


// src/features/receipts/components/ReceiptTable.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/Components/Form/FormField";
import  ReceiptFilters  from "./ReceiptFilters";
import { useAuthContext } from "@/hooks/AuthContext";
import { getReceiptColumns } from "../columns/receiptColumns";
import { DataTable } from "@/components/table/DataTable";
import { usePayments } from "@/features/payments/hooks/usePayments/usePaymentsData";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

export function ReceiptTable() {
  const { data: payments = [], isLoading } = usePayments();
  const { role } = useAuthContext();
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const formatAmount = useCurrencyStore((state) => state.formatAmount);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);

  const paidPayments = React.useMemo(
    () => payments.filter((payment) => payment.status === "paid"),
    [payments],
  );

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  // React Hook Form for filters
  const { control, watch, reset } = useForm({
    defaultValues: {
      paymentMethod: "all",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
    },
  });

  // Watch form values
  const paymentMethodFilter = watch("paymentMethod");
  const dateFrom = watch("dateFrom");
  const dateTo = watch("dateTo");
  const amountMin = watch("amountMin");
  const amountMax = watch("amountMax");

  const columns = React.useMemo(
    () => getReceiptColumns(role, navigate, formatAmount, selectedCurrency),
    [role, navigate, formatAmount, selectedCurrency],
  );

  // Custom filter function
  const customFilterFn = React.useCallback(
    (row) => {
      const receipt = row.original;

      // Text search (Receipt ID and Invoice ID)
      if (globalFilter) {
        const receiptId = receipt?.id?.toString() || "";
        const invoiceId = receipt?.invoice_id?.toString() || "";
        const searchTerm = globalFilter.toLowerCase();
        
        const receiptIdMatch = receiptId.includes(searchTerm);
        const invoiceIdMatch = invoiceId.includes(searchTerm);
        
        if (!receiptIdMatch && !invoiceIdMatch) return false;
      }

      // Payment Method filter
      if (paymentMethodFilter !== "all") {
        const method = receipt?.payment_method?.toLowerCase() || "";
        if (method !== paymentMethodFilter.toLowerCase()) return false;
      }

      // Date range filter (created_at)
      if (dateFrom || dateTo) {
        const createdDate = receipt?.created_at ? new Date(receipt.created_at) : null;
        if (createdDate) {
          if (dateFrom && createdDate < new Date(dateFrom)) return false;
          if (dateTo && createdDate > new Date(dateTo)) return false;
        }
      }

      // Amount range filter
      if (amountMin || amountMax) {
        const amount = parseFloat(receipt?.amount || 0);
        if (amountMin && amount < parseFloat(amountMin)) return false;
        if (amountMax && amount > parseFloat(amountMax)) return false;
      }

      return true;
    },
    [globalFilter, paymentMethodFilter, dateFrom, dateTo, amountMin, amountMax]
  );

  // Filter receipts based on all filters
  const filteredReceipts = React.useMemo(() => {
    return paidPayments.filter((receipt) => customFilterFn({ original: receipt }));
  }, [paidPayments, customFilterFn]);

  const table = useReactTable({
    data: filteredReceipts,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Clear all filters
  const clearFilters = () => {
    setGlobalFilter("");
    reset();
  };

  const hasActiveFilters =
    globalFilter ||
    paymentMethodFilter !== "all" ||
    dateFrom ||
    dateTo ||
    amountMin ||
    amountMax;

  return (
    <div className="w-full p-4 min-h-screen">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2 flex-1">
          <FormField
            placeholder="Search by Receipt ID or Invoice ID..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:max-w-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters Section - Collapsible */}
      {showFilters && (
        <div className="mb-4">
          <ReceiptFilters
            control={control}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            showCount={true}
            filteredCount={filteredReceipts.length}
            totalCount={paidPayments.length}
          />
        </div>
      )}

      <DataTable
        table={table}
        columns={columns}
        isInvoiceTable={false}
        isLoading={isLoading}
        tableType="receipts"
        role={role}
      />
    </div>
  );
}