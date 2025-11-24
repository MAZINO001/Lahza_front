// import * as React from "react";
// import { useState, useEffect } from "react";
// import api from "@/utils/axios";
// import { Link } from "react-router-dom";

// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { ArrowUpDown, Pencil, Trash2, Upload } from "lucide-react";

// import FormField from "@/Components/Form/FormField";
// import CsvUploadModal from "@/components/common/CsvUploadModal";

// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { globalFnStore } from "@/hooks/GlobalFnStore";

// export default function OffersPage() {
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const navigate = useNavigate();
//   // Fetch offers
//   const loadOffers = async () => {
//     try {
//       const res = await api.get(`${import.meta.env.VITE_BACKEND_URL}/offers`);
//       setOffers(res.data);
//     } catch (error) {
//       console.error("Failed to load offers:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOffers();
//   }, []);
//   const { role } = useAuthContext();
//   // Table Columns
//   const columns = [
//     {
//       accessorKey: "name",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Offer Name <ArrowUpDown className="ml-1 h-4 w-4" />
//         </Button>
//       ),
//       cell: ({ row }) => {
//         const offer = row.original;
//         return (
//           <Link
//             to={`/${role}/offer/${offer.id}`}
//             className="ml-3 font-medium hover:underline"
//           >
//             {offer.name}
//           </Link>
//         );
//       },
//     },
//     {
//       accessorKey: "description",
//       header: "Description",
//       cell: ({ row }) => (
//         <div className="text-sm text-slate-600 truncate">
//           {row.getValue("description")}
//         </div>
//       ),
//       size: 300,
//       minSize: 200,
//       maxSize: 400,
//     },
//     {
//       accessorKey: "base_price",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Base Price <ArrowUpDown className="ml-1 h-4 w-4" />
//         </Button>
//       ),
//       cell: ({ row }) => {
//         const amount = parseFloat(row.getValue("base_price"));
//         const formatted = new Intl.NumberFormat("en-US", {
//           style: "currency",
//           currency: "MAD",
//         }).format(amount);
//         return <div className="ml-3 font-medium">{formatted}</div>;
//       },
//     },
//     {
//       id: "actions",
//       enableHiding: false,
//       header: "Actions",
//       cell: ({ row }) => {
//         const offer = row.original;
//         const { HandleEditOffer, handleDeleteOffer } = globalFnStore();

//         const onEdit = () => {
//           HandleEditOffer(offer.id, navigate, role);
//         };

//         const onDelete = async () => {
//           await handleDeleteOffer(offer.id, loadOffers);
//         };
//         return (
//           <div className="flex items-center gap-2">
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={onEdit}
//               className="cursor-pointer"
//             >
//               <Pencil className="h-4 w-4" />
//             </Button>
//             <Button
//               size="sm"
//               variant="destructive"
//               onClick={onDelete}
//               className="cursor-pointer"
//             >
//               <Trash2 className="h-4 w-4" />
//             </Button>
//           </div>
//         );
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: offers,
//     columns,
//     state: { sorting, columnFilters, columnVisibility, rowSelection },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full p-4 bg-slate-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-4">
//           <FormField
//             placeholder="Filter by name..."
//             value={table.getColumn("name")?.getFilterValue() ?? ""}
//             onChange={(e) =>
//               table.getColumn("name")?.setFilterValue(e.target.value)
//             }
//             className="max-w-sm"
//           />

//           <div className="flex gap-2">
//             <Button onClick={() => setShowUploadModal(true)}>
//               <Upload className="mr-2 h-4 w-4" />
//               Upload CSV
//             </Button>
//             <Link to={`/${role}/offer/new`}>
//               <Button>Add New Offer</Button>
//             </Link>
//           </div>
//         </div>

//         <div className="overflow-hidden rounded-md border bg-white">
//           <Table>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow key={row.id}>
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext()
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns.length}
//                     className="h-24 text-center"
//                   >
//                     No results.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         <div className="flex items-center justify-end space-x-2 py-4">
//           <div className="text-muted-foreground flex-1 text-sm">
//             {table.getFilteredSelectedRowModel().rows.length} of{" "}
//             {table.getFilteredRowModel().rows.length} row(s) selected.
//           </div>
//           <div className="space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => table.previousPage()}
//               disabled={!table.getCanPreviousPage()}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => table.nextPage()}
//               disabled={!table.getCanNextPage()}
//             >
//               Next
//             </Button>
//             <CsvUploadModal
//               open={showUploadModal}
//               onClose={() => setShowUploadModal(false)}
//               uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadOffers`}
//               onSuccess={loadOffers}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";

export default function Offers() {
  return <div>Offers</div>;
}
