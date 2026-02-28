import React from "react";
import { Button } from "@/components/ui/button";

export function TablePagination({
  table,
  showSelectedInfo = true,
  paginationData,
  onPageChange,
}) {
  // If external pagination data is provided, use it; otherwise use table's internal pagination
  const useExternalPagination = !!paginationData && !!onPageChange;

  const currentPage = useExternalPagination
    ? (paginationData?.current_page || 1)
    : table.getState().pagination.pageIndex + 1;

  const lastPage = useExternalPagination
    ? (paginationData?.last_page || 1)
    : table.getPageCount();

  const from = useExternalPagination
    ? (paginationData?.from || 0)
    : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;

  const to = useExternalPagination
    ? (paginationData?.to || 0)
    : Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length);

  const total = useExternalPagination
    ? (paginationData?.total || 0)
    : table.getFilteredRowModel().rows.length;

  const handlePrevious = () => {
    if (useExternalPagination) {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    } else {
      table.previousPage();
    }
  };

  const handleNext = () => {
    if (useExternalPagination) {
      if (currentPage < lastPage) {
        onPageChange(currentPage + 1);
      }
    } else {
      table.nextPage();
    }
  };

  const handlePageSizeChange = (event) => {
    const newSize = Number(event.target.value);

    if (!table) return;

    if (useExternalPagination) {
      // For now, only internal table pagination directly controls page size.
      // External pagination can be wired up later via dedicated props.
      return;
    }

    const rowCount = table.getFilteredRowModel().rows.length;
    const newPageCount = Math.max(1, Math.ceil(rowCount / newSize));
    const currentIndex = table.getState().pagination.pageIndex;

    if (currentIndex + 1 > newPageCount) {
      table.setPageIndex(newPageCount - 1);
    }

    table.setPageSize(newSize);
  };

  return (
    <div className="flex items-start justify-between pt-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {showSelectedInfo && table && (
          <span>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <select
            className="h-8 rounded-md border border-input bg-background px-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={
              useExternalPagination
                ? paginationData?.per_page || paginationData?.page_size || 10
                : table.getState().pagination.pageSize
            }
            onChange={handlePageSizeChange}
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={useExternalPagination ? currentPage <= 1 : !table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {lastPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={useExternalPagination ? currentPage >= lastPage : !table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
