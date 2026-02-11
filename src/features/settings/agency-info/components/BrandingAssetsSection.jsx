import React from "react";
import { Controller } from "react-hook-form";
import FileUploader from "@/components/Form/FileUploader";
import { useDocumentFileAttachments } from "@/features/documents/hooks/useattachFiles";

export function BrandingAssetsSection({ control }) {
  // Use attachments API to manage agency-related files via /attachments & /attachments/manage
  const { originalFiles, handleAttachmentChange } = useDocumentFileAttachments(
    null,
    "agency_related",
  );
  return (
    <div className="flex flex-col">
      <div className="space-y-0.5 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Branding & Assets
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your company logos, signatures and branding assets
        </p>
      </div>

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
      <div className="space-y-2 mt-4">
        <Controller
          name="new_files"
          control={control}
          render={({ field }) => (
            <FileUploader
              key={
                originalFiles?.map((f) => f.id).join("_") ||
                "no-agency-attachments"
              }
              {...field}
              name="new_files"
              label="Company Related Files"
              id="new_files"
              description="Your company related files that will be sent with quotes and invoices"
              initialFiles={originalFiles}
              onChange={(files) => {
                field.onChange(files);
                handleAttachmentChange(files);
              }}
            />
          )}
        />
      </div>
    </div>
  );
}
