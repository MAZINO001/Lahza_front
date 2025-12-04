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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "./TablePagination";
import { DataTableSkeleton } from "./TableSkeleton";
import PaymentDetails from "@/features/documents/components/PaymentDetails";


export function DataTable({
    data,
    columns,
    table: externalTable,
    filterColumn = "name",
    isLoading = false,
    isInvoiceTable = false,
}) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

    const table = externalTable ?? useReactTable({
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
        return (
            <DataTableSkeleton
                rowCount={10}
            />
        );
    }
    return (
        <div>
            <div className="rounded-md border bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    {isInvoiceTable && (
                                        <TableRow
                                            className="hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => row.toggleExpanded()}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    )}


                                    {!isInvoiceTable && (
                                        <TableRow className="hover:bg-muted/50 transition-colors">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    )}

                                    {isInvoiceTable && row.getIsExpanded() && (
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
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns?.length ?? table.getAllColumns().length} className="h-32 text-center text-muted-foreground">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <TablePagination table={table} />
        </div>
    );
}