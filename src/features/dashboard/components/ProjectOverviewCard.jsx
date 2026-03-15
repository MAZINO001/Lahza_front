// import * as React from "react";
// import {
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { DataTable } from "../table/DataTable";
// import { dashBoardTableColumns } from "@/features/dashboard/columns/dashboardTableColumn";
// import { useDocuments } from "@/features/documents/hooks/useDocuments/useDocumentsQueryData";
// import { useState } from "react"
// export default function Invoices() {
//   const { role } = useAuthContext();

//   const { data: documents = [], isLoading } = useDocuments("invoices");

//   const columns = React.useMemo(
//     () => dashBoardTableColumns(role),
//     [role]
//   );

//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});

//   const table = useReactTable({
//     data: documents,
//     columns: columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   });

//   return (
//     <div className="w-full">
//       <DataTable
//         table={table}
//         columns={columns}
//         isLoading={isLoading}
//       />
//     </div>
//   );
// }

import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";

const milestones = [
  {
    project: "Project ID2",
    title: "Installation & Configuration",
    desc: "Install WordPress CMS and configure basic settings.",
    status: "Pending",
    date: "14 Mar",
  },
  {
    project: "Project ID2",
    title: "Design & Branding Integration",
    desc: "Integrate logo, colors, and create web structure.",
    status: "Pending",
    date: "22 Mar",
  },
  {
    project: "Project ID2",
    title: "Page Development",
    desc: "Create homepage, services, about, blog, contact pages with UI/UX.",
    status: "Done",
    date: "10Mar",
  },
  {
    project: "Project ID2",
    title: "Optimization & Launch",
    desc: "Add animations, SSL certificate, SEO structure, responsive design.",
    status: "Pending",
    date: "28 Mar",
  },
  {
    project: "Project ID2",
    title: "Installation & Configuration",
    desc: "Install WordPress CMS and configure basic settings.",
    status: "Pending",
    date: "1 Apr",
  },
];

const statusStyles = {
  Pending: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Done: "bg-muted text-muted-foreground border-border",
  "In Progress": "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

export default function ProjectOverviewCard() {
  return (
    <Card className="rounded-xl border border-border/60 bg-background overflow-hidden h-full">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription className="text-xs text-blue-400 mt-0.5">
          Milestone progress for active projects
        </CardDescription>
      </CardHeader>

      <CardContent className="divide-y divide-border/40 overflow-y-auto max-h-[420px]">
        {milestones.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 hover:bg-muted/20 transition-colors"
          >
            {/* Project ID */}
            <span className="text-xs text-muted-foreground shrink-0 w-20">
              {m.project}
            </span>

            {/* Title + desc */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{m.title}</p>
              <p className="text-xs text-blue-400/80 truncate mt-0.5">
                {m.desc}
              </p>
            </div>

            {/* Status badge */}
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 text-xs px-2 h-6",
                statusStyles[m.status] ?? statusStyles.Pending,
              )}
            >
              {m.status}
            </Badge>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <CalendarDays className="h-3.5 w-3.5 text-blue-400" />
              {m.date}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
