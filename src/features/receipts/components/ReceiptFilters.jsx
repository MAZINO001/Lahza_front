// src/components/filters/ReceiptFilters.jsx
import React from "react";
import { Controller } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import DateField from "@/Components/Form/DateField";

export default function ReceiptFilters({ 
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
        {/* Payment Method Filter */}
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <SelectField
              id="paymentMethod"
              label="Payment Method"
              value={field.value || "all"}
              onChange={(val) => field.onChange(val)}
              options={[
                { value: "all", label: "All Methods" },
                { value: "stripe", label: "Stripe" },
                { value: "bank", label: "Bank Transfer" },
                { value: "cash", label: "Cash" },
                { value: "check", label: "Check" },
              ]}
            />
          )}
        />

        {/* Date From */}
        <Controller
          name="dateFrom"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateField
              id="dateFrom"
              label="Date From"
              type="date"
              value={field.value || ""}
              onBlur={field.onBlur}
              error={error?.message}
              {...field}
            />
          )}
        />

        {/* Date To */}
        <Controller
          name="dateTo"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateField
              id="dateTo"
              label="Date To"
              type="date"
              value={field.value || ""}
              onBlur={field.onBlur}
              error={error?.message}
              {...field}
            />
          )}
        />

        {/* Amount Min */}
        <Controller
          name="amountMin"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormField
              id="amountMin"
              label="Amount Min"
              type="number"
              value={field.value || ""}
              placeholder="Min amount"
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              error={error?.message}
            />
          )}
        />

        {/* Amount Max */}
        <Controller
          name="amountMax"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormField
              id="amountMax"
              label="Amount Max"
              type="number"
              value={field.value || ""}
              placeholder="Max amount"
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
          Showing {filteredCount} of {totalCount} receipts
        </div>
      )}
    </div>
  );
}