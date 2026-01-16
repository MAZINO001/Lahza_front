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
import { paymentColumns } from "../columns/paymentColumns";
import { usePayments } from "../hooks/usePaymentQuery";
import { DataTable } from "@/components/table/DataTable";
import EditDatePayment from "../components/editDatePayment";
const PaymentTable = React.memo(function PaymentTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const { role } = useAuthContext();
  const { data: payments = [], isLoading } = usePayments();

  const [paidAtOpen, setPaidAtOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleEditPaidAt = (payment) => {
    setSelectedPayment(payment);
    setPaidAtOpen(true);
  };

  const columns = React.useMemo(
    () =>
      paymentColumns(role, {
        onEditPaidAt: handleEditPaidAt,
      }),
    [role]
  );

  // const columns = React.useMemo(() => paymentColumns(role), [role]);

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
    <div className="w-full p-4 min-h-screen">
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

PaymentTable.displayName = 'PaymentTable';

export default PaymentTable;
