import React from "react";
import FormField from "@/components/Form/FormField";
import SelectField from "@/components/Form/SelectField";

export default function ProjectFilters({ filters, onFilterChange }) {
    return (
        <div className="flex gap-4 mb-4">
            <FormField
                placeholder="Filter by title..."
                value={filters.title || ""}
                onChange={(e) => onFilterChange("title", e.target.value)}
                className="max-w-sm"
            />

            <SelectField
                placeholder="Status"
                value={filters.status || ""}
                onChange={(e) => onFilterChange("status", e.target.value)}
                options={[
                    { value: "", label: "All Status" },
                    { value: "draft", label: "Draft" },
                    { value: "pending", label: "Pending" },
                    { value: "in-progress", label: "In Progress" },
                    { value: "completed", label: "Completed" },
                    { value: "canceled", label: "Canceled" },
                    { value: "waiting-confirmation", label: "Waiting Confirmation" },
                ]}
                className="max-w-xs"
            />

            <SelectField
                placeholder="Category"
                value={filters.category || ""}
                onChange={(e) => onFilterChange("category", e.target.value)}
                options={[
                    { value: "", label: "All Categories" },
                    { value: "Web Design", label: "Web Design" },
                    { value: "Modifications", label: "Modifications" },
                    { value: "Development", label: "Development" },
                ]}
                className="max-w-xs"
            />
        </div>
    );
}
