import React from "react";
import { Controller } from "react-hook-form";
import FormField from "@/components/Form/FormField";
import TextareaField from "@/components/Form/TextareaField";
import FormSection from "@/components/Form/FormSection";

export function CompanyBasicsSection({ control, errors }) {
  return (
    <form className="flex flex-col gap-4">
      <h1 className="font-semibold text-lg">Company Basics</h1>
      <div className="space-y-2">
        <Controller
          name="company_name"
          control={control}
          render={({ field }) => (
            <FormField
              type="text"
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              label="Company Name"
              id="company_name"
              placeholder="Company name"
              error={errors.company_name?.message}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Controller
          name="tagline"
          control={control}
          render={({ field }) => (
            <FormField
              type="text"
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              label="Tagline"
              id="tagline"
              placeholder="Tagline"
              error={errors.tagline?.message}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextareaField
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              label="Description"
              id="description"
              placeholder="Description"
              error={errors.description?.message}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Controller
          name="terms_conditions"
          control={control}
          render={({ field }) => (
            <TextareaField
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              label="Terms And Conditions"
              id="terms_conditions"
              placeholder="Terms And Conditions"
              error={errors.terms_conditions?.message}
            />
          )}
        />
      </div>
    </form>
  );
}
