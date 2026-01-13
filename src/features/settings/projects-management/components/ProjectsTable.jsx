// import React, { useMemo, useState } from "react";
// import {
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { ChevronDown, Plus } from "lucide-react";
// import { DataTable } from "@/components/table/DataTable";
// import FormField from "@/components/Form/FormField";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { projectColumns } from "./ProjectColumns";
// import { Link } from "react-router-dom";
// import { useAuthContext } from "@/hooks/AuthContext";
// import {
//   useProjects,
//   useAddProjectAssignment,
//   useDeleteProjectAssignment,
//   useUpdateProject,
// } from "../../hooks/useProjectsQuery";
// import { useTeams } from "../../hooks/useTeamsQuery";

// export default function ProjectsTable() {
//   const { role } = useAuthContext();
//   const { data: teams } = useTeams();
//   const addAssignment = useAddProjectAssignment();
//   const deleteAssignment = useDeleteProjectAssignment();
//   const updateProject = useUpdateProject();
//   const { data: projects, isLoading, error } = useProjects();

//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("all");

//   console.log(teams.data);

//   const availableMembers = useMemo(
//     () =>
//       teams?.data?.map((team) => ({
//         id: team?.id,
//         name: team?.user?.name,
//         email: team?.user?.email,
//       })) || [],
//     [teams]
//   );

//   const availableStatuses = useMemo(
//     () => ["draft", "pending", "in-progress", "completed", "canceled"],
//     []
//   );

//   const columns = useMemo(() => projectColumns(), []);

//   if (error) {
//     return (
//       <div className="p-4 text-red-500">
//         Error loading projects: {error.message}
//       </div>
//     );
//   }

//   if (isLoading) {
//     return <div className="p-4">Loading projects...</div>;
//   }

//   console.log("Projects data:", projects);

//   const filteredData = useMemo(() => {
//     let data = Array.isArray(projects) ? [...projects] : [];

//     if (statusFilter !== "all") {
//       data = data.filter((p) => p.status === statusFilter);
//     }

//     return data;
//   }, [projects, statusFilter]);

//   const table = useReactTable({
//     data: filteredData,
//     columns,
//     state: { sorting, columnFilters },
//     meta: {
//       availableMembers,
//       availableStatuses,

//       updateProjectDate: (projectId, nextDate) => {
//         updateProject.mutate({
//           id: projectId,
//           data: { estimated_end_date: nextDate },
//         });
//       },
//       updateProjectMembers: (projectId, nextMembers) => {
//         console.log("Update project members:", projectId, nextMembers);
//       },
//       updateProjectStatus: (projectId, nextStatus) => {
//         updateProject.mutate({
//           id: projectId,
//           data: { status: nextStatus },
//         });
//       },

//       addProjectAssignment: (projectId, teamId) => {
//         addAssignment.mutate({
//           project_id: projectId,
//           team_id: teamId,
//         });
//       },
//       removeProjectAssignment: (projectId, teamId) => {
//         deleteAssignment.mutate({
//           project_id: projectId,
//           team_id: teamId,
//         });
//       },
//     },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   return (
//     <div className="w-full bg-background min-h-screen">
//       <div className="flex justify-between mb-4">
//         <div className="flex gap-3 items-end">
//           <FormField
//             placeholder="Filter projects by name..."
//             value={table.getColumn("name")?.getFilterValue() ?? ""}
//             onChange={(e) =>
//               table.getColumn("name")?.setFilterValue(e.target.value)
//             }
//           />

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <button className="rounded-md flex items-center gap-2 border border-border px-2 py-[4.3px] capitalize">
//                 Status: {statusFilter}
//                 <ChevronDown className="w-4 h-4" />
//               </button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent align="start" className="w-48">
//               <DropdownMenuRadioGroup
//                 value={statusFilter}
//                 onValueChange={setStatusFilter}
//               >
//                 {["all", "not-started", "in-progress", "done"].map((status) => (
//                   <DropdownMenuRadioItem key={status} value={status}>
//                     {status.replace("-", " ")}
//                   </DropdownMenuRadioItem>
//                 ))}
//               </DropdownMenuRadioGroup>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//         <Link to={`/${role}/project/new`}>
//           <Button>
//             <Plus className="h-4 w-4 mr-2" />
//             New Project
//           </Button>
//         </Link>
//       </div>

//       <DataTable table={table} columns={columns} isLoading={isLoading} />
//     </div>
//   );
// }

import React, { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import FormField from "@/components/Form/FormField";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projectColumns } from "./ProjectColumns";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import {
  useProjects,
  useAddProjectAssignment,
  useDeleteProjectAssignment,
  useUpdateProject,
} from "../../hooks/useProjectsQuery";
import { useTeams } from "../../hooks/useTeamsQuery";

export default function ProjectsTable() {
  // All hooks MUST be called at the top level, before any conditional returns
  const { role } = useAuthContext();
  const { data: teamsResponse } = useTeams();
  const { data: projects, isLoading, error } = useProjects();
  const addAssignment = useAddProjectAssignment();
  const deleteAssignment = useDeleteProjectAssignment();
  const updateProject = useUpdateProject();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [localProjects, setLocalProjects] = useState(null);

  const availableMembers = useMemo(() => {
    const teams = teamsResponse?.data || teamsResponse || [];
    return Array.isArray(teams)
      ? teams.map((team) => ({
        id: team?.id,
        name: team?.user?.name,
        email: team?.user?.email,
      }))
      : [];
  }, [teamsResponse]);

  const availableStatuses = useMemo(
    () => ["pending", "in_progress", "completed", "cancelled"],
    []
  );

  const columns = useMemo(() => projectColumns(), []);

  const filteredData = useMemo(() => {
    let data = Array.isArray(projects) ? [...projects] : [];

    // If we have local updates, apply them on top of the fresh data
    if (localProjects) {
      data = localProjects;
    }

    if (statusFilter !== "all") {
      data = data.filter((p) => p.status === statusFilter);
    }

    return data;
  }, [projects, localProjects, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters },
    meta: {
      availableMembers,
      availableStatuses,
      updateProjectDate: (projectId, nextDate) => {
        updateProject.mutate({
          id: projectId,
          data: { estimated_end_date: nextDate },
        });
      },
      updateProjectMembers: (projectId, nextMembers) => {
        // Update the local state immediately for better UX
        const currentProjects = localProjects || projects;
        const updatedProjects = currentProjects.map(project =>
          project.id === projectId
            ? { ...project, members: nextMembers }
            : project
        );
        setLocalProjects(updatedProjects);

        // Update the project data in the backend
        if (typeof updateProject.mutate === 'function') {
          updateProject.mutate({
            id: projectId,
            data: { members: nextMembers.map(m => m.id) }
          });
        }
      },
      updateProjectStatus: (projectId, nextStatus) => {
        updateProject.mutate({
          id: projectId,
          data: { status: nextStatus },
        });
      },
      addProjectAssignment: (projectId, teamId) => {
        addAssignment.mutate({
          project_id: projectId,
          team_id: teamId,
        });
      },
      removeProjectAssignment: (projectId, teamId) => {
        deleteAssignment.mutate({
          project_id: projectId,
          team_id: teamId,
        });
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Conditional renders happen AFTER all hooks
  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading projects: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4">Loading projects...</div>;
  }

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="flex justify-between mb-4">
        <div className="flex gap-3 items-end">
          <FormField
            placeholder="Filter projects by name..."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-md flex items-center gap-2 border border-border px-2 py-[4.3px] capitalize">
                Status: {statusFilter}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                {[
                  "all",
                  "pending",
                  "in_progress",
                  "completed",
                  "cancelled",
                ].map((status) => (
                  <DropdownMenuRadioItem key={status} value={status}>
                    {status.replace("-", " ")}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Link to={`/${role}/project/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      <DataTable table={table} columns={columns} isLoading={isLoading} />
    </div>
  );
}
