/* eslint-disable no-unused-vars */
import * as React from "react";
import { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import FormField from "@/Components/Form/FormField";

import { useAuthContext } from "@/hooks/AuthContext";
import calendarColumns from "../columns/calendarColumns";
import { useEvents } from "../hooks/useCalendarQuery";
import { DataTable } from "@/components/table/DataTable";

export default function CalendarTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const { role } = useAuthContext();
  const { data: events = [], isLoading } = useEvents();
  console.log(events);

  const columns = React.useMemo(() => calendarColumns(), []);

  const table = useReactTable({
    data: events,
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
    <div className="w-full h-screen">
      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        isInvoiceTable={false}
      />
    </div>
  );
}
