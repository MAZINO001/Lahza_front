// src/features/tasks/columns/taskColumns.jsx
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskActions } from "../components/TaskActions";

export function getTaskColumns(navigate, role, projectId, deleteMutation) {
  return [
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
          <span className="text-sm text-muted-foreground max-w-xs truncate block">
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
        return (
          <TaskActions
            task={task}
            projectId={projectId}
            deleteMutation={deleteMutation}
            navigate={navigate}
            role={role}
          />
        );
      },
    },
  ];
}
