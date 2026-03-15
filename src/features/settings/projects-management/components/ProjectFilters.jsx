import React from "react";
import { Controller } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/Form/FormField";
import SelectField from "@/components/Form/SelectField";
import DateField from "@/components/Form/DateField";

export default function ProjectFilters({
  control,
  hasActiveFilters,
  onClearFilters,
  showCount = false,
  filteredCount = 0,
  totalCount = 0,
}) {
  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 lg:px-3"
          >
            Clear All
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <FormField
              label="Search"
              placeholder="Name or description..."
              value={field.value || ""}
              onChange={field.onChange}
              className="lg:col-span-2"
            />
          )}
        />

        {/* Status */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Status"
              value={field.value || "all"}
              onChange={(val) => field.onChange(val === "all" ? "" : val)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "pending", label: "Pending" },
                { value: "in_progress", label: "In Progress" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          )}
        />

        {/* End Date From */}
        <Controller
          name="endDateFrom"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateField
              label="End Date From"
              type="date"
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={error?.message}
            />
          )}
        />

        {/* End Date To */}
        <Controller
          name="endDateTo"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateField
              label="End Date To"
              type="date"
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={error?.message}
            />
          )}
        />
      </div>

      {showCount && hasActiveFilters && (
        <div className="text-xs text-muted-foreground">
          Showing {filteredCount} of {totalCount} projects
        </div>
      )}
    </div>
  );
}
