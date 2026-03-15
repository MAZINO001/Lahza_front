// // src/features/settings/components/management/usermanagement/UserTable.jsx
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import { Button } from "@/components/ui/button";
// import FormField from "@/components/Form/FormField";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { getUserManagementColumns } from "../../columns/UserColumns";
// import { DataTable } from "@/components/table/DataTable";
// import { Upload } from "lucide-react";
// import { useUsers } from "@/features/settings/hooks/useUsersQuery";
// import AddClientModel from "@/components/common/AddClientModel";

// export default function UserTable() {
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const { data: users = { data: [] }, isLoading } = useUsers(currentPage);
//   {
//     const { role } = useAuthContext();
//     const navigate = useNavigate();

//     const [sorting, setSorting] = useState([]);
//     const [columnFilters, setColumnFilters] = useState([]);

//     const columns = React.useMemo(
//       () => getUserManagementColumns(role, navigate),
//       [role, navigate]
//     );

//     const table = useReactTable({
//       data: users.data,
//       columns,
//       state: { sorting, columnFilters },
//       onSortingChange: setSorting,
//       onColumnFiltersChange: setColumnFilters,
//       getCoreRowModel: getCoreRowModel(),
//       getSortedRowModel: getSortedRowModel(),
//       getFilteredRowModel: getFilteredRowModel(),
//       manualPagination: true,
//       pageCount: users.last_page || 1,
//     });

//     return (
//       <div className="w-full bg-background min-h-screen">
//         <div className="flex justify-between mb-4">
//           <FormField
//             placeholder="Filter users..."
//             value={table.getColumn("name")?.getFilterValue() ?? ""}
//             onChange={(e) =>
//               table.getColumn("name")?.setFilterValue(e.target.value)
//             }
//             className="max-w-sm"
//           />
//           <div className="flex gap-2">
//             <Button onClick={() => setShowUploadModal(true)} variant="outline">
//               <Upload className="mr-2 h-4 w-4" /> Upload CSV
//             </Button>
//             <AddClientModel />
//           </div>
//         </div>

//         <DataTable
//           table={table}
//           columns={columns}
//           isInvoiceTable={false}
//           isLoading={isLoading}
//           paginationData={users}
//           onPageChange={setCurrentPage}
//         />
//       </div>
//     );
//   }
// }

// src/features/settings/components/management/usermanagement/UserTable.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/AuthContext";
import { getUserManagementColumns } from "../../columns/UserColumns";
import { DataTable } from "@/components/table/DataTable";
import { Upload } from "lucide-react";
import { useUsers } from "@/features/settings/hooks/useUsersQuery";
import AddClientModel from "@/components/common/AddClientModel";
import UserFilters from "./UserFilters";

export default function UserTable() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: users = { data: [] }, isLoading } = useUsers(currentPage);

  const { role } = useAuthContext();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [filters, setFilters] = useState({ name: "", role: "", status: "" });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    // Sync name filter with TanStack column filter
    if (key === "name") {
      table.getColumn("name")?.setFilterValue(value);
    }
  };

  const columns = React.useMemo(
    () => getUserManagementColumns(role, navigate),
    [role, navigate],
  );

  // Apply role and status filters manually on the data
  const filteredData = React.useMemo(() => {
    return (users.data ?? []).filter((user) => {
      const matchesRole =
        !filters.role || user.role?.toLowerCase() === filters.role;
      const matchesStatus = !filters.status || user.status === filters.status;
      return matchesRole && matchesStatus;
    });
  }, [users.data, filters.role, filters.status]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: users.last_page || 1,
  });

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="flex justify-between">
        <UserFilters filters={filters} onFilterChange={handleFilterChange} />
        <div className="flex gap-2">
          <Button onClick={() => setShowUploadModal(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </Button>
          <AddClientModel />
        </div>
      </div>

      <DataTable
        table={table}
        columns={columns}
        isInvoiceTable={false}
        isLoading={isLoading}
        paginationData={users}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
