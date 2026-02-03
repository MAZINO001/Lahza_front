import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TeamColumns from "../../columns/TeamColumns";
import { useAuthContext } from "@/hooks/AuthContext";

import FormField from "@/components/Form/FormField";
import { DataTable } from "@/components/table/DataTable";
import { useTeams } from "../../hooks/useTeamsQuery";

export default function TeamTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: teamMembers = { data: [] }, isLoading } = useTeams(currentPage);

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  console.log(teamMembers?.data);

  const [showUploadModal, setShowUploadModal] = useState(false);

  const { role } = useAuthContext();

  const columns = React.useMemo(() => TeamColumns(), []);

  const table = useReactTable({
    data: teamMembers?.data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: teamMembers?.last_page || 1,
  });

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);
    table.getColumn("name")?.setFilterValue(value);
  };

  return (
    <div className="bg-background w-full overflow-auto">
      <div className="flex justify-between mb-4">
        <FormField
          placeholder="Filter team members..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={handleFilterChange}
          className="max-w-sm"
        />
        {/* <div className="flex gap-2">
          <Button onClick={() => setShowUploadModal(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </Button>
          <Link to={`/${role}/team/new`}>
            <Button>Add Team Member</Button>
          </Link>
        </div> */}
      </div>

      <div className="overflow-x-auto">
        <DataTable
          table={table}
          columns={columns}
          isInvoiceTable={false}
          isLoading={isLoading}
          paginationData={teamMembers}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
