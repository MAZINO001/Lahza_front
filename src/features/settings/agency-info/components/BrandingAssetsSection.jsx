import React from "react";
import { Controller } from "react-hook-form";
import FileUploader from "@/components/Form/FileUploader";

export function BrandingAssetsSection({ control }) {
  return (
    <div className="flex flex-col">
      <h1 className="font-semibold text-lg mb-6">Branding & Assets</h1>

      <div className="w-full flex gap-4 mb-4">
        <div className="space-y-2 w-[50%]">
          <Controller
            name="logo_path"
            control={control}
            render={({ field }) => (
              <FileUploader
                {...field}
                label="Logo"
                id="logo_path"
                accept="image/*"
                description="Your primary company logo (light version)"
              />
            )}
          />
        </div>

        <div className="space-y-2 w-[50%]">
          <Controller
            name="logo_dark_path"
            control={control}
            render={({ field }) => (
              <FileUploader
                {...field}
                label="Logo Dark"
                id="logo_dark_path"
                accept="image/*"
                description="Your company logo for dark backgrounds"
              />
            )}
          />
        </div>
      </div>
      <div className="w-full flex gap-4">
        <div className="space-y-2 w-[50%]">
          <Controller
            name="signature_path"
            control={control}
            render={({ field }) => (
              <FileUploader
                {...field}
                label="Signature"
                id="signature_path"
                accept="image/*"
                description="Digital signature image for documents"
              />
            )}
          />
        </div>

        <div className="space-y-2 w-[50%]">
          <Controller
            name="stamp_path"
            control={control}
            render={({ field }) => (
              <FileUploader
                {...field}
                label="Stamp"
                id="stamp_path"
                accept="image/*"
                description="Company stamp or seal image"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
