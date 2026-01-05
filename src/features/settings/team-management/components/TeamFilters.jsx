import React from "react";
import FormField from "@/components/Form/FormField";
import SelectField from "@/components/Form/SelectField";

export default function TeamFilters({ filters, onFilterChange }) {
    return (
        <div className="flex gap-4 mb-4">
            <FormField
                placeholder="Filter by name..."
                value={filters.name || ""}
                onChange={(e) => onFilterChange("name", e.target.value)}
                className="max-w-sm"
            />

            <SelectField
                placeholder="Contract Type"
                value={filters.contractType || ""}
                onChange={(e) => onFilterChange("contractType", e.target.value)}
                options={[
                    { value: "", label: "All Types" },
                    { value: "CDI", label: "CDI" },
                    { value: "CDD", label: "CDD" },
                    { value: "Freelance", label: "Freelance" },
                    { value: "Intern", label: "Intern" },
                ]}
                className="max-w-xs"
            />
        </div>
    );
}
