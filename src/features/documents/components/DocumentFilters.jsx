// src/components/filters/DocumentFilters.jsx
import React from "react";
import { Controller } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import DateField from "@/Components/Form/DateField";

export default function DocumentFilters({ 
  control, 
  hasActiveFilters, 
  onClearFilters,
  showCount = false,
  filteredCount = 0,
  totalCount = 0,
  type = "invoices"
}) {
  const isInvoice = type === "invoices";

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
                { value: "paid", label: "Paid" },
                { value: "partially paid", label: "Partially Paid" },
                { value: "pending", label: "Pending" },
                { value: "overdue", label: "Overdue" },
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
              label="Due Date From"
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
              label="Due Date To"
              type="date"
              value={field.value || ""}
              onBlur={field.onBlur}
              error={error?.message}
              {...field}
            />
          )}
        />

        {/* Amount Min - Only for Quotes */}
        {!isInvoice && (
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
        )}

        {/* Amount Max - Only for Quotes */}
        {!isInvoice && (
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
        )}

        {/* Balance Min - Only for Invoices */}
        {isInvoice && (
          <Controller
            name="balanceMin"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField
                id="balanceMin"
                label="Balance Due Min"
                type="number"
                value={field.value || ""}
                placeholder="Min balance"
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                error={error?.message}
              />
            )}
          />
        )}

        {/* Balance Max - Only for Invoices */}
        {isInvoice && (
          <Controller
            name="balanceMax"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField
                id="balanceMax"
                label="Balance Due Max"
                type="number"
                value={field.value || ""}
                placeholder="Max balance"
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                error={error?.message}
              />
            )}
          />
        )}
      </div>

      {/* Active Filters Count */}
      {showCount && hasActiveFilters && (
        <div className="text-xs text-muted-foreground">
          Showing {filteredCount} of {totalCount} {type}
        </div>
      )}
    </div>
  );
}