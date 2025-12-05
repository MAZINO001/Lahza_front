/* eslint-disable react-hooks/exhaustive-deps */
// src/features/invoices/components/InvoiceTable.jsx
import * as React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Upload } from "lucide-react";

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
import PaymentDetails from "./PaymentDetails";

import { useAuthContext } from "@/hooks/AuthContext";
import { useDocuments } from "../hooks/useDocumentsQuery";
import { DocumentsColumns } from "../columns/documentColumns";
import { DataTable } from "@/components/table/DataTable";

export function DocumentTable() {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [showUploadModal, setShowUploadModal] = useState(false);

    const { role } = useAuthContext();
    const navigate = useNavigate();

    const location = useLocation();
    const segmentAfterAdmin = location.pathname.split(`/${role}/`)[1]?.split('/')[0] || '';
    const currentSection = segmentAfterAdmin === 'invoices' ? 'invoice' : "quote";

    const {
        data: documents = [],
        isLoading
    } = useDocuments(currentSection);
    const columns = React.useMemo(
        () => DocumentsColumns(role, navigate, currentSection),
        [role, navigate]
    );


    const table = useReactTable({
        data: documents,
        columns,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    return (
        <div className="w-full p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <FormField
                        placeholder={`Search ${segmentAfterAdmin}...`}
                        value={table.getColumn("status")?.getFilterValue() ?? ""}
                        onChange={(e) =>
                            table.getColumn("status")?.setFilterValue(e.target.value)
                        }
                        className="max-w-sm"
                    />

                    {role === "admin" && (
                        <div className="flex gap-3">
                            <Button onClick={() => setShowUploadModal(true)} variant="outline">
                                <Upload className="mr-2 h-4 w-4" /> Upload CSV
                            </Button>
                            <Link to={`/${role}/${currentSection}/new`}>
                                <Button>Add New {currentSection}</Button>
                            </Link>
                        </div>
                    )}
                </div>
                <DataTable
                    table={table}
                    columns={columns}
                    isInvoiceTable={currentSection === "invoice" ? true : false}
                    isLoading={isLoading}
                />
                <CsvUploadModal
                    open={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadInvoices`}
                    onSuccess={() => window.location.reload()}
                />
            </div>
        </div>
    );
}