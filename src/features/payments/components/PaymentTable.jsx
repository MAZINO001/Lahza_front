// import * as React from "react";
// import { useState } from "react";
// import {
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTrigger,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import FormField from "@/Components/Form/FormField";

// import { useAuthContext } from "@/hooks/AuthContext";
// import { paymentColumns } from "../columns/paymentColumns";
// import { usePayments } from "../hooks/usePayments/usePaymentsData";
// import { DataTable } from "@/components/table/DataTable";
// import EditDatePayment from "../components/editDatePayment";
// import { useCompanyInfo } from "@/features/settings/hooks/useSettingsAgencyInfoQuery";
// import { useCurrencyStore } from "@/hooks/useCurrencyStore";
// const PaymentTable = React.memo(function PaymentTable() {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const { role } = useAuthContext();
//   const { data: payments = [], isLoading } = usePayments();
//   const { data: companyInfo } = useCompanyInfo();

//   const [paidAtOpen, setPaidAtOpen] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState(null);

//   const handleEditPaidAt = React.useCallback((payment) => {
//     setSelectedPayment(payment);
//     setPaidAtOpen(true);
//   }, []);

//   const formatAmount = useCurrencyStore((state) => state.formatAmount);
//   const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);

//   const columns = React.useMemo(
//     () =>
//       paymentColumns(
//         role,
//         companyInfo,
//         { onEditPaidAt: handleEditPaidAt },
//         formatAmount,
//         selectedCurrency,
//       ),
//     [role, companyInfo, handleEditPaidAt, formatAmount, selectedCurrency],
//   );

//   const table = useReactTable({
//     data: payments,
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
//       <div className="flex items-center justify-between mb-4">
//         <FormField
//           placeholder="Filter payments..."
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
//         isLoading={isLoading}
//         isInvoiceTable={false}
//         tableType="payments"
//         role={role}
//       />

//       <Dialog open={paidAtOpen} onOpenChange={setPaidAtOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit payment Date</DialogTitle>
//             <DialogDescription className="space-y-6 mt-4">
//               {selectedPayment && (
//                 <EditDatePayment
//                   PaymentId={selectedPayment?.id}
//                   date={selectedPayment?.updated_at}
//                   onClose={() => setPaidAtOpen(false)}
//                 />
//               )}
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// });

// PaymentTable.displayName = "PaymentTable";

// export default PaymentTable;


// Updated PaymentTable.jsx - Search by Invoice ID and Payment ID
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/Components/Form/FormField";
import  PaymentFilters  from "./PaymentFilters";

import { useAuthContext } from "@/hooks/AuthContext";
import { paymentColumns } from "../columns/paymentColumns";
import { usePayments } from "../hooks/usePayments/usePaymentsData";
import { DataTable } from "@/components/table/DataTable";
import EditDatePayment from "../components/editDatePayment";
import { useCompanyInfo } from "@/features/settings/hooks/useSettingsAgencyInfoQuery";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

const PaymentTable = React.memo(function PaymentTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const { role } = useAuthContext();
  const { data: payments = [], isLoading } = usePayments();
  const { data: companyInfo } = useCompanyInfo();

console.log("the payments:", payments);

  const [paidAtOpen, setPaidAtOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // React Hook Form for filters
  const { control, watch, reset } = useForm({
    defaultValues: {
      status: "all",
      paymentMethod: "all",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
    },
  });

  // Watch form values
  const statusFilter = watch("status");
  const paymentMethodFilter = watch("paymentMethod");
  const dateFrom = watch("dateFrom");
  const dateTo = watch("dateTo");
  const amountMin = watch("amountMin");
  const amountMax = watch("amountMax");

  const handleEditPaidAt = React.useCallback((payment) => {
    setSelectedPayment(payment);
    setPaidAtOpen(true);
  }, []);

  const formatAmount = useCurrencyStore((state) => state.formatAmount);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);

  const columns = React.useMemo(
    () =>
      paymentColumns(
        role,
        companyInfo,
        { onEditPaidAt: handleEditPaidAt },
        formatAmount,
        selectedCurrency,
      ),
    [role, companyInfo, handleEditPaidAt, formatAmount, selectedCurrency],
  );

  // Custom filter function
  const customFilterFn = React.useCallback(
    (row) => {
      const payment = row.original;

      // Text search (Payment ID and Invoice ID)
      if (globalFilter) {
        const paymentId = payment?.id?.toString() || "";
        const invoiceId = payment?.invoice_id?.toString() || "";
        const searchTerm = globalFilter.toLowerCase();
        
        const paymentIdMatch = paymentId.includes(searchTerm);
        const invoiceIdMatch = invoiceId.includes(searchTerm);
        
        if (!paymentIdMatch && !invoiceIdMatch) return false;
      }

      // Status filter
      if (statusFilter !== "all") {
        const paymentStatus = payment?.status?.toLowerCase() || "";
        if (paymentStatus !== statusFilter.toLowerCase()) return false;
      }

      // Payment Method filter
      if (paymentMethodFilter !== "all") {
        const method = payment?.payment_method?.toLowerCase() || "";
        if (method !== paymentMethodFilter.toLowerCase()) return false;
      }

      // Date range filter (created_at)
      if (dateFrom || dateTo) {
        const createdDate = payment?.created_at ? new Date(payment.created_at) : null;
        if (createdDate) {
          if (dateFrom && createdDate < new Date(dateFrom)) return false;
          if (dateTo && createdDate > new Date(dateTo)) return false;
        }
      }

      // Amount range filter
      if (amountMin || amountMax) {
        const amount = parseFloat(payment?.amount || 0);
        if (amountMin && amount < parseFloat(amountMin)) return false;
        if (amountMax && amount > parseFloat(amountMax)) return false;
      }

      return true;
    },
    [globalFilter, statusFilter, paymentMethodFilter, dateFrom, dateTo, amountMin, amountMax]
  );

  // Filter payments based on all filters
  const filteredPayments = React.useMemo(() => {
    return payments.filter((payment) => customFilterFn({ original: payment }));
  }, [payments, customFilterFn]);

  const table = useReactTable({
    data: filteredPayments,
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
    statusFilter !== "all" ||
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
            placeholder="Search by Payment ID or Invoice ID..."
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
          <PaymentFilters
            control={control}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            showCount={true}
            filteredCount={filteredPayments.length}
            totalCount={payments.length}
          />
        </div>
      )}

      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        isInvoiceTable={false}
        tableType="payments"
        role={role}
      />

      <Dialog open={paidAtOpen} onOpenChange={setPaidAtOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit payment Date</DialogTitle>
            <DialogDescription className="space-y-6 mt-4">
              {selectedPayment && (
                <EditDatePayment
                  PaymentId={selectedPayment?.id}
                  date={selectedPayment?.updated_at}
                  onClose={() => setPaidAtOpen(false)}
                />
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
});

PaymentTable.displayName = "PaymentTable";

export default PaymentTable;