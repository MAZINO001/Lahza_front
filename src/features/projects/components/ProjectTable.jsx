// src/features/services/components/ServiceTable.jsx
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import FormField from "@/Components/Form/FormField";
import { useAuthContext } from "@/hooks/AuthContext";
import { DataTable } from "@/components/table/DataTable";
import { ProjectColumns } from "../columns/projectColumns";

export function ProjectsTable({ projects, isLoading }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState({});

    const { role } = useAuthContext();
    const navigate = useNavigate();

    const columns = React.useMemo(
        () => ProjectColumns(role, navigate),
        [role, navigate]
    );

    const table = useReactTable({
        data: projects,
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
        <div className="w-full p-4 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <FormField
                        placeholder="Filter by name..."
                        value={table.getColumn("name")?.getFilterValue() ?? ""}
                        onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                        className="max-w-sm"
                    />
                    {/* <div className="flex gap-2">
                        <Link to={`/${role}/project/new`}>
                            <Button>Add New Project</Button>
                        </Link>
                    </div> */}
                </div>


                <DataTable
                    table={table}
                    columns={columns}
                    isInvoiceTable={false}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}