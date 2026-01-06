/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/Form/FormField";
import SelectField from "@/components/Form/SelectField";
import TextareaField from "@/components/Form/TextareaField";
import { useAuthContext } from "@/hooks/AuthContext";

export default function ObjectivesForm({
  open,
  onOpenChange,
  objective = null,
  onSave,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "not-started",
    start_date: "",
    end_date: "",
  });

  const { user } = useAuthContext();

  useEffect(() => {
    if (objective) {
      setFormData(objective);
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        start_date: "",
        owner_id: user.id || 1,
      });
    }
  }, [objective , user]);

  const handleSave = () => {
    if (!formData.title.trim()) return;
    onSave(formData);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <div>
      <div className="space-y-4">
        <FormField
          label="Title"
          placeholder="e.g., Improve Client Satisfaction"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <TextareaField
          label="Description"
          placeholder="Describe your objective..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <div className="w-full">
          <SelectField
            label="Status"
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value })
            }
            options={[
              { value: "pending", label: "Pending" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
              { value: "in_progress", label: "In Progress" },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Start Date"
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
          />

          <FormField
            label="End Date"
            type="date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>{objective ? "Update" : "Save"}</Button>
      </div>
    </div>
  );
}
