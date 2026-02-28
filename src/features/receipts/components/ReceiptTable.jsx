// src/features/receipts/components/ReceiptTable.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import FormField from "@/Components/Form/FormField";
import { useAuthContext } from "@/hooks/AuthContext";
import { getReceiptColumns } from "../columns/receiptColumns";
import { DataTable } from "@/components/table/DataTable";
import { usePayments } from "@/features/payments/hooks/usePayments/usePaymentsData";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

export function ReceiptTable() {
  const { data: payments = [], isLoading } = usePayments();
  const { role } = useAuthContext();
  const navigate = useNavigate();

  const formatAmount = useCurrencyStore((state) => state.formatAmount);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);

  const paidPayments = React.useMemo(
    () => payments.filter((payment) => payment.status === "paid"),
    [payments],
  );

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = React.useMemo(
    () => getReceiptColumns(role, navigate, formatAmount, selectedCurrency),
    [role, navigate, formatAmount, selectedCurrency],
  );

  const table = useReactTable({
    data: paidPayments,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full p-4 min-h-screen">
      <div className="flex justify-between mb-4">
        <FormField
          placeholder="Filter receipts..."
          value={table.getColumn("invoice_id")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("invoice_id")?.setFilterValue(e.target.value)
          }
          className="w-full sm:max-w-sm"
        />
      </div>
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
