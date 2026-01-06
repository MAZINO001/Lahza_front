import React from "react";
import { Button } from "@/components/ui/button";

export function TablePagination({ table, showSelectedInfo = true, paginationData, onPageChange }) {
    const currentPage = paginationData?.current_page || 1;
    const lastPage = paginationData?.last_page || 1;
    const from = paginationData?.from || 0;
    const to = paginationData?.to || 0;
    const total = paginationData?.total || 0;

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < lastPage) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                {showSelectedInfo && table && (
                    <span>
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </span>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentPage <= 1}
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
                    disabled={currentPage >= lastPage}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}