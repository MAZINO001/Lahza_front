/* eslint-disable react-hooks/rules-of-hooks */
// /* eslint-disable react-hooks/rules-of-hooks */
// import React, { useState } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { TablePagination } from "./TablePagination";
// import { DataTableSkeleton } from "./TableSkeleton";
// import PaymentDetails from "@/features/documents/components/PaymentDetails";
// import EmptySearch1 from "@/components/empty-search-1";
// import EmptyData from "@/components/empty-data-1";

// export function DataTable({
//   data,
//   columns,
//   table: externalTable,
//   filterColumn = "name",
//   isLoading = false,
//   isInvoiceTable = false,
//   onRowClick,
//   globalFilter,
//   tableType,
//   role,
//   customComponent,
// }) {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10, // Default page size
//   });

//   const table =
//     externalTable ??
//     useReactTable({
//       data: data,
//       columns: columns,
//       state: { sorting, columnFilters, pagination },
//       onSortingChange: setSorting,
//       onColumnFiltersChange: setColumnFilters,
//       onPaginationChange: setPagination,
//       getCoreRowModel: getCoreRowModel(),
//       getSortedRowModel: getSortedRowModel(),
//       getFilteredRowModel: filterColumn ? getFilteredRowModel() : undefined,
//       getPaginationRowModel: getPaginationRowModel(),
//       manualPagination: false, // Let the table handle pagination automatically
//     });

//   if (isLoading) {
//     return <DataTableSkeleton rowCount={10} />;
//   }
//   return (
//     <div>
//       <div className="rounded-md border bg-background overflow-x-auto">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id} className="whitespace-nowrap">
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <React.Fragment key={row.id}>
//                   {isInvoiceTable && (
//                     <TableRow
//                       className="hover:bg-muted/50 transition-colors cursor-pointer"
//                       onClick={() => row.toggleExpanded()}
//                     >
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id} className="whitespace-nowrap">
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   )}

//                   {!isInvoiceTable && (
//                     <TableRow
//                       className="hover:bg-muted/50 transition-colors cursor-pointer"
//                       onClick={() => onRowClick && onRowClick(row.original)}
//                     >
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id} className="whitespace-nowrap">
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   )}

//                   {isInvoiceTable && row.getIsExpanded() && (
//                     <React.Fragment key={`${row.id}-expanded`}>
//                       <TableRow>
//                         <TableCell
//                           colSpan={columns.length + 1}
//                           className="p-0 bg-muted/30"
//                         >
//                           <div className="p-4">
//                             <PaymentDetails invoiceId={row.original.id} />
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     </React.Fragment>
//                   )}
//                 </React.Fragment>
//               ))
//             ) : (
//               globalFilter ? (
//                 <EmptySearch1 />
//               ) : tableType && role ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns?.length ?? table.getAllColumns().length}
//                     className="p-0"
//                   >
//                     <EmptyData tableType={tableType} role={role} customComponent={customComponent} />
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns?.length ?? table.getAllColumns().length}
//                     className="h-32 text-center text-muted-foreground"
//                   >
//                     No data found.
//                   </TableCell>
//                 </TableRow>
//               )
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <TablePagination table={table} />
//     </div>
//   );
// }

// ***********************
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
import EmptySearch1 from "@/components/empty-search-1";
import EmptyData from "@/components/empty-data-1";
import MobileCard from "./MobileCard";

export function DataTable({
  data,
  columns,
  table: externalTable,
  filterColumn = "name",
  isLoading = false,
  isInvoiceTable = false,
  onRowClick,
  globalFilter,
  tableType,
  role,
  customComponent,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table =
    externalTable ??
    useReactTable({
      data,
      columns,
      state: { sorting, columnFilters, pagination },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: filterColumn ? getFilteredRowModel() : undefined,
      getPaginationRowModel: getPaginationRowModel(),
      manualPagination: false,
    });

  if (isLoading) return <DataTableSkeleton rowCount={10} />;

  const rows = table.getRowModel().rows;
  const isEmpty = !rows?.length;

  const emptyContent = globalFilter ? (
    <EmptySearch1 />
  ) : tableType && role ? (
    <EmptyData
      tableType={tableType}
      role={role}
      customComponent={customComponent}
    />
  ) : (
    <p className="h-32 flex items-center justify-center text-muted-foreground text-sm">
      No data found.
    </p>
  );

  return (
    <div>
      {/* ── Desktop table ── */}
      <div className="hidden md:block rounded-md border bg-background overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow>
                <TableCell
                  colSpan={columns?.length ?? table.getAllColumns().length}
                  className="p-0"
                >
                  {emptyContent}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <React.Fragment key={row.id}>
                  {isInvoiceTable ? (
                    <TableRow
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => row.toggleExpanded()}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="whitespace-nowrap">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ) : (
                    <TableRow
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => onRowClick && onRowClick(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="whitespace-nowrap">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  )}
                  {isInvoiceTable && row.getIsExpanded() && (
                    <TableRow key={`${row.id}-expanded`}>
                      <TableCell
                        colSpan={columns.length + 1}
                        className="p-0 bg-muted/30"
                      >
                        <div className="p-4">
                          <PaymentDetails invoiceId={row.original.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {(() => {
        const headerMap = {};
        table.getHeaderGroups().forEach((hg) =>
          hg.headers.forEach((h) => {
            headerMap[h.column.id] = h;
          }),
        );
        return (
          <div className="md:hidden space-y-4">
            {isEmpty
              ? emptyContent
              : rows.map((row) => (
                  <MobileCard
                    key={row.id}
                    row={row}
                    columns={columns}
                    headerMap={headerMap}
                    isInvoiceTable={isInvoiceTable}
                    onRowClick={onRowClick}
                  />
                ))}
          </div>
        );
      })()}

      <TablePagination table={table} />
    </div>
  );
}
