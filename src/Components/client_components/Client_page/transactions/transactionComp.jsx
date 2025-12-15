// import { useState } from "react";
// import {
//   ChevronDown,
//   ChevronRight,
//   ChevronLeft,
//   ChevronUp,
//   Filter,
//   Plus,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { DocumentTable } from "@/features/documents/components/DocumentTable";
// import PaymentTable from "@/features/payments/components/PaymentTable";
// import { ProjectsTable } from "@/features/projects/components/ProjectTable";

// export default function TransactionSection({ title, data, isOpen, onToggle }) {
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = 1;

//   return (
//     <Collapsible
//       open={isOpen}
//       onOpenChange={onToggle}
//       className="border border-gray-200 rounded-lg bg-white"
//     >
//       <div className="flex items-center justify-between p-4">
//         <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-70 transition-opacity">
//           {isOpen ? (
//             <ChevronDown className="h-4 w-4 text-gray-600" />
//           ) : (
//             <ChevronRight className="h-4 w-4 text-gray-600" />
//           )}
//           <span className="font-medium text-gray-900">{title}</span>
//         </CollapsibleTrigger>
//         <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
//           <Plus className="h-4 w-4 mr-1" />
//           New
//         </Button>
//       </div>

//       <CollapsibleContent>
//         <div className="border-t border-gray-200">
//           <div className="overflow-x-auto">
//             {title === "Invoices" && <DocumentTable type="invoice" />}
//             {title === "Quote" && <DocumentTable type="quote" />}
//             {title === "Payments" && <PaymentTable />}
//             {title === "Projects" && <ProjectsTable />}
//           </div>

//           <div className="p-4 border-t border-gray-200 flex items-center justify-between">
//             <div className="text-sm text-gray-600">
//               Total Count:{" "}
//               <a href="#" className="text-blue-600 hover:underline">
//                 View
//               </a>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               <span className="text-sm text-gray-700 px-2">
//                 {currentPage} - {totalPages}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 disabled={currentPage === totalPages}
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(totalPages, prev + 1))
//                 }
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CollapsibleContent>
//     </Collapsible>
//   );
// }

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Filter,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuthContext } from "@/hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import { ProjectColumns } from "@/features/projects/columns/projectColumns";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export default function TransactionSection({
  title,
  data,
  isLoading,
  isOpen,
  onToggle,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const { role } = useAuthContext();
  const navigate = useNavigate();

  const columns = React.useMemo(
    () => ProjectColumns(role, navigate),
    [role, navigate]
  );

  const table = useReactTable({
    data: data,
    columns: columns,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="border border-gray-200 rounded-lg bg-white"
    >
      <div className="flex items-center justify-between p-4">
        <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
          <span className="font-medium text-gray-900">{title}</span>
        </CollapsibleTrigger>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>
      </div>

      <CollapsibleContent>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            {title === "Invoices" && (
              <DataTable
                table={table}
                columns={columns}
                isInvoiceTable={false}
                isLoading={isLoading}
              />
            )}
            {title === "Quote" && (
              <DataTable
                table={table}
                columns={columns}
                isInvoiceTable={false}
                isLoading={isLoading}
              />
            )}
            {title === "Payments" && (
              <DataTable
                table={table}
                columns={columns}
                isInvoiceTable={false}
                isLoading={isLoading}
              />
            )}
            {title === "Projects" && (
              <DataTable
                table={table}
                columns={columns}
                isInvoiceTable={false}
                isLoading={isLoading}
              />
            )}
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total Count:{" "}
              <a href="#" className="text-blue-600 hover:underline">
                View
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-700 px-2">
                {currentPage} - {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
