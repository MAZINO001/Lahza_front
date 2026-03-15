// import * as React from "react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import FormField from "@/Components/Form/FormField";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { DataTable } from "@/components/table/DataTable";
// import { ProjectColumns } from "../columns/projectColumns";
// import { useProjects } from "../hooks/useProjects/useProjectsData";
// import { Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import OfferPlacementSlot from "@/features/offers/components/OfferPlacementSlot";

// export function ProjectsTable() {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [rowSelection, setRowSelection] = useState({});

//   const { role } = useAuthContext();
//   const navigate = useNavigate();
//   const { data: projects, isLoading } = useProjects();

//   const columns = React.useMemo(
//     () => ProjectColumns(role, navigate),
//     [role, navigate],
//   );

//   const hasEmptySpace = projects?.length < 6;

//   const table = useReactTable({
//     data: projects,
//     columns: columns,
//     state: { sorting, columnFilters, rowSelection },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onRowSelectionChange: setRowSelection,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   });

//   return (
//     <div className="w-full p-4 h-screen ">
//       <div className="flex items-center justify-between mb-4">
//         <FormField
//           placeholder="Filter by name..."
//           value={table.getColumn("name")?.getFilterValue() ?? ""}
//           onChange={(e) =>
//             table.getColumn("name")?.setFilterValue(e.target.value)
//           }
//           className="w-full sm:max-w-sm"
//         />
//         <div className="flex gap-2">
//           {role !== "client" && (
//             <Link to={`../project/new`} relative="path">
//               <Button>
//                 <Plus className="mr-2 h-4 w-4" /> Add New Project
//               </Button>
//             </Link>
//           )}
//         </div>
//       </div>

//       <DataTable
//         table={table}
//         columns={columns}
//         isInvoiceTable={false}
//         isLoading={isLoading}
//         tableType="projects"
//         role={role}
//       />

//       {hasEmptySpace && (
//         <OfferPlacementSlot
//           placement="projects"
//           maxOffers={1}
//           showAnimated={true}
//         />
//       )}
//     </div>
//   );
// }

// Updated ProjectsTable.jsx
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/Components/Form/FormField";
import ProjectFilters from "./ProjectFilters";
import { useAuthContext } from "@/hooks/AuthContext";
import { DataTable } from "@/components/table/DataTable";
import { ProjectColumns } from "../columns/projectColumns";
import { useProjects } from "../hooks/useProjects/useProjectsData";
import OfferPlacementSlot from "@/features/offers/components/OfferPlacementSlot";

export function ProjectsTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const { role } = useAuthContext();
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useProjects();

  // React Hook Form for filters
  const { control, watch, reset } = useForm({
    defaultValues: {
      status: "all",
      startDateFrom: "",
      startDateTo: "",
      endDateFrom: "",
      endDateTo: "",
    },
  });

  // Watch form values
  const statusFilter = watch("status");
  const startDateFrom = watch("startDateFrom");
  const startDateTo = watch("startDateTo");
  const endDateFrom = watch("endDateFrom");
  const endDateTo = watch("endDateTo");

  const columns = React.useMemo(
    () => ProjectColumns(role, navigate),
    [role, navigate],
  );

  // Custom filter function
  const customFilterFn = React.useCallback(
    (row) => {
      const project = row.original;

      // Text search (Project ID, Project Name, Client ID)
      if (globalFilter) {
        const projectId = project?.id?.toString() || "";
        const projectName = project?.name?.toLowerCase() || "";
        const clientId = project?.client_id?.toString() || "";
        const searchTerm = globalFilter.toLowerCase();

        const projectIdMatch = projectId.includes(searchTerm);
        const projectNameMatch = projectName.includes(searchTerm);
        const clientIdMatch = clientId.includes(searchTerm);

        if (!projectIdMatch && !projectNameMatch && !clientIdMatch)
          return false;
      }

      // Status filter
      if (statusFilter !== "all") {
        const projectStatus = project?.status?.toLowerCase() || "";
        if (projectStatus !== statusFilter.toLowerCase()) return false;
      }

      // Start Date range filter
      if (startDateFrom || startDateTo) {
        const startDate = project?.start_date
          ? new Date(project.start_date)
          : null;
        if (startDate) {
          if (startDateFrom && startDate < new Date(startDateFrom))
            return false;
          if (startDateTo && startDate > new Date(startDateTo)) return false;
        }
      }

      // End Date range filter
      if (endDateFrom || endDateTo) {
        const endDate = project?.estimated_end_date
          ? new Date(project.estimated_end_date)
          : null;
        if (endDate) {
          if (endDateFrom && endDate < new Date(endDateFrom)) return false;
          if (endDateTo && endDate > new Date(endDateTo)) return false;
        }
      }

      return true;
    },
    [
      globalFilter,
      statusFilter,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
    ],
  );

  // Filter projects based on all filters
  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => customFilterFn({ original: project }));
  }, [projects, customFilterFn]);

  const hasEmptySpace = projects?.length < 6;

  const table = useReactTable({
    data: filteredProjects,
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

  // Clear all filters
  const clearFilters = () => {
    setGlobalFilter("");
    reset();
  };

  const hasActiveFilters =
    globalFilter ||
    statusFilter !== "all" ||
    startDateFrom ||
    startDateTo ||
    endDateFrom ||
    endDateTo;

  return (
    <div className="w-full p-4 min-h-screen">
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: search + filter toggle */}
        <div className="flex items-center gap-2 flex-1">
          <FormField
            placeholder="Search by Project ID, Name, or Client ID..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:max-w-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={`shrink-0 ${showFilters ? "bg-muted" : ""}`}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Right: action button */}
        {role !== "client" && (
          <Link
            to={`../project/new`}
            relative="path"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add New Project
            </Button>
          </Link>
        )}
      </div>

      {/* Filters Section - Collapsible */}
      {showFilters && (
        <div className="mb-4">
          <ProjectFilters
            control={control}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            showCount={true}
            filteredCount={filteredProjects.length}
            totalCount={projects.length}
          />
        </div>
      )}

      <DataTable
        table={table}
        columns={columns}
        isInvoiceTable={false}
        isLoading={isLoading}
        tableType="projects"
        role={role}
      />

      {hasEmptySpace && (
        <OfferPlacementSlot
          placement="projects"
          maxOffers={1}
          showAnimated={true}
        />
      )}
    </div>
  );
}
