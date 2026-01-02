import React from "react";
import { Controller } from "react-hook-form";
import FileUploader from "@/components/Form/FileUploader";

export function BrandingAssetsSection({ control }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-semibold text-lg mb-4">Branding & Assets</h2>
        <p className="text-sm text-muted-foreground">
          Upload your company logos, signatures, and stamps for use across
          documents.
        </p>
      </div>

      <div className="space-y-2">
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

      <div className="space-y-2">
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

      <div className="space-y-2">
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

      <div className="space-y-2">
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
  );
}
