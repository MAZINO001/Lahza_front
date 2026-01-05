import React from "react";
import FormField from "@/components/Form/FormField";
import SelectField from "@/components/Form/SelectField";

export default function UserFilters({ filters, onFilterChange }) {
    return (
        <div className="flex gap-4 mb-4">
            <FormField
                placeholder="Filter by name..."
                value={filters.name || ""}
                onChange={(e) => onFilterChange("name", e.target.value)}
                className="max-w-sm"
            />

            <SelectField
                placeholder="Role"
                value={filters.role || ""}
                onChange={(e) => onFilterChange("role", e.target.value)}
                options={[
                    { value: "", label: "All Roles" },
                    { value: "admin", label: "Admin" },
                    { value: "editor", label: "Editor" },
                    { value: "viewer", label: "Viewer" },
                ]}
                className="max-w-xs"
            />

            <SelectField
                placeholder="Status"
                value={filters.status || ""}
                onChange={(e) => onFilterChange("status", e.target.value)}
                options={[
                    { value: "", label: "All Status" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "suspended", label: "Suspended" },
                ]}
                className="max-w-xs"
            />
        </div>
    );
}
