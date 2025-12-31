import React from "react";
import { Controller } from "react-hook-form";
import FormField from "@/components/Form/FormField";
import TextareaField from "@/components/Form/TextareaField";
import FileUpLoader from "@/components/Form/FileUploader";

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

      <div className="space-y-2">
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

      <div className="space-y-2">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextareaField
              {...field}
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
              {...field}
              label="Terms And Conditions"
              id="terms_conditions"
              placeholder="Terms And Conditions"
              error={errors.terms_conditions?.message}
            />
          )}
        />
      </div>

      <h3 className="text-lg font-semibold">Certifications</h3>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-stretch">
          {/* File uploader */}
          <div className="space-y-2 w-full">
            <Controller
              name="preview_image"
              control={control}
              render={({ field }) => (
                <FileUpLoader
                  label="Certification Image"
                  name="Attach File"
                  error={errors.preview_image?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Description textarea */}
          <div className="space-y-2 w-full">
            <Controller
              name="certification_description"
              control={control}
              render={({ field }) => (
                <TextareaField
                  {...field}
                  label="Certification Description"
                  id="certification_description"
                  placeholder="Brief description about the certification"
                  error={errors.certification_description?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="space-y-2 w-full">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="text"
                  label="Certification Title"
                  id="title"
                  placeholder="e.g. AWS Certified Developer"
                  error={errors.title?.message}
                />
              )}
            />
          </div>
          <div className="space-y-2 w-full">
            <Controller
              name="url"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="url"
                  label="Certification Link"
                  id="url"
                  placeholder="https://example.com/certificate"
                  error={errors.url?.message}
                />
              )}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
