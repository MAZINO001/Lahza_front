// src/components/filters/ClientFilters.jsx
import React from "react";
import { Controller } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";

export default function ClientFilters({ 
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
        {/* Order Filter */}
        <Controller
          name="order"
          control={control}
          render={({ field }) => (
            <SelectField
              id="order"
              label="Order"
              value={field.value || "A-Z"}
              onChange={(val) => field.onChange(val)}
              options={[
                { value: "A-Z", label: "A-Z" },
                { value: "Z-A", label: "Z-A" },
              ]}
            />
          )}
        />

        {/* Client Type Filter */}
        <Controller
          name="clientType"
          control={control}
          render={({ field }) => (
            <SelectField
              id="clientType"
              label="Client Type"
              value={field.value || "all"}
              onChange={(val) => field.onChange(val)}
              options={[
                { value: "all", label: "All Types" },
                { value: "company", label: "Company" },
                { value: "individual", label: "Individual" },
              ]}
            />
          )}
        />

        {/* Location Filter */}
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <SelectField
              id="location"
              label="Location"
              value={field.value || "all"}
              onChange={(val) => field.onChange(val)}
              options={[
                { value: "all", label: "All Locations" },
                { value: "national", label: "National" },
                { value: "foreign", label: "Foreign" },
              ]}
            />
          )}
        />

        {/* Total Paid Min */}
        <Controller
          name="totalPaidMin"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormField
              id="totalPaidMin"
              label="Total Paid Min"
              type="number"
              value={field.value || ""}
              placeholder="Min total paid"
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              error={error?.message}
            />
          )}
        />

        {/* Total Paid Max */}
        <Controller
          name="totalPaidMax"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormField
              id="totalPaidMax"
              label="Total Paid Max"
              type="number"
              value={field.value || ""}
              placeholder="Max total paid"
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              error={error?.message}
            />
          )}
        />

        {/* Balance Due Min */}
        <Controller
          name="balanceDueMin"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormField
              id="balanceDueMin"
              label="Balance Due Min"
              type="number"
              value={field.value || ""}
              placeholder="Min balance due"
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              error={error?.message}
            />
          )}
        />

        {/* Balance Due Max */}
        <Controller
          name="balanceDueMax"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormField
              id="balanceDueMax"
              label="Balance Due Max"   
              type="number"
              value={field.value || ""}
              placeholder="Max balance due"
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              error={error?.message}
            />
          )}
        />
      </div>

      {/* Active Filters Count */}
      {showCount && hasActiveFilters && (
        <div className="text-xs text-muted-foreground">
          Showing {filteredCount} of {totalCount} clients
        </div>
      )}
    </div>
  );
}