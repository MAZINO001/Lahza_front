import React from "react";
import { useForm, Controller } from "react-hook-form";
import FormField from "@/components/Form/FormField";
import TextareaField from "@/components/Form/TextareaField";
import { Button } from "@/components/ui/button";
import FormSection from "@/components/Form/FormSection";

export default function AgencyInfo() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_name: "",
      tagline: "",
      description: "",

      logo_path: null,
      logo_dark_path: null,
      signature_path: null,
      stamp_path: null,

      email: "",
      phone: "",
      phone2: "",
      website: "",

      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",

      ma_ice: "",
      ma_if: "",
      ma_cnss: "",
      ma_rc: "",
      ma_vat: "",

      fr_siret: "",
      fr_vat: "",

      bank_name: "",
      rib: "",
      account_name: "",
    },
  });

  const onSubmit = (values) => {
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
      }
    });

    console.log("READY TO SEND", [...data.entries()]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full gap-4 ">
      <div className="w-[50%]">
        {/* <FormSection title="Notifications Preferences"> */}
        <FormSection>
          <Controller
            name="company_name"
            control={control}
            rules={{ required: "Company name is required" }}
            render={({ field }) => (
              <FormField
                label="Company Name"
                placeholder="Company name"
                error={errors.company_name?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="tagline"
            control={control}
            render={({ field }) => (
              <FormField label="Tagline" placeholder="Tagline" {...field} />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextareaField
                label="Description"
                placeholder="Description"
                {...field}
              />
            )}
          />
        </FormSection>

        <FormSection>
          {" "}
          <Controller
            name="logo_path"
            control={control}
            render={({ field }) => (
              <FormField
                type="file"
                label="Logo"
                accept="image/*"
                onChange={(e) => field.onChange(e.target.files[0])}
              />
            )}
          />
          <Controller
            name="logo_dark_path"
            control={control}
            render={({ field }) => (
              <FormField
                type="file"
                label="Logo Dark"
                accept="image/*"
                onChange={(e) => field.onChange(e.target.files[0])}
              />
            )}
          />
          <Controller
            name="signature_path"
            control={control}
            render={({ field }) => (
              <FormField
                type="file"
                label="Signature"
                accept="image/*"
                onChange={(e) => field.onChange(e.target.files[0])}
              />
            )}
          />
          <Controller
            name="stamp_path"
            control={control}
            render={({ field }) => (
              <FormField
                type="file"
                label="stamp"
                accept="image/*"
                onChange={(e) => field.onChange(e.target.files[0])}
              />
            )}
          />
        </FormSection>

        <FormSection>
          {" "}
          <Controller
            name="email"
            control={control}
            rules={{
              pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
            }}
            render={({ field }) => (
              <FormField
                type="email"
                label="Email"
                error={errors.email?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            rules={{
              pattern: { value: /^\S+@\S+$/, message: "Invalid phone" },
            }}
            render={({ field }) => (
              <FormField
                type="phone"
                label="phone"
                error={errors.phone?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="phone2"
            control={control}
            rules={{
              pattern: { value: /^\S+@\S+$/, message: "Invalid phone" },
            }}
            render={({ field }) => (
              <FormField
                type="phone2"
                label="phone 2"
                error={errors.phone2?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="website"
            control={control}
            rules={{
              pattern: { value: /^\S+@\S+$/, message: "Invalid website" },
            }}
            render={({ field }) => (
              <FormField
                type="website"
                label="website"
                error={errors.website?.message}
                {...field}
              />
            )}
          />
        </FormSection>
      </div>
      <div className="w-[50%]">
        <FormSection>
          <Controller
            name="address_line1"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="address_line1"
                label="address_line1"
                error={errors.address_line1?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="address_line2"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="address_line2"
                label="address_line2"
                error={errors.address_line2?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="city"
                label="city"
                error={errors.city?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="state"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="state"
                label="state"
                error={errors.state?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="country"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="country"
                label="country"
                error={errors.country?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="postal_code"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="postal_code"
                label="postal_code"
                error={errors.postal_code?.message}
                {...field}
              />
            )}
          />
        </FormSection>

        <FormSection>
          <Controller
            name="ma_ice"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="ma_ice"
                label="ma_ice"
                error={errors.ma_ice?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="ma_if"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="ma_if"
                label="ma_if"
                error={errors.ma_if?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="ma_cnss"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="ma_cnss"
                label="ma_cnss"
                error={errors.ma_cnss?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="ma_rc"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="ma_rc"
                label="ma_rc"
                error={errors.ma_rc?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="mr_vat"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="mr_vat"
                label="mr_vat"
                error={errors.mr_vat?.message}
                {...field}
              />
            )}
          />
        </FormSection>

        <FormSection>
          <Controller
            name="fr_siren"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="fr_siren"
                label="fr_siren"
                error={errors.fr_siren?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="fr_vat"
            control={control}
            rules={{}}
            render={({ field }) => (
              <FormField
                type="fr_vat"
                label="fr_vat"
                error={errors.fr_vat?.message}
                {...field}
              />
            )}
          />
        </FormSection>

        <FormSection>
          <Controller
            name="bank_name"
            control={control}
            rules={{ required: "Bank name is required" }}
            render={({ field }) => (
              <FormField
                label="Bank Name"
                error={errors.bank_name?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="rib"
            control={control}
            rules={{
              required: "RIB is required",
              maxLength: { value: 24, message: "Max 24 characters" },
            }}
            render={({ field }) => (
              <FormField label="RIB" error={errors.rib?.message} {...field} />
            )}
          />
          <Controller
            name="account_name"
            control={control}
            rules={{
              required: "account_name is required",
              maxLength: { value: 24, message: "Max 24 characters" },
            }}
            render={({ field }) => (
              <FormField
                label="Account Name"
                error={errors.account_name?.message}
                {...field}
              />
            )}
          />
        </FormSection>
      </div>
    </form>
  );
}
