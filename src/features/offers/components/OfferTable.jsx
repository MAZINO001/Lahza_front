/* eslint-disable no-unused-vars */
// src/features/offers/components/OfferTable.jsx
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FormField from "@/Components/Form/FormField";
import CsvUploadModal from "@/components/common/CsvUploadModal";
import { useAuthContext } from "@/hooks/AuthContext";
import { getOfferColumns } from "../columns/offerColumns";
import { useOffers } from "../hooks/useOffersQuery";
import { DataTable } from "@/components/table/DataTable";
import { Upload } from "lucide-react";

export function OfferTable() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { data: offers = [], isLoading } = useOffers();
  const { role } = useAuthContext();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = React.useMemo(
    () => getOfferColumns(role, navigate),
    [role, navigate]
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
    <div className="w-full p-4 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-4">
          <FormField
            placeholder="Filter offers..."
            value={table.getColumn("title")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex gap-2">
            <Button onClick={() => setShowUploadModal(true)} variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Upload CSV
            </Button>
            <Link to={`/${role}/offer/new`}>
              <Button>Add New Offer</Button>
            </Link>
          </div>
        </div>

        <DataTable
          table={table}
          columns={columns}
          isInvoiceTable={false}
          isLoading={isLoading}
        />
        <CsvUploadModal
          open={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadOffers`}
        />
      </div>
    </div>
  );
}
