import React from "react";
import FormField from "@/components/Form/FormField";
import SelectField from "@/components/Form/SelectField";

export default function UserFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <FormField
        placeholder="Search by name or email..."
        value={filters.search || ""}
        onChange={(e) => onFilterChange("search", e.target.value)}
        className="max-w-sm"
      />

      <SelectField
        placeholder="All Roles"
        value={filters.role || "all"}
        onChange={(val) => onFilterChange("role", val === "all" ? "" : val)}
        options={[
          { value: "all", label: "All Roles" },
          { value: "admin", label: "Admin" },
          { value: "manager", label: "Manager" },
          { value: "member", label: "Member" },
          { value: "client", label: "Client" },
        ]}
        className="max-w-xs"
      />
    </div>
  );
}
