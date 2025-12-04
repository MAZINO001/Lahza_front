// src/features/offers/components/OfferForm.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import TextareaField from "@/Components/Form/TextareaField";

import { useCreateOffer, useUpdateOffer } from "@/features/offers/hooks/useOffersQuery";
import { useServices } from "@/features/services/hooks/useServiceQuery";

export function OfferForm({ offer, onSuccess }) {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const createMutation = useCreateOffer();
  const updateMutation = useUpdateOffer();
  const mutation = offer?.id ? updateMutation : createMutation;
  const isEditMode = !!offer?.id;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: offer || {
      title: "",
      description: "",
      service_id: "",
      discount_type: "percent",
      discount_value: 0,
      start_date: "",
      end_date: "",
      status: "active",
    },
  });

  const onSubmit = (data) => {
    if (isSubmitting || !startSubmit()) return;

    const payload = {
      ...data,
      discount_value: Number(data.discount_value),
      service_id: Number(data.service_id),
    };

    mutation.mutate(
      isEditMode ? { id: offer.id, data: payload } : payload,
      {
        onSuccess: () => {
          onSuccess?.();
          if (!isEditMode) reset();
        },
        onSettled: () => endSubmit(),
      }
    );
  };

  const serviceOptions = services.map(s => ({
    label: s.name,
    value: String(s.id),
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      {servicesLoading && <p className="text-sm text-gray-500">Loading services...</p>}

      <Controller
        name="title"
        control={control}
        rules={{ required: "Title is required" }}
        render={({ field }) => (
          <FormField
            label="Offer Title"
            placeholder="e.g. Summer Sale 30%"
            error={errors.title?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        rules={{ required: "Description is required" }}
        render={({ field }) => (
          <TextareaField
            label="Description"
            placeholder="Describe this offer..."
            error={errors.description?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="service_id"
        control={control}
        rules={{ required: "Please select a service" }}
        render={({ field }) => (
          <SelectField
            label="Service"
            options={serviceOptions}
            placeholder={servicesLoading ? "Loading services..." : "Select a service"}
            value={String(field.value || "")}
            onChange={(v) => field.onChange(Number(v))}
            disabled={servicesLoading}
            error={errors.service_id?.message}
          />
        )}
      />

      <Controller
        name="discount_type"
        control={control}
        rules={{ required: "Discount type is required" }}
        render={({ field }) => (
          <SelectField
            label="Discount Type"
            options={[
              { value: "percent", label: "Percentage (%)" },
              { value: "fixed", label: "Fixed Amount (MAD)" },
            ]}
            {...field}
          />
        )}
      />

      <Controller
        name="discount_value"
        control={control}
        rules={{
          required: "Value is required",
          min: { value: 0, message: "Cannot be negative" },
        }}
        render={({ field }) => (
          <FormField
            label="Discount Value"
            type="number"
            step="0.01"
            placeholder="0"
            {...field}
          />
        )}
      />

      <Controller
        name="start_date"
        control={control}
        rules={{ required: "Start date is required" }}
        render={({ field }) => (
          <FormField
            type="date"
            label="Start Date"
            error={errors.start_date?.message}
            {...field} />
        )}
      />

      <Controller
        name="end_date"
        control={control}
        rules={{ required: "End date is required" }}
        render={({ field }) => (
          <FormField
            type="date"
            label="End Date"
            error={errors.end_date?.message}
            {...field} />
        )}
      />

      {isEditMode && (
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
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/${role}/offers`)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending ? "Saving..." : isEditMode ? "Update Offer" : "Create Offer"}
        </Button>
      </div>
    </form>
  );
}