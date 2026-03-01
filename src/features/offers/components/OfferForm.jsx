import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import RichTextEditor from "@/components/Form/RichTextEditor";

import {
  useCreateOffer,
  useOffer,
  useUpdateOffer,
} from "@/features/offers/hooks/useOffersQuery";
import { useServices } from "@/features/services/hooks/useServices";
import DateField from "@/components/Form/DateField";
import Checkbox from "@/components/Checkbox";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

export function OfferForm({ offerId, onSuccess }) {
  const { data: offer, isLoading } = useOffer(offerId);

  const navigate = useNavigate();
  const { role } = useAuthContext();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const createMutation = useCreateOffer();
  const updateMutation = useUpdateOffer();
  const mutation = offer?.id ? updateMutation : createMutation;
  const isEditMode = !!offer?.id;
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      service_id: "",
      discount_type: "percent",
      discount_value: 0,
      start_date: "",
      end_date: "",
      status: "active",
      placement: [],
    },
  });

  // Reset form when offer data loads
  useEffect(() => {
    if (offer && !isLoading) {
      reset({
        ...offer,
        placement: offer.placement || [], // Handle existing placement data from backend
      });
    }
  }, [offer, isLoading, reset]);

  const PLACEMENT_OPTIONS = [
    { id: "header", label: t("offers.form.placement.header") },
    { id: "calendar", label: t("offers.form.placement.calendar") },
    { id: "projects", label: t("offers.form.placement.projects") },
    { id: "invoices", label: t("offers.form.placement.invoices") },
    { id: "quotes", label: t("offers.form.placement.quotes") },
  ];

  const PlacementCheckbox = ({ id, label, checked, onChange }) => (
    <div className="flex items-center space-x-2 ">
      <Checkbox
        className="cursor-pointer"
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <Label htmlFor={id} className="text-sm cursor-pointer">
        {label}
      </Label>
    </div>
  );

  const onSubmit = (data) => {
    if (isSubmitting || !startSubmit()) return;

    const payload = {
      ...data,
      discount_value: Number(data.discount_value),
      service_id: Number(data.service_id),
      placement: data.placement || [], // Ensure placement is always an array for JSON field
    };
    console.log("Payload:", payload); // Add this before mutation.mutate()

    mutation.mutate(isEditMode ? { id: offer.id, data: payload } : payload, {
      onSuccess: () => {
        onSuccess?.();
        if (!isEditMode) reset();
      },
      onSettled: () => endSubmit(),
    });
  };

  const serviceOptions = services.map((s) => ({
    label: s.name,
    value: String(s.id),
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 h-screen">
      {isLoading && offerId ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground">
            {t("offers.form.loading_offer")}
          </p>
        </div>
      ) : (
        <>
          {servicesLoading && (
            <p className="text-sm text-muted-foreground">
              {t("offers.form.loading_services")}
            </p>
          )}

          <div className="flex items-end gap-4">
            <div className="w-full">
              <Controller
                name="title"
                control={control}
                rules={{ required: t("offers.form.validation.title_required") }}
                render={({ field }) => (
                  <FormField
                    label={t("offers.form.title_label")}
                    placeholder={t("offers.form.title_placeholder")}
                    error={errors.title?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                name="service_id"
                control={control}
                rules={{
                  required: t("offers.form.validation.service_required"),
                }}
                render={({ field }) => (
                  <SelectField
                    label={t("offers.form.service_label")}
                    options={serviceOptions}
                    placeholder={
                      servicesLoading
                        ? t("offers.form.service_loading_placeholder")
                        : t("offers.form.service_placeholder")
                    }
                    value={String(field.value || "")}
                    onChange={(v) => field.onChange(Number(v))}
                    disabled={servicesLoading}
                    error={errors.service_id?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className="w-full">
            <Controller
              name="description"
              control={control}
              rules={{
                required: t("offers.form.validation.description_required"),
              }}
              render={({ field }) => (
                <RichTextEditor
                  label={t("offers.form.description_label")}
                  placeholder={t("offers.form.description_placeholder")}
                  error={errors.description?.message}
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex items-end gap-4 w-full">
            <div className="w-[50%]">
              <Controller
                name="discount_type"
                control={control}
                rules={{
                  required: t("offers.form.validation.discount_type_required"),
                }}
                render={({ field }) => (
                  <SelectField
                    label={t("offers.form.discount_type_label")}
                    options={[
                      {
                        value: "percent",
                        label: t("offers.form.discount_type_percent"),
                      },
                      {
                        value: "fixed",
                        label: t("offers.form.discount_type_fixed"),
                      },
                    ]}
                    {...field}
                  />
                )}
              />
            </div>

            <div className="w-[50%] ">
              <Controller
                name="discount_value"
                control={control}
                rules={{
                  required: t("offers.form.validation.discount_value_required"),
                  min: {
                    value: 0,
                    message: t("offers.form.validation.discount_value_min"),
                  },
                }}
                render={({ field }) => (
                  <FormField
                    label={t("offers.form.discount_value_label")}
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <div className="w-[50%]">
              <Controller
                name="start_date"
                control={control}
                rules={{
                  required: t("offers.form.validation.start_date_required"),
                }}
                render={({ field }) => (
                  // <FormField
                  <DateField
                    type="date"
                    label={t("offers.form.start_date_label")}
                    error={errors.start_date?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-[50%]">
              <Controller
                name="end_date"
                control={control}
                rules={{
                  required: t("offers.form.validation.end_date_required"),
                }}
                render={({ field }) => (
                  // <FormField
                  <DateField
                    type="date"
                    label={t("offers.form.end_date_label")}
                    error={errors.end_date?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          {isEditMode && (
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SelectField
                  label={t("offers.form.status_label")}
                  options={[
                    {
                      value: "active",
                      label: t("offers.form.status_active"),
                    },
                    {
                      value: "inactive",
                      label: t("offers.form.status_inactive"),
                    },
                  ]}
                  {...field}
                />
              )}
            />
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium">
              {t("offers.form.placement_label")}
            </label>
            <div className="space-y-2">
              <Controller
                name="placement"
                control={control}
                render={({ field }) => {
                  const placementValues = field.value || [];

                  const handleCheckboxChange = (placementId) => (e) => {
                    if (e.target.checked) {
                      field.onChange([...placementValues, placementId]);
                    } else {
                      field.onChange(
                        placementValues.filter((p) => p !== placementId),
                      );
                    }
                  };

                  return (
                    <div className="flex gap-4 ">
                      {PLACEMENT_OPTIONS.map((option) => (
                        <PlacementCheckbox
                          key={option.id}
                          id={`placement-${option.id}`}
                          label={option.label}
                          checked={placementValues.includes(option.id)}
                          onChange={handleCheckboxChange(option.id)}
                        />
                      ))}
                    </div>
                  );
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${role}/offers`)}
            >
              {t("offers.form.cancel_button")}
            </Button>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {mutation.isPending
                ? t("offers.form.saving")
                : isEditMode
                  ? t("offers.form.update_offer")
                  : t("offers.form.create_offer")}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
