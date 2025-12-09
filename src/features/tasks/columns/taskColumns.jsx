// src/features/tasks/columns/taskColumns.jsx
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { globalFnStore } from "@/hooks/GlobalFnStore";

export const getTaskColumns = (navigate, role, projectId) => [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Task Title <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const task = row.original;

            return <span className="font-medium">{task.title}</span>;
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const description = row.getValue("description");
            return (
                <span className="text-sm text-gray-600 max-w-xs truncate block">
                    {description || "—"}
                </span>
            );
        },
    },
    {
        accessorKey: "percentage",
        header: "Percentage",
        cell: ({ row }) => {
            const percentage = row.getValue("percentage") || 0;
            return (
                <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium">{percentage}%</span>
                </div>
            );
        },
    },
    {
        accessorKey: "estimated_time",
        header: "Estimated Time",
        cell: ({ row }) => {
            const time = row.getValue("estimated_time");
            return time ? `${time} Days` : "—";
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const task = row.original;
            const { HandleEditTask, handleDeleteTask } = globalFnStore();

            return (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => HandleEditTask(task.id, navigate, role)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTask(projectId, task.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
