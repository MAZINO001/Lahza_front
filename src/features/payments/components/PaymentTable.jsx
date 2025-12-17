import * as React from "react";
import { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import FormField from "@/Components/Form/FormField";

import { useAuthContext } from "@/hooks/AuthContext";
import { paymentColumns } from "../columns/paymentColumns";
import { usePayments } from "../hooks/usePaymentQuery";
import { DataTable } from "@/components/table/DataTable";

export default function PaymentTable() {
  const [sorting, setSorting] = useState([]);

  const [columnFilters, setColumnFilters] = useState([]);

  const { role } = useAuthContext();
  const { data: payments = [], isLoading } = usePayments();

  const columns = React.useMemo(() => paymentColumns(role), [role]);

  const table = useReactTable({
    data: payments,
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
    <div className="w-full p-4 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <FormField
            placeholder="Filter payments..."
            value={table.getColumn("invoice_id")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("invoice_id")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <DataTable
          table={table}
          columns={columns}
          isLoading={isLoading}
          isInvoiceTable={false}
        />
      </div>
    </div>
  );
}
