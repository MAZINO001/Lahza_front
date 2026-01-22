import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/Form/FormField";
import SelectField from "@/components/Form/SelectField";
import TextareaField from "@/components/Form/TextareaField";
import { useAuthContext } from "@/hooks/AuthContext";
import DateField from "@/components/Form/DateField";

export default function ObjectivesForm({
  open,
  onOpenChange,
  objective = null,
  onSave,
}) {
  const { user } = useAuthContext();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      start_date: "",
      end_date: "",
      owner_id: user?.id || 1,
    },
  });

  useEffect(() => {
    if (objective) {
      reset(objective);
    } else {
      reset({
        title: "",
        description: "",
        status: "pending",
        start_date: "",
        end_date: "",
        owner_id: user?.id || 1,
      });
    }
  }, [objective, user, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <div>
      <div className="space-y-4">
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <FormField
              label="Title"
              placeholder="e.g., Improve Client Satisfaction"
              error={errors.title?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextareaField
              label="Description"
              placeholder="Describe your objective..."
              error={errors.description?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <SelectField
              label="Status"
              options={[
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
                { value: "in_progress", label: "In Progress" },
              ]}
              value={field.value || ""}
              onChange={(val) => field.onChange(val)}
              onBlur={field.onBlur}
              error={error?.message}
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="start_date"
            control={control}
            render={({ field }) => (
              // <FormField
              <DateField
                label="Start Date"
                type="date"
                error={errors.start_date?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="end_date"
            control={control}
            render={({ field }) => (
              // <FormField
              <DateField
                label="End Date"
                type="date"
                error={errors.end_date?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)}>
          {objective ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
}
