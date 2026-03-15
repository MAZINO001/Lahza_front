/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
// // src/features/invoices/components/InvoiceTable.jsx
// import * as React from "react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { Upload } from "lucide-react";

// import { Button } from "@/components/ui/button";

// import FormField from "@/Components/Form/FormField";
// import CsvUploadModal from "@/components/common/CsvUploadModal";

// import { useAuthContext } from "@/hooks/AuthContext";
// import { useDocuments } from "../hooks/useDocuments/useDocumentsQueryData";
// import { DocumentsColumns } from "../columns/documentColumns";
// import { DataTable } from "@/components/table/DataTable";
// import OfferPlacementSlot from "@/features/offers/components/OfferPlacementSlot";
// import { useCurrencyStore } from "@/hooks/useCurrencyStore";

// export function DocumentTable({ type }) {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [rowSelection, setRowSelection] = useState({});
//   const [showUploadModal, setShowUploadModal] = useState(false);

//   const { role } = useAuthContext();
//   const navigate = useNavigate();

//   const currentSection = type === "invoices" ? "invoice" : "quote";

//   const { data: documents = [], isLoading } = useDocuments(type);

//   const formatAmount = useCurrencyStore((state) => state.formatAmount);
//   const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);

//   const columns = React.useMemo(
//     () =>
//       DocumentsColumns(
//         role,
//         navigate,
//         currentSection,
//         formatAmount,
//         selectedCurrency,
//       ),
//     [role, navigate],
//   );

//   const [globalFilter, setGlobalFilter] = useState("");
//   const table = useReactTable({
//     data: documents,
//     columns,
//     state: {
//       sorting,
//       columnFilters,
//       rowSelection,
//       globalFilter,
//     },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onRowSelectionChange: setRowSelection,

//     globalFilterFn: (row, columnId, filterValue) => {
//       if (!filterValue) return true;

//       const id = row.original?.id?.toString() || "";
//       const status = row.original?.status?.toString().toLowerCase() || "";
//       const searchTerm = filterValue.toLowerCase();

//       const idMatch = id.includes(searchTerm);
//       const statusMatch = status.includes(searchTerm);
//       return idMatch || statusMatch;
//     },
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });
//   const hasEmptySpace = documents?.length < 6;
//   return (
//     <div className="w-full p-4 h-screen">
//       <div className="flex items-center justify-between mb-4">
//         <FormField
//           placeholder={`Search by ID or Status...`}
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//           className="w-full sm:max-w-sm"
//         />

//         {role === "admin" && (
//           <div className="flex gap-3">
//             <Button onClick={() => setShowUploadModal(true)} variant="outline">
//               <Upload className="mr-2 h-4 w-4" /> Upload CSV
//             </Button>
//             <Link to={`/${role}/${currentSection}/new`}>
//               <Button>Add New {currentSection}</Button>
//             </Link>
//           </div>
//         )}
//       </div>
//       <DataTable
//         table={table}
//         columns={columns}
//         isInvoiceTable={type === "invoices"}
//         isLoading={isLoading}
//         globalFilter={globalFilter}
//         tableType={type}
//         role={role}
//       />
//       <CsvUploadModal
//         open={showUploadModal}
//         onClose={() => setShowUploadModal(false)}
//         uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadInvoices`}
//         onSuccess={() => window.location.reload()}
//       />
//       {hasEmptySpace && (
//         <OfferPlacementSlot
//           placement={type}
//           maxOffers={1}
//           showAnimated={true}
//         />
//       )}
//     </div>
//   );
// }

import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Upload, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import FormField from "@/Components/Form/FormField";
import CsvUploadModal from "@/components/common/CsvUploadModal";

import { useAuthContext } from "@/hooks/AuthContext";
import { useDocuments } from "../hooks/useDocuments/useDocumentsQueryData";
import { DocumentsColumns } from "../columns/documentColumns";
import { DataTable } from "@/components/table/DataTable";
import OfferPlacementSlot from "@/features/offers/components/OfferPlacementSlot";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import DocumentFilters from "./DocumentFilters";

export function DocumentTable({ type }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const { control, watch, reset } = useForm({
    defaultValues: {
      status: "all",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
      balanceMin: "",
      balanceMax: "",
    },
  });

  const statusFilter = watch("status");
  const dateFrom = watch("dateFrom");
  const dateTo = watch("dateTo");
  const amountMin = watch("amountMin");
  const amountMax = watch("amountMax");
  const balanceMin = watch("balanceMin");
  const balanceMax = watch("balanceMax");

  const { role } = useAuthContext();
  const navigate = useNavigate();
  const currentSection = type === "invoices" ? "invoice" : "quote";
  const { data: documents = [], isLoading } = useDocuments(type);
  const formatAmount = useCurrencyStore((state) => state.formatAmount);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);

  const columns = React.useMemo(
    () =>
      DocumentsColumns(
        role,
        navigate,
        currentSection,
        formatAmount,
        selectedCurrency,
      ),
    [role, navigate],
  );

  const customFilterFn = React.useCallback(
    (row) => {
      const invoice = row.original;

      if (globalFilter) {
        const id = invoice?.id?.toString() || "";
        const clientName = invoice?.client?.name?.toLowerCase() || "";
        const searchTerm = globalFilter.toLowerCase();
        const idMatch = id.includes(searchTerm);
        const clientMatch = clientName.includes(searchTerm);
        if (!idMatch && !clientMatch) return false;
      }

      if (statusFilter !== "all") {
        const invoiceStatus = invoice?.status?.toLowerCase() || "";
        if (invoiceStatus !== statusFilter.toLowerCase()) return false;
      }

      if (dateFrom || dateTo) {
        const dueDate = invoice?.due_date ? new Date(invoice.due_date) : null;
        if (dueDate) {
          if (dateFrom && dueDate < new Date(dateFrom)) return false;
          if (dateTo && dueDate > new Date(dateTo)) return false;
        }
      }

      if (amountMin || amountMax) {
        const amount = parseFloat(invoice?.amount || 0);
        if (amountMin && amount < parseFloat(amountMin)) return false;
        if (amountMax && amount > parseFloat(amountMax)) return false;
      }

      if (balanceMin || balanceMax) {
        const balance = parseFloat(invoice?.balance_due || 0);
        if (balanceMin && balance < parseFloat(balanceMin)) return false;
        if (balanceMax && balance > parseFloat(balanceMax)) return false;
      }

      return true;
    },
    [
      globalFilter,
      statusFilter,
      dateFrom,
      dateTo,
      amountMin,
      amountMax,
      balanceMin,
      balanceMax,
    ],
  );

  const filteredDocuments = React.useMemo(() => {
    return documents.filter((doc) => customFilterFn({ original: doc }));
  }, [documents, customFilterFn]);

  const table = useReactTable({
    data: filteredDocuments,
    columns,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const clearFilters = () => {
    setGlobalFilter("");
    reset();
  };

  const hasActiveFilters =
    globalFilter ||
    statusFilter !== "all" ||
    dateFrom ||
    dateTo ||
    amountMin ||
    amountMax ||
    balanceMin ||
    balanceMax;
  const hasEmptySpace = documents?.length < 6;

  return (
    <div className="w-full p-4 min-h-screen">
      {/* ── Toolbar ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: search + filter toggle */}
        <div className="flex items-center gap-2 flex-1">
          <FormField
            placeholder="Search by Client Name or ID..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:max-w-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted shrink-0" : "shrink-0"}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Right: admin actions */}
        {role === "admin" && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setShowUploadModal(true)}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
            </Button>
            <Link
              to={`/${role}/${currentSection}/new`}
              className="flex-1 sm:flex-none"
            >
              <Button className="w-full">Add {currentSection}</Button>
            </Link>
          </div>
        )}
      </div>

      {showFilters && (
        <div className="mb-4">
          <DocumentFilters
            control={control}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            showCount={true}
            filteredCount={filteredDocuments.length}
            totalCount={documents.length}
            type={type}
          />
        </div>
      )}

      <DataTable
        table={table}
        columns={columns}
        isInvoiceTable={type === "invoices"}
        isLoading={isLoading}
        globalFilter={globalFilter}
        tableType={type}
        role={role}
      />
      <CsvUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadInvoices`}
        onSuccess={() => window.location.reload()}
      />
      {hasEmptySpace && (
        <OfferPlacementSlot
          placement={type}
          maxOffers={1}
          showAnimated={true}
        />
      )}
    </div>
  );
}
