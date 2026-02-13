import React, { useEffect, useRef } from "react";
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
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

import { usePack, usePacks } from "../hooks/usePacks";
import {
  useCreatePlan,
  useUpdatePlan,
  useAddPlanPrice,
  useUpdatePlanPrice,
  useDeletePlanPrice,
  useAddCustomField,
  useUpdateCustomField,
  useDeleteCustomField,
  useAddPlanFeature,
  useUpdatePlanFeature,
  useDeletePlanFeature,
  usePlans,
} from "../hooks/usePlans";
import { useQueryClient } from "@tanstack/react-query";
import SelectField from "@/components/Form/SelectField";
import FormField from "@/components/Form/FormField";
import TextareaField from "@/components/Form/TextareaField";
import { QUERY_KEYS } from "@/lib/queryKeys";

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
  const { data: packsData } = usePack(packId);
  const queryClient = useQueryClient();
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

  const allFeaturesData = React.useMemo(() => {
    if (!packsData?.plans) return [];

    const seen = new Map(); // key by feature_name to avoid duplicates
    packsData.plans.forEach((plan) => {
      plan.features?.forEach((feature) => {
        if (feature?.feature_name && !seen.has(feature.feature_name)) {
          seen.set(feature.feature_name, feature);
        }
      });
    });

    return Array.from(seen.values());
  }, [packsData]);

  // When creating a new plan, pre-fill features with all existing features once
  const initializedCreateFeaturesRef = useRef(false);

  useEffect(() => {
    // Only run for create mode (no existing plan)
    if (plan || initializedCreateFeaturesRef.current) return;
    if (!allFeaturesData.length) return;

    const currentValues = watch();

    reset({
      ...currentValues,
      features: allFeaturesData.map((feature) => ({
        // We only care about the name when creating; backend will create new IDs
        name: feature.feature_name,
      })),
    });

    initializedCreateFeaturesRef.current = true;
  }, [plan, allFeaturesData, reset, watch]);

  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    if (plan) {
      setRefreshKey((prev) => prev + 1);
    }
  }, [plan]);

  React.useEffect(() => {
    return () => {
      if (plan) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(plan.id) });
      }
    };
  }, [plan, queryClient]);

  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const addPlanPrice = useAddPlanPrice();
  const updatePlanPrice = useUpdatePlanPrice();
  const deletePlanPrice = useDeletePlanPrice();
  const addCustomField = useAddCustomField();
  const updateCustomField = useUpdateCustomField();
  const deleteCustomField = useDeleteCustomField();
  const addPlanFeature = useAddPlanFeature();
  const updatePlanFeature = useUpdatePlanFeature();
  const deletePlanFeature = useDeletePlanFeature();

  useEffect(() => {
    if (plan) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(plan.id) });
      queryClient
        .refetchQueries({ queryKey: QUERY_KEYS.plan(plan.id) })
        .then(() => {
          const freshData = queryClient.getQueryData(QUERY_KEYS.plan(plan.id));
          reset({
            pack_id: freshData?.pack_id || plan.pack_id,
            name: freshData?.name || plan.name || "",
            description: freshData?.description || plan.description || "",
            is_active:
              freshData?.is_active !== false ? true : plan.is_active !== false,
            prices:
              freshData?.prices?.length > 0 || plan.prices?.length > 0
                ? freshData?.prices || plan.prices
                : [{ interval: "monthly", price: "", currency: "USD" }],
            custom_fields: freshData?.custom_fields || plan.custom_fields || [],
            features:
              (freshData?.features || plan.features)?.map((feature) => ({
                id: feature.id,
                name: feature.feature_name,
              })) || [],
          });
        });
    }
  }, [plan, reset, queryClient]);

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

    // Update: only basic plan fields (prices, features, custom_fields have their own CRUD endpoints)
    const updatePayload = {
      pack_id: Number(data.pack_id),
      name: data.name,
      description: data.description || "",
      is_active: data.is_active,
    };

    if (plan) {
      updatePlan.mutate(
        { id: plan.id, ...updatePayload },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
    } else {
      // Create: send full payload (prices, features, custom_fields) in one request
      const createPayload = {
        ...updatePayload,
        prices:
          data.prices
            ?.filter((p) => p.price != null && Number(p.price) > 0)
            .map((p) => ({
              interval: p.interval || "monthly",
              price: Number(p.price),
              currency: p.currency || "USD",
            })) || [],
        features: validFeatures,
        custom_fields:
          data.custom_fields
            ?.filter((cf) => cf.key?.trim() && cf.label?.trim())
            .map((cf) => ({
              key: cf.key,
              label: cf.label,
              type: cf.type || "text",
              default_value: cf.default_value ?? "",
              required: Boolean(cf.required),
            })) || [],
      };
      createPlan.mutate(createPayload, {
        onSuccess: () => {
          onSuccess?.();
        },
      });
    }
  };

  const handleSavePrices = async () => {
    const currentPrices = watch("prices");

    if (currentPrices.some((p) => !p.price || Number(p.price) <= 0)) {
      toast.error("All prices must be positive numbers");
      return;
    }

    if (!plan) {
      toast.error("Plan must be created first");
      return;
    }

    const promises = currentPrices.map((price) => {
      const priceData = {
        interval: price.interval,
        price: Number(price.price),
        currency: price.currency,
      };
      if (price.id) {
        return updatePlanPrice.mutateAsync({
          planId: plan.id,
          priceId: price.id,
          ...priceData,
        });
      }
      return addPlanPrice.mutateAsync({ planId: plan.id, ...priceData });
    });

    try {
      const results = await Promise.allSettled(promises);
      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        toast.error(
          failed.length === results.length
            ? "Failed to save prices"
            : `${failed.length} price(s) failed to save`,
        );
        return;
      }
      toast.success("Prices saved successfully");
    } catch {
      toast.error("Failed to save prices");
    }
  };

  const handleSaveCustomFields = async () => {
    const currentCustomFields = watch("custom_fields");

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

    const promises = currentCustomFields.map((field) => {
      const fieldData = {
        key: field.key,
        label: field.label,
        type: field.type,
        default_value: field.default_value,
        required: field.required,
      };
      if (field.id) {
        return updateCustomField.mutateAsync({
          planId: plan.id,
          fieldId: field.id,
          ...fieldData,
        });
      }
      return addCustomField.mutateAsync({ planId: plan.id, ...fieldData });
    });

    try {
      const results = await Promise.allSettled(promises);
      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        toast.error(
          failed.length === results.length
            ? "Failed to save custom fields"
            : `${failed.length} field(s) failed to save`,
        );
        return;
      }
      toast.success("Custom fields saved successfully");
    } catch {
      toast.error("Failed to save custom fields");
    }
  };

  const handleSaveFeatures = async () => {
    const currentFeatures = watch("features");

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

    const thisPlanFeatureIds = new Set(
      (plan.features || []).map((f) => f.id).filter(Boolean),
    );

    const results = await Promise.allSettled(
      validFeatures.map((feature) => {
        const featureData = { feature_name: feature.name };
        const isExistingOnThisPlan =
          feature.id && thisPlanFeatureIds.has(feature.id);

        if (isExistingOnThisPlan) {
          return updatePlanFeature.mutateAsync({
            planId: plan.id,
            featureId: feature.id,
            ...featureData,
          });
        }
        return addPlanFeature.mutateAsync({
          planId: plan.id,
          features: [featureData],
        });
      }),
    );

    // Update form with new feature IDs for added features
    const addedIndices = validFeatures
      .map((f, i) => (!f.id || !thisPlanFeatureIds.has(f.id) ? i : -1))
      .filter((i) => i >= 0);
    for (let i = 0; i < results.length; i++) {
      if (addedIndices.includes(i) && results[i].status === "fulfilled") {
        const { value } = results[i];
        const newFeature = value?.data?.[0] ?? value?.[0];
        if (newFeature) {
          const feature = validFeatures[i];
          const current = watch("features");
          const updated = current.map((f) =>
            f.name === feature.name && !thisPlanFeatureIds.has(f?.id)
              ? { id: newFeature.id, name: newFeature.feature_name ?? f.name }
              : f,
          );
          setValue("features", updated);
        }
      }
    }

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      toast.error(
        failed.length === results.length
          ? "Failed to save features"
          : `${failed.length} feature(s) failed to save`,
      );
      return;
    }
    toast.success("Features saved successfully");
  };

  const handleDeleteFeature = (planId, featureId) => {
    console.log(planId, featureId);
    deletePlanFeature.mutate(
      { planId, featureId },
      {
        onSuccess: () => {
          // Also update the local form state to remove the deleted feature
          const currentFeatures = watch("features");
          const updatedFeatures = currentFeatures.filter(
            (f) => f.id !== featureId,
          );
          setValue("features", updatedFeatures);
          // Invalidate plan query to refresh parent data
          queryClient.invalidateQueries({ queryKey: ["plans"] });
          queryClient.invalidateQueries({ queryKey: ["plan", plan.id] });
        },
      },
    );
  };

  const handleDeleteCustomField = (planId, fieldId) => {
    console.log(planId, fieldId);
    deleteCustomField.mutate(
      { planId, fieldId },
      {
        onSuccess: () => {
          toast.success("Custom field deleted successfully");
          // Also update the local form state to remove the deleted field
          const currentFields = watch("custom_fields");
          const updatedFields = currentFields.filter((f) => f.id !== fieldId);
          setValue("custom_fields", updatedFields);
          // Invalidate plan query to refresh parent data
          queryClient.invalidateQueries({ queryKey: ["plans"] });
          queryClient.invalidateQueries({ queryKey: ["plan", plan.id] });
        },
      },
    );
  };

  const handleDeletePrice = (planId, priceId) => {
    console.log(planId, priceId);
    deletePlanPrice.mutate(
      { planId, priceId },
      {
        onSuccess: () => {
          // Also update the local form state to remove the deleted price
          const currentPrices = watch("prices");
          const updatedPrices = currentPrices.filter((p) => p.id !== priceId);
          setValue("prices", updatedPrices);
          // Invalidate plan query to refresh parent data
          queryClient.invalidateQueries({ queryKey: ["plans"] });
          queryClient.invalidateQueries({ queryKey: ["plan", plan.id] });
        },
      },
    );
  };

  return (
    <form
      key={refreshKey}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 min-h-screen"
    >
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

                {/* Available features from all plans */}
                {plan && (
                  <div className="bg-background p-4 space-y-2 border rounded-lg">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Available Features
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {allFeaturesData
                        .filter((f) => f.plan_id !== plan.id)
                        .map((feature) => {
                          const currentFeatures = watch("features") || [];
                          const isSelected = currentFeatures.some(
                            (f) => f.name === feature.feature_name,
                          );

                          return (
                            <button
                              key={feature.id}
                              type="button"
                              onClick={() => {
                                const latestFeatures = watch("features") || [];
                                if (isSelected) {
                                  // Remove from current features without using delete button
                                  const updated = latestFeatures.filter(
                                    (f) => f.name !== feature.feature_name,
                                  );
                                  setValue("features", updated);
                                } else {
                                  // Append if not already present
                                  append({
                                    id: feature.id,
                                    name: feature.feature_name,
                                  });
                                }
                              }}
                              className={`flex items-center gap-1 rounded px-2 py-1 text-xs border ${
                                isSelected
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <span>{feature.feature_name}</span>
                                  <X className="h-3 w-3" />
                                </>
                              ) : (
                                <>+ {feature.feature_name}</>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Current features */}
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
                  onClick={() => {
                    const currentPrices = watch("prices");
                    const priceToDelete = currentPrices[index];
                    if (priceToDelete?.id) {
                      handleDeletePrice(plan.id, priceToDelete.id);
                    } else {
                      // If no ID, just remove from form
                      removePrice(index);
                    }
                  }}
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
              <CardTitle>Custom Fields</CardTitle>
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
