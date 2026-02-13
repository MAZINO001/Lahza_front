import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

import { usePacks } from "../hooks/usePacks";
import {
  useCreatePlan,
  useUpdatePlan,
  useAddPlanPrice,
  useUpdatePlanPrice,
  useAddCustomField,
  useUpdateCustomField,
  useDeleteCustomField,
  useAddPlanFeature,
  useUpdatePlanFeature,
  useDeletePlanFeature,
} from "../hooks/usePlans";
import SelectField from "@/components/Form/SelectField";
import FormField from "@/components/Form/FormField";
import TextareaField from "@/components/Form/TextareaField";

function FormInput({ label, error, ...props }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input {...props} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function PlanForm({ plan, onSuccess, onCancel, packId }) {
  const { data: packsData } = usePacks();
  const packs = packsData?.data || [];

  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const addPlanPrice = useAddPlanPrice();
  const updatePlanPrice = useUpdatePlanPrice();
  const addCustomField = useAddCustomField();
  const updateCustomField = useUpdateCustomField();
  const deleteCustomField = useDeleteCustomField();
  const addPlanFeature = useAddPlanFeature();
  const updatePlanFeature = useUpdatePlanFeature();
  const deletePlanFeature = useDeletePlanFeature();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      pack_id: packId || "",
      name: "",
      description: "",
      is_active: true,
      prices: [{ interval: "monthly", price: "", currency: "USD" }],
      custom_fields: [],
      features: [],
    },
  });

  const {
    fields: priceFields,
    append: appendPrice,
    remove: removePrice,
  } = useFieldArray({ control, name: "prices" });

  const {
    fields: customFields,
    append: appendCustom,
    remove: removeCustom,
  } = useFieldArray({ control, name: "custom_fields" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  useEffect(() => {
    if (plan) {
      reset({
        pack_id: String(plan.pack_id || ""),
        name: plan.name || "",
        description: plan.description || "",
        is_active: plan.is_active !== false,
        prices:
          plan.prices?.length > 0
            ? plan.prices
            : [{ interval: "monthly", price: "", currency: "USD" }],
        custom_fields: plan.custom_fields || [],
        features: plan.features?.map(feature => ({
          id: feature.id,
          name: feature.feature_name
        })) || [],
      });
    }
  }, [plan, reset]);

  const onSubmit = (data) => {
    // Validation
    if (!data.pack_id) {
      toast.error("Please select a pack");
      return;
    }
    if (!data.name?.trim()) {
      toast.error("Plan name is required");
      return;
    }
    if (data.prices.some((p) => !p.price || Number(p.price) <= 0)) {
      toast.error("All prices must be positive numbers");
      return;
    }

    // Filter out empty features and map to strings (backend expects array of strings)
    const validFeatures =
      data.features
        ?.filter((feature) => feature.name?.trim())
        .map((feature) => feature.name) || [];

    // Prepare payload - everything goes in one request
    const payload = {
      pack_id: Number(data.pack_id),
      name: data.name,
      description: data.description || "",
      is_active: data.is_active,
      // Convert prices with proper formatting
      prices: data.prices.map((p) => ({
        interval: p.interval,
        price: Number(p.price),
        currency: p.currency,
        // Include price ID if it exists (for updates)
        ...(p.id && { id: p.id }),
      })),
      // Include custom fields
      custom_fields: data.custom_fields.map((cf) => ({
        key: cf.key,
        label: cf.label,
        type: cf.type,
        default_value: cf.default_value,
        required: cf.required,
        // Include field ID if it exists (for updates)
        ...(cf.id && { id: cf.id }),
      })),
      // Backend expects: features: ["feature 1", "feature 2", ...]
      features: validFeatures,
    };

    if (plan) {
      // Update: single request with all data
      updatePlan.mutate(
        { id: plan.id, ...payload },
        {
          onSuccess: () => {
            toast.success("Plan updated successfully");
            onSuccess?.();
          },
          onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong");
          },
        },
      );
    } else {
      // Create: single request with all data
      createPlan.mutate(payload, {
        onSuccess: () => {
          toast.success("Plan created successfully");
          onSuccess?.();
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Something went wrong");
        },
      });
    }
  };

  const handleSavePrices = () => {
    const currentPrices = watch("prices");

    // Validate prices
    if (currentPrices.some((p) => !p.price || Number(p.price) <= 0)) {
      toast.error("All prices must be positive numbers");
      return;
    }

    if (!plan) {
      toast.error("Plan must be created first");
      return;
    }

    // Process each price
    currentPrices.forEach((price) => {
      const priceData = {
        interval: price.interval,
        price: Number(price.price),
        currency: price.currency,
      };

      if (price.id) {
        // Update existing price
        updatePlanPrice.mutate(
          { planId: plan.id, priceId: price.id, ...priceData },
          {
            onSuccess: () => toast.success("Price updated successfully"),
            onError: (err) =>
              toast.error(
                err?.response?.data?.message || "Failed to update price",
              ),
          },
        );
      } else {
        // Add new price
        addPlanPrice.mutate(
          { planId: plan.id, ...priceData },
          {
            onSuccess: () => toast.success("Price added successfully"),
            onError: (err) =>
              toast.error(
                err?.response?.data?.message || "Failed to add price",
              ),
          },
        );
      }
    });
  };

  const handleSaveCustomFields = () => {
    const currentCustomFields = watch("custom_fields");

    // Validate custom fields
    if (
      currentCustomFields.some((cf) => !cf.key?.trim() || !cf.label?.trim())
    ) {
      toast.error("All custom fields must have a key and label");
      return;
    }

    if (!plan) {
      toast.error("Plan must be created first");
      return;
    }

    // Process each custom field
    currentCustomFields.forEach((field) => {
      const fieldData = {
        key: field.key,
        label: field.label,
        type: field.type,
        default_value: field.default_value,
        required: field.required,
      };

      if (field.id) {
        // Update existing field
        updateCustomField.mutate(
          { planId: plan.id, fieldId: field.id, ...fieldData },
          {
            onSuccess: () => toast.success("Custom field updated successfully"),
            onError: (err) =>
              toast.error(
                err?.response?.data?.message || "Failed to update custom field",
              ),
          },
        );
      } else {
        // Add new field
        addCustomField.mutate(
          { planId: plan.id, ...fieldData },
          {
            onSuccess: () => toast.success("Custom field added successfully"),
            onError: (err) =>
              toast.error(
                err?.response?.data?.message || "Failed to add custom field",
              ),
          },
        );
      }
    });
  };

  const handleSaveFeatures = () => {
    const currentFeatures = watch("features");

    // Filter out empty features and validate
    const validFeatures =
      currentFeatures?.filter((feature) => feature.name?.trim()) || [];

    if (validFeatures.length === 0) {
      toast.error("Please add at least one feature with content");
      return;
    }

    if (!plan) {
      toast.error("Plan must be created first");
      return;
    }

    // Backend expects array of objects with feature_name field
    const featuresPayload = validFeatures.map((feature) => ({
      feature_name: feature.name,
    }));

    // Send all features in one request
    addPlanFeature.mutate(
      { planId: plan.id, features: featuresPayload },
      {
        onSuccess: () => toast.success("Features added successfully"),
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Failed to add features"),
      },
    );
  };


  const handleDeleteFeature = (planId, featureId) => {
    console.log(planId, featureId);
    deletePlanFeature.mutate({ planId, featureId }, {
      onSuccess: () => {
        // Also update the local form state to remove the deleted feature
        const currentFeatures = watch("features");
        const updatedFeatures = currentFeatures.filter(f => f.id !== featureId);
        setValue("features", updatedFeatures);
      }
    });
  };

  const handleDeleteCustomField = (planId, fieldId) => {
    console.log(planId, fieldId);
    deleteCustomField.mutate({ planId, fieldId });
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>{plan ? "Edit Plan" : "Create Plan"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full gap-4">
            <div className="flex flex-col gap-4 w-[50%]">
              <div className="w-full ">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Plan Name"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      value={field.value}
                      placeholder="Pro, Business, Enterprise, etc."
                      error={errors.name?.message}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="flex items-center gap-4 w-full ">
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="cursor-pointer"
                        id="is-active"
                      />
                      <Label htmlFor="is-active" className="cursor-pointer">
                        Plan is active
                      </Label>
                    </>
                  )}
                />
              </div>
              <div className="w-full">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Description (optional)</Label>
                      <TextareaField
                        placeholder="What this plan includes..."
                        className="min-h-[90px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="w-[50%]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Features</label>
                  <div className="flex gap-2">
                    {plan && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleSaveFeatures}
                        disabled={
                          addPlanFeature.isPending ||
                          updatePlanFeature.isPending
                        }
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Features
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: "" })}
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  {fields.length === 0 ? (
                    <div className="flex items-center gap-2 w-full">
                      <Controller
                        name={`features.0.name`}
                        control={control}
                        render={({ field }) => (
                          <FormField
                            className={"w-full"}
                            placeholder="e.g. 10 projects, 100 users"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  ) : (
                    fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 w-full"
                      >
                        <Controller
                          name={`features.${index}.name`}
                          control={control}
                          render={({ field }) => (
                            <FormField
                              className={"w-full"}
                              placeholder="e.g. 10 projects, 100 users"
                              {...field}
                            />
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const currentFeatures = watch("features");
                            const featureToDelete = currentFeatures[index];
                            if (featureToDelete?.id) {
                              handleDeleteFeature(plan.id, featureToDelete.id);
                            } else {
                              // If no ID, just remove from form
                              remove(index);
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pricing Tiers</CardTitle>
            </div>
            <div className="flex gap-2">
              {plan && (
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleSavePrices}
                  disabled={addPlanPrice.isPending || updatePlanPrice.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Prices
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendPrice({
                    interval: "monthly",
                    price: "",
                    currency: "USD",
                  })
                }
                disabled={priceFields.length >= 3}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Pricing
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {priceFields.map((field, index) => (
            <div
              key={field.id}
              className="
                flex items-start justify-between gap-4 rounded-lg border w-full p-4 "
            >
              <div className="w-[30%]">
                <Controller
                  name={`prices.${index}.interval`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectField
                      label="Interval"
                      placeholder="Select billing cycle"
                      options={[
                        { value: "monthly", label: "Monthly" },
                        { value: "quarterly", label: "Quarterly" },
                        { value: "yearly", label: "Yearly" },
                      ]}
                      value={field.value || "monthly"}
                      onChange={(val) => field.onChange(val)}
                      onBlur={field.onBlur}
                      error={error?.message}
                    />
                  )}
                />
              </div>
              <div className="w-[30%]">
                <Controller
                  name={`prices.${index}.price`}
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="9.99"
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="w-[30%]">
                <Controller
                  name={`prices.${index}.currency`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectField
                      label="Currency"
                      placeholder="Select currency"
                      options={[
                        { value: "MAD", label: "MAD – Moroccan Dirham" },
                        { value: "EUR", label: "EUR – Euro" },
                        { value: "USD", label: "USD – US Dollar" },
                      ]}
                      value={field.value || "USD"}
                      onChange={(val) => field.onChange(val)}
                      onBlur={field.onBlur}
                      error={error?.message}
                    />
                  )}
                />
              </div>
              <div className="">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removePrice(index)}
                  disabled={priceFields.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {priceFields.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              Add at least one pricing option
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Features & Limits</CardTitle>
            </div>
            <div className="flex gap-2">
              {plan && (
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleSaveCustomFields}
                  disabled={
                    addCustomField.isPending || updateCustomField.isPending
                  }
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Fields
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendCustom({
                    key: "",
                    label: "",
                    type: "text",
                    default_value: "",
                    required: false,
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {customFields.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground italic">
              Add your custom inputs
            </div>
          ) : (
            <div className="space-y-4">
              {customFields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border bg-background p-4"
                >
                  <div className="flex items-center justify-between ">
                    <h4 className="font-bold">Feature Number {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      disabled={customFields.length <= 1}
                      onClick={() => {
                        const currentCustomFields = watch("custom_fields");
                        const fieldToDelete = currentCustomFields[index];
                        if (fieldToDelete?.id) {
                          handleDeleteCustomField(plan.id, fieldToDelete.id);
                        } else {
                          // If no ID, just remove from form
                          removeCustom(index);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 mb-4 md:grid-cols-2">
                    <Controller
                      name={`custom_fields.${index}.key`}
                      control={control}
                      render={({ field }) => (
                        <FormInput
                          label="Key (used in code)"
                          placeholder="max_projects"
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name={`custom_fields.${index}.label`}
                      control={control}
                      render={({ field }) => (
                        <FormInput
                          label="Display Name"
                          placeholder="Maximum Projects"
                          {...field}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 w-full space-y-4">
                    <div className="w-[43%]">
                      <Controller
                        name={`custom_fields.${index}.type`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <SelectField
                            label="Type"
                            placeholder="Select field type"
                            options={[
                              { value: "number", label: "Number" },
                              { value: "boolean", label: "Boolean (Yes/No)" },
                              { value: "text", label: "Text" },
                              { value: "json", label: "JSON / Complex" },
                            ]}
                            value={field.value || ""}
                            onChange={(val) => field.onChange(val)}
                            onBlur={field.onBlur}
                            error={error?.message}
                          />
                        )}
                      />
                    </div>
                    <div className="w-[43%]">
                      <Controller
                        name={`custom_fields.${index}.default_value`}
                        control={control}
                        render={({ field }) => (
                          <FormField
                            label="Default"
                            type="text"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                            placeholder="10 / true / etc."
                            {...field}
                            value={field.value ?? ""}
                          />
                        )}
                      />
                    </div>
                    <div className="flex  md:items-center pt-2 md:pt-0 w-[14%] ">
                      <Controller
                        name={`custom_fields.${index}.required`}
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center gap-2.5">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id={`req-${index}`}
                            />
                            <Label
                              htmlFor={`req-${index}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              Required
                            </Label>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm md:static md:bg-transparent md:backdrop-blur-none">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-0">
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || createPlan.isPending || updatePlan.isPending
              }
            >
              {createPlan.isPending || updatePlan.isPending
                ? "Saving..."
                : plan
                  ? "Update Plan"
                  : "Create Plan"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
