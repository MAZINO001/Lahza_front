
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import TextareaField from "@/Components/Form/TextareaField";
import { useCreateService, useUpdateService } from "../hooks/useServiceQuery";

export function ServiceForm({ service, onSuccess }) {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();

  const isEditMode = !!service?.id;

  const mutation = isEditMode ? updateMutation : createMutation;
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: service || {
      name: "",
      description: "",
      base_price: "",
      tax_rate: "0",
      status: "active",
    },
  });
  const onSubmit = async (data) => {
    if (isSubmitting || !startSubmit()) return;

    const payload = {
      ...data,
      base_price: Number(data.base_price).toFixed(2),
      tax_rate: Number(data.tax_rate),
    };

    mutation.mutate(
      isEditMode ? { id: service.id, data: payload } : payload,
      {
        onSuccess: () => {
          onSuccess?.();
          if (!isEditMode) reset();
        },
        onSettled: () => endSubmit(),
      }
    );
  };

  const isLoading = mutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <Controller
        name="name"
        control={control}
        rules={{ required: "Name is required" }}
        render={({ field }) => (
          <FormField label="Service Name" placeholder="e.g., Premium Web Development" error={errors.name?.message} {...field} />
        )}
      />

      <Controller
        name="description"
        control={control}
        rules={{ required: "Description is required" }}
        render={({ field }) => (
          <TextareaField label="Description" placeholder="Describe your service..." error={errors.description?.message} {...field} />
        )}
      />

      <Controller
        name="base_price"
        control={control}
        rules={{ required: "Price is required" }}
        render={({ field }) => (
          <FormField label="Base Price (MAD)" type="number" step="0.01" error={errors.base_price?.message} {...field} />
        )}
      />

      <Controller
        name="tax_rate"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Tax Rate"
            options={[
              { value: "20", label: "20%" },
              { value: "0", label: "0% (No Tax)" },
            ]}
            {...field}
          />
        )}
      />

      {service?.id && (
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              {...field}
            />
          )}
        />
      )}

      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="outline" onClick={() => navigate(`/${role}/services`)}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {service?.id ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}