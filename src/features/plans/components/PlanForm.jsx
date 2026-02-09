// PlanForm.jsx
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
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { usePacks } from "../hooks/usePacks";
import { useCreatePlan } from "../hooks/usePlans";
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

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      pack_id: packId || "",
      name: "",
      description: "",
      is_active: true,
      prices: [{ interval: "monthly", price: "", currency: "USD" }],
      custom_fields: [],
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
      });
    }
  }, [plan, reset]);

  const onSubmit = (data) => {
    // Basic client-side checks (since no zod)
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

    const payload = {
      ...data,
      pack_id: Number(data.pack_id),
      prices: data.prices.map((p) => ({
        ...p,
        price: Number(p.price),
      })),
    };

    console.log(payload);

    createPlan.mutate(payload, {
      onSuccess: () => {
        toast.success(plan ? "Plan updated" : "Plan created");
        onSuccess?.();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      },
    });
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
            </div>
            <div className="w-[50%]">
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
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pricing Tiers</CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendPrice({ interval: "monthly", price: "", currency: "USD" })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {priceFields.map((field, index) => (
            <div
              key={field.id}
              className="
                flex items-start justify-between gap-4 rounded-lg border w-full p-4"
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
                  className="text-destructive hover:bg-destructive/10"
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

      {/* Custom Fields / Features */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Features & Limits</CardTitle>
            </div>
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
        </CardHeader>

        <CardContent>
          {customFields.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground italic">
              Add things like max_storage, team_members, has_api_access...
            </div>
          ) : (
            <div className="space-y-5">
              {customFields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border bg-card p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium">Feature N {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeCustom(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
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

                  <div className="flex gap-4 w-full space-y-4">
                    <div className="w-[40%]">
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
                    <div className="w-[40%]">
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
                    <div className="flex items-end md:items-center pt-2 md:pt-0 w-[20%]">
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
              disabled={isSubmitting || createPlan.isPending}
            >
              {createPlan.isPending
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
