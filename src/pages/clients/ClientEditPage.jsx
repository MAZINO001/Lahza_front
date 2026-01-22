import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import FormSection from "@/Components/Form/FormSection";
import FormField from "@/Components/Form/FormField";
import CountrySelect from "@/Components/Form/CountrySelect";
import CurrencySelect from "@/Components/Form/CurrencySelect";
import ClientTypeRadio from "@/Components/Form/ClientTypeRadio";
import {
  useClient,
  useUpdateClient,
} from "@/features/clients/hooks/useClients/useClients";

export default function ClientEditPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const clientId = state?.clientId;
  const { role } = useAuthContext();
  const [submitting, setSubmitting] = useState(false);
  const { data: data, isLoading } = useClient(clientId);
  const updateClientMutation = useUpdateClient();

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      client_type: data?.client.client_type || "",
      name: data?.client.user?.name || "",
      email: data?.client.user?.email || "",
      phone: data?.client.phone || "",
      company: data?.client.company || "",
      address: data?.client.address || "",
      city: data?.client.city || "",
      country: data?.client.country || "",
      ice: data?.client.ice || "",
      siren: data?.client.siren || "",
      vat: data?.client.vat || "",
      currency: data?.client.currency || "",
    },
  });
  const typeClientValue = watch("client_type");
  const paysValue = watch("country");

  useEffect(() => {
    if (data) {
      console.log("Country value from API:", data?.client.country);
      reset({
        client_type: data?.client.client_type || "",
        name: data?.client.user?.name || "",
        email: data?.client.user?.email || "",
        phone: data?.client.phone || "",
        company: data?.client.company || "",
        address: data?.client.address || "",
        city: data?.client.city || "",
        country: data?.client.country || "",
        ice: data?.client.ice || "",
        siren: data?.client.siren || "",
        vat: data?.client.vat || "",
        currency: data?.client.currency || "",
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (paysValue === "Maroc") {
      setValue("currency", "MAD");
      setValue("vat", "20%");
      setValue("siren", "");
    } else if (paysValue && paysValue !== "Maroc") {
      setValue("vat", "");
      setValue("ice", "");
    }
  }, [paysValue, setValue]);

  const onSubmit = (data) => {
    setSubmitting(true);

    const submitData = {
      client_type: data.client_type || "",
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      company: data.company || "",
      address: data.address || "",
      city: data.city || "",
      country: data.country || "",
      ice: data.ice || "",
      siren: data.siren || "",
      vat: data.vat || "",
      currency: data.currency || "",
    };

    console.log(submitData);

    updateClientMutation.mutate(
      { id: clientId, data: submitData },
      {
        onSuccess: () => {
          setSubmitting(false);
          navigate(`/${role}/clients`);
        },
        onError: (error) => {
          setSubmitting(false);
          console.error("Update failed:", error);
        },
      },
    );
  };
  const handleCancel = () => {
    navigate(`/${role}/clients`);
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4 h-screen">
      <FormSection title="update client information">
        <Controller
          name="client_type"
          control={control}
          rules={{ required: "Le type de data est requis" }}
          render={({ field }) => (
            <ClientTypeRadio
              value={field.value}
              onChange={field.onChange}
              error={errors.client_type?.message}
            />
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Le nom est requis" }}
            render={({ field }) => (
              <FormField
                id="name"
                label="Nom complet"
                value={field.value}
                onChange={field.onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            name="company"
            control={control}
            rules={{ required: "Le nom de l'entreprise est requis" }}
            render={({ field }) => (
              <FormField
                id="company"
                label="Nom de l'entreprise"
                value={field.value}
                onChange={field.onChange}
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
              required: "L'email est requis",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Adresse email invalide",
              },
            }}
            render={({ field }) => (
              <FormField
                id="email"
                type="email"
                label="Adresse email"
                value={field.value}
                onChange={field.onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            rules={{ required: "Le téléphone est requis" }}
            render={({ field }) => (
              <FormField
                id="phone"
                label="Téléphone"
                value={field.value}
                onChange={field.onChange}
                error={errors.phone?.message}
              />
            )}
          />
        </div>
      </FormSection>

      <FormSection title="Adresse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="address"
            control={control}
            rules={{ required: "L'adresse est requise" }}
            render={({ field }) => (
              <FormField
                id="address"
                label="Adresse"
                value={field.value}
                onChange={field.onChange}
                error={errors.address?.message}
              />
            )}
          />

          <Controller
            name="city"
            control={control}
            rules={{ required: "La ville est requise" }}
            render={({ field }) => (
              <FormField
                id="city"
                label="Ville"
                value={field.value}
                onChange={field.onChange}
                error={errors.city?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="country"
            control={control}
            rules={{ required: "Le pays est requis" }}
            render={({ field }) => (
              <CountrySelect
                id="country"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                error={errors.country?.message}
              />
            )}
          />
        </div>

        {/* Conditional fields for company - Now inside Address section */}
        {typeClientValue === "company" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {paysValue === "Maroc" ? (
              <>
                <Controller
                  name="ice"
                  control={control}
                  rules={{ required: "L'ICE est requis" }}
                  render={({ field }) => (
                    <FormField
                      id="ice"
                      label="ICE"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.ice?.message}
                    />
                  )}
                />

                <Controller
                  name="vat"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      id="vat"
                      label="TVA"
                      value={field.value || "20%"}
                      disabled
                      readOnly
                    />
                  )}
                />

                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <CurrencySelect
                      value={field.value || "MAD"}
                      disabled
                      readOnly
                    />
                  )}
                />
              </>
            ) : (
              <>
                <Controller
                  name="siren"
                  control={control}
                  rules={{ required: "Le SIREN est requis" }}
                  render={({ field }) => (
                    <FormField
                      id="siren"
                      label="SIREN"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.siren?.message}
                    />
                  )}
                />

                <Controller
                  name="currency"
                  control={control}
                  rules={{ required: "La devise est requise" }}
                  render={({ field }) => (
                    <CurrencySelect
                      value={field.value || data?.client.country}
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

      <div className="flex justify-end gap-4 pt-4 ">
        <Button
          type="button"
          onClick={handleCancel}
          variant="outline"
          className="w-full md:w-auto"
          disabled={submitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Mise à jour..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
}
