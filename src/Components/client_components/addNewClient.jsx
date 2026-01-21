/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";

import FormSection from "@/Components/Form/FormSection";
import FormField from "@/Components/Form/FormField";
import CountrySelect from "@/Components/Form/CountrySelect";
import CurrencySelect from "@/Components/Form/CurrencySelect";
import ClientTypeRadio from "@/Components/Form/ClientTypeRadio";
import { Controller, useForm } from "react-hook-form";
import { useRegisterStore } from "@/hooks/registerStore";
import api from "@/lib/utils/axios";
import { useAuthContext } from "@/hooks/AuthContext";
import { toast } from "sonner";

export function ClientFormModal({
  onClientCreated,
  onClose,
  handleClientCreatedByAdmin,
}) {
  const [submitting, setSubmitting] = useState(false);
  const { role } = useAuthContext();
  const registerStore = useRegisterStore();

  const {
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: registerStore,
  });

  const typeClientValue = watch("client_type");
  const paysValue = watch("country");

  useEffect(() => {
    if (paysValue === "Morocco") {
      registerStore.setField("currency", "MAD");
      registerStore.setField("vat", "20%");
      registerStore.setField("ice", "");
      registerStore.setField("siren", "");
    } else {
      registerStore.setField("currency", "");
      registerStore.setField("vat", "");
      registerStore.setField("ice", "");
    }
  }, [paysValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);

    let tempPassword = "";

    const year = new Date().getFullYear();
    tempPassword = registerStore.name
      ? `${registerStore.name.trim().toLowerCase().replace(/\s+/g, "")}${year}`
      : "";

    console.log("🔐 Temp password generated:", tempPassword);

    const validFields = [
      "user_type",
      "name",
      "email",
      "password",
      "password_confirmation",
      "position",
      "department",
      "specialty",
      "linkedin",
      "portfolio",
      "github",
      "start_date",
      "end_date",
      "description",
      "tags",
      "resume",
      "company",
      "address",
      "zip",
      "phone",
      "city",
      "country",
      "client_type",
      "vat",
      "siren",
      "ice",
      "currency",
    ];

    const filledData = validFields.reduce((acc, field) => {
      const value = registerStore[field];
      if (value !== "" && value != null) {
        acc[field] = value;
      }
      return acc;
    }, {});

    filledData.password = tempPassword;
    filledData.password_confirmation = tempPassword;

    console.log("📤 Data being sent to backend:", filledData);

    try {
      const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        filledData,
      );

      onClientCreated?.(response?.data?.client_id);
      registerStore.reset();
      reset();
      toast.success("Client created successfully!");
      onClose?.();
    } catch (error) {
      console.error("Registration failed:", error.response?.data);
      toast.error(
        error.response?.data?.message ||
          "Failed to create client. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    registerStore.setField("user_type", "client");
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-2 text-foreground w-full max-h-[80vh] overflow-y-auto"
    >
      <FormSection title="Client Information">
        <Controller
          name="client_type"
          control={control}
          rules={{
            required: "Client type is required",
          }}
          render={({ field }) => (
            <ClientTypeRadio
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                registerStore.setField("client_type", value);
              }}
              error={errors.client_type?.message}
            />
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <FormField
                id="name"
                label="Full Name"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  registerStore.setField("name", e.target.value);
                }}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            name="company"
            control={control}
            rules={{ required: "Company name is required" }}
            render={({ field }) => (
              <FormField
                id="company"
                label="Company Name"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  registerStore.setField("company", e.target.value);
                }}
                error={errors.company?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <FormField
                id="email"
                type="email"
                label="Email Address"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  registerStore.setField("email", e.target.value);
                }}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            rules={{ required: "Phone is required" }}
            render={({ field }) => (
              <FormField
                id="phone"
                label="Phone"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  registerStore.setField("phone", e.target.value);
                }}
                error={errors.phone?.message}
              />
            )}
          />
        </div>
      </FormSection>

      <FormSection title="Address Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="address"
            control={control}
            rules={{
              required: "Address is required",
            }}
            render={({ field, fieldState: { error } }) => (
              <FormField
                id="address"
                label="Address"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  registerStore.setField("address", e.target.value);
                }}
                error={error?.message}
              />
            )}
          />

          <Controller
            name="zip"
            control={control}
            rules={{
              required: "Postal code is required",
            }}
            render={({ field, fieldState: { error } }) => (
              <FormField
                id="zip"
                label="Postal Code"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  registerStore.setField("zip", e.target.value);
                }}
                error={error?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="city"
            control={control}
            rules={{
              required: "City is required",
            }}
            render={({ field, fieldState: { error } }) => (
              <FormField
                id="city"
                label="City"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  registerStore.setField("city", e.target.value);
                }}
                error={error?.message}
              />
            )}
          />

          <Controller
            name="country"
            control={control}
            rules={{
              required: "Country is required",
            }}
            render={({ field, fieldState: { error } }) => (
              <CountrySelect
                id="country"
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  registerStore.setField("country", value);
                }}
                error={errors.country?.message}
              />
            )}
          />
        </div>

        {typeClientValue === "company" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {paysValue === "Morocco" ? (
              <>
                <Controller
                  name="ice"
                  control={control}
                  rules={{
                    required: "ICE is required",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <FormField
                      id="ice"
                      label="ICE"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        registerStore.setField("ice", e.target.value);
                      }}
                      error={error?.message}
                    />
                  )}
                />

                <FormField
                  id="vat"
                  label="VAT"
                  value={registerStore.vat}
                  disabled
                  readOnly
                />

                <CurrencySelect value="MAD" disabled readOnly />
              </>
            ) : (
              <>
                <Controller
                  name="siren"
                  control={control}
                  rules={{
                    required: "SIREN is required",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <FormField
                      id="siren"
                      label="SIREN"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        registerStore.setField("siren", e.target.value);
                      }}
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  name="currency"
                  control={control}
                  rules={{
                    required: "Currency is required",
                  }}
                  render={({ field }) => (
                    <CurrencySelect
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.currency?.message}
                    />
                  )}
                />
              </>
            )}
          </div>
        )}
      </FormSection>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          className="w-full md:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto bg-primary hover:bg-[color-mix(in oklch,var(--primary)80%,black)] text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {submitting ? "Registering..." : "Register"}
        </Button>
      </div>
    </form>
  );
}
