// src/components/filters/ProjectFilters.jsx
import React from "react";
import { Controller } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import DateField from "@/Components/Form/DateField";

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Filter */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectField
              id="status"
              label="Status"
              value={field.value || "all"}
              onChange={(val) => field.onChange(val)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "active", label: "Active" },
                { value: "completed", label: "Completed" },
                { value: "on_hold", label: "On Hold" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          )}
        />

        {/* Start Date From */}
        <Controller
          name="startDateFrom"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateField
              id="startDateFrom"
              label="Start Date From"
              type="date"
              value={field.value || ""}
              onBlur={field.onBlur}
              error={error?.message}
              {...field}
            />
          )}
        />

        {/* Start Date To */}
        <Controller
          name="startDateTo"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateField
              id="startDateTo"
              label="Start Date To"
              type="date"
              value={field.value || ""}
              onBlur={field.onBlur}
              error={error?.message}
              {...field}
            />
          )}
        />

        {/* End Date From */}
        <Controller
          name="endDateFrom"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateField
              id="endDateFrom"
              label="Est. End From"
              type="date"
              value={field.value || ""}
              onBlur={field.onBlur}
              error={error?.message}
              {...field}
            />
          )}
        />

        {/* End Date To */}
        <Controller
          name="endDateTo"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateField
              id="endDateTo"
              label="Est. End To"
              type="date"
              value={field.value || ""}
              onBlur={field.onBlur}
              error={error?.message}
              {...field}
            />
          )}
        />
      </div>

      {/* Active Filters Count */}
      {showCount && hasActiveFilters && (
        <div className="text-xs text-muted-foreground">
          Showing {filteredCount} of {totalCount} projects
        </div>
      )}
    </div>
  );
}