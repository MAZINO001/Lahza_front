/* eslint-disable react-hooks/exhaustive-deps */
// "use client";

// import * as React from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   ArrowUpDown,
//   ChevronDown,
//   Eye,
// } from "lucide-react";
// import { useState } from "react";
// import { StatusBadge } from "@/Components/StatusBadge";
// import { mockProjects } from "@/lib/mockData";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// export const columns = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Project Name
//           <ArrowUpDown />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="font-medium">{row.getValue("name")}</div>
//     ),
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.getValue("status");
//       return <StatusBadge status={status} />;
//     },
//   },
//   {
//     accessorKey: "progress_percentage",
//     header: () => <div className="text-center">Progress</div>,
//     cell: ({ row }) => {
//       const progress = parseFloat(row.getValue("progress_percentage"));
//       return (
//         <div className="text-center">
//           <div className="font-medium">{progress}%</div>
//           <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
//             <div
//               className="bg-slate-900 h-2 rounded-full transition-all"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "start_date",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Start Date
//           <ArrowUpDown />
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       const date = new Date(row.getValue("start_date"));
//       const formatted = date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//       return <div>{formatted}</div>;
//     },
//   },
//   {
//     accessorKey: "end_date",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           End Date
//           <ArrowUpDown />
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       const date = new Date(row.getValue("end_date"));
//       const formatted = date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//       return <div>{formatted}</div>;
//     },
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     header: "Actions",
//     cell: ({ row }) => {
//       const project = row.original;

//       return (
//         <Link to={`/client/projects/${project.id}`}>
//           <Button variant="outline" size="sm" className="h-8">
//             <Eye className="h-4 w-4 mr-2" />
//             View
//           </Button>
//         </Link>
//       );
//     },
//   },
// ];

// export default function Projects() {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});

//   const table = useReactTable({
//     data: mockProjects,
//     columns,
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
//     <div className="w-full p-4">
//       <div className="flex items-center pb-4">
//         <Input
//           placeholder="Filter by project name..."
//           value={table.getColumn("name")?.getFilterValue() ?? ""}
//           onChange={(event) =>
//             table.getColumn("name")?.setFilterValue(event.target.value)
//           }
//           className="max-w-sm"
//         />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="ml-auto">
//               Columns <ChevronDown />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table
//               .getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => {
//     return (
//                   <DropdownMenuCheckboxItem
//                     key={column.id}
//                     className="capitalize"
//                     checked={column.getIsVisible()}
//                     onCheckedChange={(value) =>
//                       column.toggleVisibility(!!value)
//                     }
//                   >
//                     {column.id}
//                   </DropdownMenuCheckboxItem>
//                 );
//               })}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       <div className="overflow-hidden rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//                 </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="text-muted-foreground flex-1 text-sm">
//           {table.getFilteredSelectedRowModel().rows.length} of{" "}
//           {table.getFilteredRowModel().rows.length} row(s) selected.
//               </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { StatusBadge } from "@/Components/StatusBadge";
import { Calendar, ArrowRight } from "lucide-react";
import { mockProjects, mockProjectTasks } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock user data
const mockUser = {
  id: "client-001-uuid-here",
  email: "demo@example.com",
  name: "Demo User",
};

export default function Projects() {
  const user = mockUser;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    if (!user) return;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Load mock data
    setProjects(mockProjects);
    setLoading(false);
  };

  const loadProjectTasks = async (projectId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
  };

  const handleViewProject = async (project) => {
    await loadProjectTasks(project.id);
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Track progress and view details of your projects
          </p>
        </div>
      </div> */}

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No projects found matching your search."
                : "Your projects will appear here once they are created"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Link
              to={`/client/projects/${project.id}`}
              key={project.id}
              onClick={() => handleViewProject(project)}
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-xl font-semibold line-clamp-1">
                    {project.name}
                  </CardTitle>
                  <StatusBadge status={project.status} />
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>Progress</span>
                        <span className="font-medium text-foreground">
                          {project.progress_percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${project.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(project.start_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      {project.end_date && (
                        <div className="flex items-center text-muted-foreground">
                          <span className="w-4 mr-2">→</span>
                          <span>
                            Due:{" "}
                            {new Date(project.end_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-muted-foreground hover:text-foreground"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div> */}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
