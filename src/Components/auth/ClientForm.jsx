/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";

import TheStepper from "@/Components/comp-517";
import FormSection from "@/Components/Form/FormSection";
import FormField from "@/Components/Form/FormField";
import CountrySelect from "@/Components/Form/CountrySelect";
import CurrencySelect from "@/Components/Form/CurrencySelect";
import ClientTypeRadio from "@/Components/Form/ClientTypeRadio";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRegisterStore } from "@/hooks/registerStore";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axios";

export function ClientForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const registerStore = useRegisterStore();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: registerStore,
  });

  const typeClientValue = watch("client_type"); // Access type_client
  const paysValue = watch("country"); // Access country

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
    setSubmitting(true);
    const filledData = Object.fromEntries(
      Object.entries(registerStore).filter(
        ([key, value]) => value !== "" && value != null
      )
    );

    console.log("Filled data:", filledData);
    try {
      const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        filledData,
      );
      console.log("Registration successful:", response.data);
      navigate("/auth/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    if (isLoading || currentStep === steps.length) return;
    setIsLoading(true);
    try {
      setCurrentStep((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
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
          <FormSection title="Informations du client">
            {/* Type de client */}
            {/* <ClientTypeRadio
              value={typeClientValue}
              onChange={(value) => handleChange("type_client", value)}
              errors={errors}
            /> */}
            <ClientTypeRadio
              value={typeClientValue}
              onChange={(value) => {
                handleChange("client_type", value);
                registerStore.setField("client_type", value); // Add this line
              }}
              errors={errors}
            />
            {/* Nom + company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="name"
                label="Nom complet"
                // {...register("nom")}
                value={watch("name")}
                onChange={(e) => {
                  setValue("name", e.target.value);
                  registerStore.setField("name", e.target.value);
                }}
                errors={errors.name}
              />
              <FormField
                id="company"
                label="Nom de l’entreprise"
                // {...register("company")}
                value={watch("company")}
                onChange={(e) => {
                  setValue("company", e.target.value);
                  registerStore.setField("company", e.target.value);
                }}
                errors={errors.company}
              />
            </div>

            {/* Email + Téléphone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="email"
                type="email"
                label="Adresse email"
                // {...register("email")}
                value={watch("email")}
                onChange={(e) => {
                  setValue("email", e.target.value);
                  registerStore.setField("email", e.target.value);
                }}
                errors={errors}
              />
              <FormField
                id="phone"
                label="Téléphone"
                // {...register("phone")}
                value={watch("phone")}
                onChange={(e) => {
                  setValue("phone", e.target.value);
                  registerStore.setField("phone", e.target.value);
                }}
                errors={errors.phone}
              />
            </div>

            {/* Mot de passe + Confirmation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="password"
                type="password"
                label="Mot de passe"
                // {...register("password")}
                value={watch("password")}
                onChange={(e) => {
                  setValue("password", e.target.value);
                  registerStore.setField("password", e.target.value);
                }}
                errors={errors.password}
              />
              <FormField
                id="password_confirmation"
                type="password"
                label="Confirmer le mot de passe"
                // {...register("password_confirmation")}
                value={watch("password_confirmation")}
                onChange={(e) => {
                  setValue("password_confirmation", e.target.value);
                  registerStore.setField(
                    "password_confirmation",
                    e.target.value
                  );
                }}
                errors={errors.password_confirmation}
              />
            </div>
          </FormSection>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full md:w-auto bg-primary hover:bg-[color-mix(in oklch,var(--primary)80%,black)] text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors mt-8"
            >
              Suivant
            </Button>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <>
          <FormSection title="Adresse et Informations">
            {/* Adresse + Zip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="address"
                label="Adresse"
                // {...register("address")}
                value={watch("address")}
                onChange={(e) => {
                  setValue("address", e.target.value);
                  registerStore.setField("address", e.target.value);
                }}
                errors={errors}
              />
              <FormField
                id="zip"
                label="Code postal"
                // {...register("zip")}
                value={watch("zip")}
                onChange={(e) => {
                  setValue("zip", e.target.value);
                  registerStore.setField("zip", e.target.value);
                }}
                errors={errors}
              />
            </div>

            {/* Ville + Pays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="city"
                label="Ville"
                // {...register("city")}
                value={watch("city")}
                onChange={(e) => {
                  setValue("city", e.target.value);
                  registerStore.setField("city", e.target.value);
                }}
                errors={errors}
              />
              {/* <CountrySelect
                value={paysValue}
                onChange={(value) => handleChange("pays", value)}
                errors={errors}
              /> */}

              <CountrySelect
                id="country"
                value={paysValue}
                onChange={(value) => {
                  handleChange("country", value);
                  registerStore.setField("country", value); // Add this line
                }}
                errors={errors}
              />
            </div>

            {/* Conditional fields */}
            {typeClientValue === "company" && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {paysValue === "Maroc" ? (
                  <>
                    {/* <FormField
                      id="tva"
                      label="Numéro TVA"
                      // {...register("tva")}
                      value={watch("tva")}
                      onChange={(e) => {
                        setValue("tva", e.target.value);
                        registerStore.setField("tva", e.target.value);
                      }}
                    /> */}
                    <FormField
                      id="ice"
                      label="ICE"
                      // {...register("ice")}
                      value={watch("ice")}
                      onChange={(e) => {
                        setValue("ice", e.target.value);
                        registerStore.setField("ice", e.target.value);
                      }}
                    />
                    {/* <FormField
                      id="devise"
                      label="Devise"
                      value="MAD"
                      disabled
                    /> */}

                    {/* <FormField id="tax" label="tax" value="20%" disabled /> */}
                    {/* <FormField
                      id="siren"
                      label="siren"
                      // {...register("siren")}
                      value={watch("siren")}
                      onChange={(e) => {
                        setValue("siren", e.target.value);
                        registerStore.setField("siren", e.target.value);
                      }}
                      errors={errors}
                    /> */}
                    <FormField
                      id="vat"
                      label="TVA"
                      value={registerStore.vat}
                      disabled
                      readOnly // <- explicitly mark it as read-only
                    />
                    <CurrencySelect
                      value="MAD"
                      disabled
                      readOnly // <- add this
                    />
                  </>
                ) : (
                  <>
                    <FormField
                      id="siren"
                      label="siren"
                      // {...register("siren")}
                      value={watch("siren")}
                      onChange={(e) => {
                        setValue("siren", e.target.value);
                        registerStore.setField("siren", e.target.value);
                      }}
                      errors={errors}
                    />
                    <CurrencySelect />
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
              Précédent
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto bg-primary hover:bg-[color-mix(in oklch,var(--primary)80%,black)] text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {submitting ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
