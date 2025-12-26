// BrandingAssetsSection.jsx
import React from "react";
import { Controller } from "react-hook-form";
import FormField from "@/components/Form/FormField";
import FormSection from "@/components/Form/FormSection";

export function BrandingAssetsSection({ control }) {
  return (
    <form className="flex flex-col gap-4">
      <h1 className="font-semibold text-lg">Branding & Assets</h1>
      <div className="space-y-2">
        <Controller
          name="logo_path"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="file"
              label="Logo"
              id="logo_path"
              accept="image/*"
              onChange={(e) => field.onChange(e.target.files?.[0] || null)}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Controller
          name="logo_dark_path"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="file"
              label="Logo Dark"
              id="logo_dark_path"
              accept="image/*"
              onChange={(e) => field.onChange(e.target.files?.[0] || null)}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Controller
          name="signature_path"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="file"
              label="Signature"
              id="signature_path"
              accept="image/*"
              onChange={(e) => field.onChange(e.target.files?.[0] || null)}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Controller
          name="stamp_path"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="file"
              label="Stamp"
              id="stamp_path"
              accept="image/*"
              onChange={(e) => field.onChange(e.target.files?.[0] || null)}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Controller
          name="agency_contract"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="file"
              label="Agency Contract"
              id="agency_contract"
              accept="*"
              onChange={(e) => field.onChange(e.target.files[0])}
            />
          )}
        />
      </div>
    </form>
  );
}
