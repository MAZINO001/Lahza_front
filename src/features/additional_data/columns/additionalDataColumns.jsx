// src/features/additional_data/columns/additionalDataColumns.jsx
import { ArrowUpDown, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { globalFnStore } from "@/hooks/GlobalFnStore";

export const getAdditionalDataColumns = (navigate, role, projectId) => [
    {
        accessorKey: "client_id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Client ID <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const clientId = row.getValue("client_id");
            return <span className="font-medium">{clientId || "—"}</span>;
        },
    },
    {
        accessorKey: "host_acc",
        header: "Host Account",
        cell: ({ row }) => {
            const hostAcc = row.getValue("host_acc");
            return (
                <span className="text-sm text-gray-600 max-w-xs truncate block">
                    {hostAcc || "—"}
                </span>
            );
        },
    },
    {
        accessorKey: "website_acc",
        header: "Website Account",
        cell: ({ row }) => {
            const websiteAcc = row.getValue("website_acc");
            return (
                <span className="text-sm text-gray-600 max-w-xs truncate block">
                    {websiteAcc || "—"}
                </span>
            );
        },
    },
    {
        accessorKey: "social_media",
        header: "Social Media",
        cell: ({ row }) => {
            const socialMedia = row.getValue("social_media");
            return (
                <span className="text-sm text-gray-600 max-w-xs truncate block">
                    {socialMedia || "—"}
                </span>
            );
        },
    },
    {
        accessorKey: "media_files",
        header: "Media Files",
        cell: ({ row }) => {
            const mediaFiles = row.getValue("media_files");
            return (
                <span className="text-sm text-gray-600 max-w-xs truncate block">
                    {mediaFiles ? "Available" : "None"}
                </span>
            );
        },
    },
    {
        accessorKey: "specification_file",
        header: "Specification File",
        cell: ({ row }) => {
            const specFile = row.getValue("specification_file");
            return (
                <span className="text-sm text-gray-600 max-w-xs truncate block">
                    {specFile ? "Available" : "None"}
                </span>
            );
        },
    },
    {
        accessorKey: "logo",
        header: "Logo",
        cell: ({ row }) => {
            const logo = row.getValue("logo");
            return (
                <span className="text-sm text-gray-600 max-w-xs truncate block">
                    {logo ? "Available" : "None"}
                </span>
            );
        },
    },
    {
        accessorKey: "other",
        header: "Other",
        cell: ({ row }) => {
            const other = row.getValue("other");
            return (
                <span className="text-sm text-gray-600 max-w-xs truncate block">
                    {other || "—"}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const additionalData = row.original;
            const { HandleEditAdditionalData, handleDeleteAdditionalData } = globalFnStore();

            return (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/${role}/project/${projectId}/additional-data`)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => HandleEditAdditionalData(additionalData.id, navigate, role)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteAdditionalData(projectId, additionalData.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
