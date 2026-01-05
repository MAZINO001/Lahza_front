/* eslint-disable react-hooks/rules-of-hooks */
// src/components/table/DataTable.tsx
import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "./TablePagination";
import { DataTableSkeleton } from "./TableSkeleton";
import PaymentDetails from "@/features/documents/components/PaymentDetails";

// Memoized table row component for invoice tables
const InvoiceTableRow = React.memo(({ row, onRowClick }) => (
  <TableRow
    className="hover:bg-muted/50 transition-colors cursor-pointer"
    onClick={() => row.toggleExpanded()}
  >
    {row.getVisibleCells().map((cell) => (
      <TableCell key={cell.id}>
        {flexRender(
          cell.column.columnDef.cell,
          cell.getContext()
        )}
      </TableCell>
    ))}
  </TableRow>
));

InvoiceTableRow.displayName = 'InvoiceTableRow';

// Memoized table row component for regular tables
const RegularTableRow = React.memo(({ row, onRowClick }) => (
  <TableRow
    className="hover:bg-muted/50 transition-colors cursor-pointer"
    onClick={() => onRowClick && onRowClick(row.original)}
  >
    {row.getVisibleCells().map((cell) => (
      <TableCell key={cell.id}>
        {flexRender(
          cell.column.columnDef.cell,
          cell.getContext()
        )}
      </TableCell>
    ))}
  </TableRow>
));

RegularTableRow.displayName = 'RegularTableRow';

// Memoized expanded row component
const ExpandedRow = React.memo(({ row, columns }) => (
  <React.Fragment key={`${row.id}-expanded`}>
    <TableRow>
      <TableCell
        colSpan={columns.length + 1}
        className="p-0 bg-muted/30"
      >
        <div className="p-4">
          <PaymentDetails invoiceId={row.original.id} />
        </div>
      </TableCell>
    </TableRow>
  </React.Fragment>
));

ExpandedRow.displayName = 'ExpandedRow';

// Memoized no data row component
const NoDataRow = React.memo(({ columns, table }) => (
  <TableRow>
    <TableCell
      colSpan={columns?.length ?? table.getAllColumns().length}
      className="h-32 text-center text-muted-foreground"
    >
      No data found.
    </TableCell>
  </TableRow>
));

NoDataRow.displayName = 'NoDataRow';

export const DataTable = React.memo(({
  data,
  columns,
  table: externalTable,
  filterColumn = "name",
  isLoading = false,
  isInvoiceTable = false,
  onRowClick,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table =
    externalTable ??
    useReactTable({
      data: data,
      columns: columns,
      state: { sorting, columnFilters },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: filterColumn ? getFilteredRowModel() : undefined,
      getPaginationRowModel: getPaginationRowModel(),
    });

  if (isLoading) {
    return <DataTableSkeleton rowCount={10} />;
  }

  return (
    <div>
      <div className="rounded-md border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  {isInvoiceTable ? (
                    <InvoiceTableRow row={row} />
                  ) : (
                    <RegularTableRow row={row} onRowClick={onRowClick} />
                  )}

                  {isInvoiceTable && row.getIsExpanded() && (
                    <ExpandedRow row={row} columns={columns} />
                  )}
                </React.Fragment>
              ))
            ) : (
              <NoDataRow columns={columns} table={table} />
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />
    </div>
  );
});

DataTable.displayName = 'DataTable';
