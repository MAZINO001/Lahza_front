import React from "react";
import { Controller } from "react-hook-form";
import FormField from "@/components/Form/FormField";
import TextareaField from "@/components/Form/TextareaField";

export function CompanyBasicsSection({ control, errors }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-0.5 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Company Basics
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your basic company information and details
        </p>
      </div>

      <div className=" flex gap-4">
        <div className="space-y-2 w-[50%]">
          <Controller
            name="company_name"
            rules={{ required: "Company name is required" }}
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                type="text"
                label="Company Name"
                id="company_name"
                placeholder="Company name"
                error={errors.company_name?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2 w-[50%]">
          <Controller
            name="tagline"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                type="text"
                label="Tagline"
                id="tagline"
                placeholder="Tagline"
                error={errors.tagline?.message}
              />
            )}
          />
        </div>
      </div>
      <div className="flex gap-4 w-full h-full">
        <div className="w-[50%] flex flex-col min-h-0">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextareaField
                {...field}
                label="Description"
                id="description"
                className="flex-1 flex flex-col"
                placeholder="Description"
                error={errors.description?.message}
              />
            )}
          />
        </div>

        <div className="w-[50%] flex flex-col min-h-0">
          <Controller
            name="terms_and_conditions"
            control={control}
            render={({ field }) => (
              <TextareaField
                label="Terms And Conditions"
                id="terms_and_conditions"
                className="flex-1 flex flex-col"
                placeholder="Terms And Conditions"
                error={errors.terms_and_conditions?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
