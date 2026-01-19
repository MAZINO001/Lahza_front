import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import RichTextEditor from "@/components/Form/RichTextEditor";
import ImageUploader from "@/components/Form/ImageUploader";
import {
  useCreateService,
  useService,
  useUpdateService,
} from "../hooks/useServiceQuery";

export function ServiceForm({ serviceId, onSuccess }) {
  const { data: service } = useService(serviceId);
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
      time: "1",
      category: "",
      status: "active",
      image: null,
    },
  });
  const onSubmit = async (data) => {
    if (isSubmitting || !startSubmit()) return;

    // For UPDATE: Send as JSON (no image upload in edit)
    if (isEditMode) {
      const updateData = {
        name: data.name,
        description: data.description,
        base_price: Number(data.base_price).toFixed(2),
        tax_rate: Number(data.tax_rate),
        time: data.time,
        category: data.category,
        status: data.status,
      };

      // If user selected a new image, use FormData; otherwise send JSON
      if (data.image instanceof File) {
        const formData = new FormData();
        Object.entries(updateData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("image", data.image);

        mutation.mutate(
          { id: service.id, data: formData },
          {
            onSuccess: () => {
              onSuccess?.();
            },
            onSettled: () => endSubmit(),
          }
        );
      } else if (data.image === null && service?.image) {
        // User removed image
        updateData.remove_image = true;
        mutation.mutate(
          { id: service.id, data: updateData },
          {
            onSuccess: () => {
              onSuccess?.();
            },
            onSettled: () => endSubmit(),
          }
        );
      } else {
        // No image change
        mutation.mutate(
          { id: service.id, data: updateData },
          {
            onSuccess: () => {
              onSuccess?.();
            },
            onSettled: () => endSubmit(),
          }
        );
      }
    } else {
      // For CREATE: Use FormData (handles image upload)
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "image") {
          if (key === "base_price") {
            formData.append(key, Number(data[key]).toFixed(2));
          } else if (key === "tax_rate") {
            formData.append(key, Number(data[key]));
          } else if (
            data[key] !== undefined &&
            data[key] !== null &&
            data[key] !== ""
          ) {
            formData.append(key, data[key]);
          }
        }
      });

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      mutation.mutate(formData, {
        onSuccess: () => {
          onSuccess?.();
          reset();
        },
        onSettled: () => endSubmit(),
      });
    }
  };

  const isLoading = mutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 sm:p-6 h-screen"
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: "Name is required" }}
        render={({ field }) => (
          <FormField
            label="Service Name"
            placeholder="e.g., Premium Web Development"
            error={errors.name?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        rules={{ required: "Description is required" }}
        render={({ field }) => (
          <RichTextEditor
            label="Description"
            placeholder="Describe your service..."
            error={errors.description?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Service Image
            </label>
            <ImageUploader
              value={service?.image}
              onChange={field.onChange}
              error={errors.image?.message}
            />
          </div>
        )}
      />
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="w-full">
          <Controller
            name="base_price"
            control={control}
            rules={{ required: "Price is required" }}
            render={({ field }) => (
              <FormField
                label="Base Price (MAD)"
                type="number"
                step="0.01"
                error={errors.base_price?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className="w-full">
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
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="w-full">
          <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <FormField
                label="Service Duration"
                type="number"
                placeholder="e.g., 3 (days)"
                error={errors.time?.message}
                value={field.value}
                onChange={field.onChange}
                {...field}
              />
            )}
          />
        </div>
        <div className="w-full">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Service Category"
                placeholder=""
                value={field.value}
                onChange={field.onChange}
                {...field}
                options={[
                  { value: "development", label: "Development" },
                  { value: "design", label: "Design" },
                  { value: "marketing", label: "Marketing" },
                  { value: "management", label: "Management" },
                ]}
                error={errors.time?.message}
              />
            )}
          />
        </div>
      </div>
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

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/${role}/services`)}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {service?.id ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}
