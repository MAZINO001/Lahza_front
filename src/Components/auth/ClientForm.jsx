/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";

import TheStepper from "@/Components/comp-517";
import FormSection from "@/Components/Form/FormSection";
import FormField from "@/Components/Form/FormField";
import CountrySelect from "@/Components/Form/CountrySelect";
import CurrencySelect from "@/Components/Form/CurrencySelect";
import ClientTypeRadio from "@/Components/Form/ClientTypeRadio";
import { Controller, useForm } from "react-hook-form";
import { useRegisterStore } from "@/hooks/registerStore";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { toast } from "sonner";

export function ClientForm({ onClientCreated, handleClientCreatedByAdmin }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { role } = useAuthContext();
  const registerStore = useRegisterStore();
  const registerMutation = useRegister();

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: registerStore,
  });

  const typeClientValue = watch("client_type");
  const paysValue = watch("country");

  const handleChange = (field, value) => setValue(field, value);

  useEffect(() => {
    if (paysValue === "Maroc") {
      registerStore.setField("currency", "MAD");
      registerStore.setField("vat", "20%");
      registerStore.setField("ice", "");
      registerStore.setField("siren", "");

      setValue("siren", "");
      setValue("ice", "");
    } else {
      registerStore.setField("currency", "");
      registerStore.setField("vat", "");
      registerStore.setField("ice", "");

      setValue("vat", "");
      setValue("ice", "");
    }
  }, [paysValue]);

  const steps = [1, 2];

  const onSubmit = async (data) => {
    let tempPassword = "";

    // Generate temp password only if admin is creating the client
    if (handleClientCreatedByAdmin) {
      const year = new Date().getFullYear();
      tempPassword = registerStore.name
        ? `${registerStore.name.trim().toLowerCase().replace(/\s+/g, "")}${year}`
        : "";

      console.log("🔐 Temp password generated:", tempPassword);
    }

    // Define all valid data fields (exclude methods and internal fields)
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

    if (handleClientCreatedByAdmin && tempPassword) {
      filledData.password = tempPassword;
      filledData.password_confirmation = tempPassword;
    }

    console.log("📤 Data being sent to backend:", filledData);

    try {
      const response = await registerMutation.mutateAsync(filledData);

      if (role === "admin") {
        onClientCreated?.();
        handleClientCreatedByAdmin?.(response?.client_id);
        registerStore.reset();
      } else {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleNextStep = async () => {
    if (currentStep === steps.length) return;

    // Fields to validate based on whether admin is creating or normal signup
    const step1Fields = handleClientCreatedByAdmin
      ? ["client_type", "name", "email", "phone", "company"]
      : [
          "client_type",
          "name",
          "email",
          "password",
          "password_confirmation",
          "phone",
          "company",
        ];

    const fieldsToValidate =
      currentStep === 1 ? step1Fields : ["address", "zip", "city", "country"];

    const isStepValid = await trigger(fieldsToValidate);

    if (!isStepValid) {
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep === 1) return;
    setCurrentStep((prev) => prev - 1);
  };

  useEffect(() => {
    registerStore.setField("user_type", "client");
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-3xl mx-auto p-4 text-foreground"
    >
      {/* Stepper Header */}
      <div className="mx-auto max-w-xl space-y-8 text-center">
        <TheStepper
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isLoading={isLoading}
        />
      </div>

      {/* STEP 1 */}
      {currentStep === 1 && (
        <>
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

            {/* Email + Téléphone */}
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

            {/* Password fields - only show for normal client signup */}
            {!handleClientCreatedByAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  }}
                  render={({ field }) => (
                    <FormField
                      id="password"
                      type="password"
                      label="Password"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        registerStore.setField("password", e.target.value);
                      }}
                      error={errors.password?.message}
                    />
                  )}
                />

                <Controller
                  name="password_confirmation"
                  control={control}
                  rules={{
                    required: "Password confirmation is required",
                    validate: (val) =>
                      val === watch("password") || "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <FormField
                      id="password_confirmation"
                      type="password"
                      label="Confirm Password"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        registerStore.setField(
                          "password_confirmation",
                          e.target.value,
                        );
                      }}
                      error={errors.password_confirmation?.message}
                    />
                  )}
                />
              </div>
            )}
          </FormSection>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full md:w-auto bg-primary hover:bg-[color-mix(in oklch,var(--primary)80%,black)] text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors mt-8"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <>
          <FormSection title="Address and Information">
            {/* Adresse + Zip */}
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

            {/* Ville + Pays */}
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

            {/* Conditional fields for company */}
            {typeClientValue === "company" && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {paysValue === "Maroc" ? (
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

                    {/* VAT - read only */}
                    <FormField
                      id="vat"
                      label="VAT"
                      value={registerStore.vat}
                      disabled
                      readOnly
                    />

                    {/* Currency - disabled */}
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
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={handlePrevStep}
              variant="outline"
              className="w-full md:w-auto"
            >
              Previous
            </Button>
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full md:w-auto bg-primary hover:bg-[color-mix(in oklch,var(--primary)80%,black)] text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
