import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import FormField from "@/Components/Form/FormField";
import { useAuthContext } from "@/hooks/AuthContext";
import { getOfferColumns } from "../columns/offerColumns";
import { useOffers } from "../hooks/useOffersQuery";
import { DataTable } from "@/components/table/DataTable";
import { Upload } from "lucide-react";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import { useTranslation } from "react-i18next";

export function OfferTable() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { data: offers = [], isLoading } = useOffers();
  const { role } = useAuthContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formatAmount = useCurrencyStore((state) => state.formatAmount);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = React.useMemo(
    () => getOfferColumns(role, navigate, formatAmount, selectedCurrency , t),
    [role, navigate, formatAmount, selectedCurrency ,t],
  );

  const table = useReactTable({
    data: offers,
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
      <div className="flex justify-between mb-4">
        <FormField
          placeholder={t("offers.table.filter_placeholder")}
          value={table.getColumn("title")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          className="w-full sm:max-w-sm"
        />
        <div className="flex gap-2">
          <Button onClick={() => setShowUploadModal(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            {t("offers.table.upload_csv")}
          </Button>
          <Link to={`/${role}/offer/new`}>
            <Button>{t("offers.table.add_new_offer")}</Button>
          </Link>
        </div>
      </div>

      <DataTable
        table={table}
        columns={columns}
        isInvoiceTable={false}
        isLoading={isLoading}
        tableType="offers"
        role={role}
      />
    </div>
  );
}
