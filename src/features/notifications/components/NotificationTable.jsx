import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getNotificationColumns } from "../columns/notificationColumns";

export function NotificationTable({ data, loading, onRowClick, role }) {
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        setColumns(getNotificationColumns(role));
    }, [role]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <DataTable
            columns={columns}
            data={data}
            onRowClick={onRowClick}
            searchableColumns={["title", "message"]}
            filterableColumns={["type", "status"]}
        />
    );
}
