import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/components/Form/FormField";
import FileUploader from "@/components/Form/FileUploader";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL;
import {
  useAdditionalData,
  useCreateAdditionalData,
  useUpdateAdditionalData,
} from "@/features/additional_data/hooks/useAdditionalDataQuery";
import { Minus, Plus } from "lucide-react";
import { useMultipleFileSearch } from "../hooks/multipeSearchHook";

export function AdditionalDataForm({ onSuccess, projectId }) {
  const navigate = useNavigate();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const { data: additionalData, isLoading } = useAdditionalData(projectId);

  const {
    logoFiles,
    mediaFiles,
    otherFiles,
    specificFiles,
    isLoading: filesLoading,
  } = useMultipleFileSearch(
    "App\\Models\\ProjectAdditionalData",
    additionalData?.id,
  );

  const createMutation = useCreateAdditionalData();
  const updateMutation = useUpdateAdditionalData();
  const mutation = additionalData?.id ? updateMutation : createMutation;
  const isEditMode = !!additionalData?.id;

  const normalizeExistingFiles = (result) => {
    if (!result) return [];

    const list = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.files)
          ? result.files
          : [];

    return list
      .map((item, index) => {
        const url =
          item?.url ??
          item?.path ??
          item?.file_url ??
          item?.full_url ??
          item?.download_url ??
          item?.link ??
          "";
        const name =
          item?.name ??
          item?.original_name ??
          item?.filename ??
          item?.file_name ??
          (url ? String(url).split("/").pop() : "") ??
          "";
        const size = Number(item?.size ?? item?.file_size ?? item?.bytes ?? 0);
        const type = item?.type ?? item?.mime_type ?? item?.mimetype ?? "";
        const id =
          item?.id ??
          item?.uuid ??
          item?.file_id ??
          `${name || "file"}-${index}`;

        return {
          id: String(id),
          url,
          name,
          size,
          type,
        };
      })
      .filter((f) => f.name || f.url);
  };

  const initialLogoFiles = isEditMode ? normalizeExistingFiles(logoFiles) : [];
  const initialMediaFiles = isEditMode
    ? normalizeExistingFiles(mediaFiles)
    : [];
  const initialOtherFiles = isEditMode
    ? normalizeExistingFiles(otherFiles)
    : [];
  const initialSpecificFiles = isEditMode
    ? normalizeExistingFiles(specificFiles)
    : [];

  const parseJSON = (str, fallback) => {
    try {
      return str ? JSON.parse(str) : fallback;
    } catch {
      return fallback;
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: additionalData
      ? (() => {
          const hostAcc = parseJSON(additionalData.host_acc, {});
          const websiteAcc = parseJSON(additionalData.website_acc, {});
          const socialMedia = parseJSON(additionalData.social_media, []);

          return {
            project_id: additionalData.project_id,
            client_id: additionalData.client_id,
            host_acc_email: hostAcc.email || "",
            host_acc_password: hostAcc.password || "",
            website_acc_email: websiteAcc.email || "",
            website_acc_password: websiteAcc.password || "",
            social_media:
              socialMedia.length > 0
                ? socialMedia
                : [{ link: "", email: "", password: "" }],
            media_files: additionalData.media_files || null,
            specification_file: additionalData.specification_file || null,
            logo: additionalData.logo || null,
            other: additionalData.other || null,
          };
        })()
      : {
          project_id: projectId,
          client_id: 2,
          host_acc_email: "",
          host_acc_password: "",
          website_acc_email: "",
          website_acc_password: "",
          social_media: [{ link: "", email: "", password: "" }],
          media_files: null,
          specification_file: null,
          logo: null,
          other: null,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "social_media",
  });

  const onSubmit = (data) => {
    if (isSubmitting || !startSubmit()) return;

    const toArray = (value) => {
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    };

    const splitFiles = (value, cachedFiles) => {
      const items = toArray(value);
      const uploads = items.filter((f) => f instanceof File);

      // Get existing files from cache and convert them back to File objects
      const existingFileIds = items
        .filter((f) => !(f instanceof File))
        .map((f) => f.id ?? f.uuid ?? f.file_id)
        .filter(Boolean);

      const existingFiles =
        cachedFiles?.filter((file) =>
          existingFileIds.includes(
            file.id?.toString() ||
              file.uuid?.toString() ||
              file.file_id?.toString(),
          ),
        ) || [];

      return { uploads, existing: existingFiles };
    };

    const mediaSplit = splitFiles(data.media_files, mediaFiles);
    const specSplit = splitFiles(data.specification_file, specificFiles);
    const logoSplit = splitFiles(data.logo, logoFiles);
    const otherSplit = splitFiles(data.other, otherFiles);

    const payload = {
      project_id: Number(data.project_id),
      host_acc: JSON.stringify({
        email: data.host_acc_email,
        password: data.host_acc_password,
      }),
      website_acc: JSON.stringify({
        email: data.website_acc_email,
        password: data.website_acc_password,
      }),
      social_media: JSON.stringify(
        data.social_media.map((sm) => ({
          link: sm.link,
          email: sm.email,
          password: sm.password,
        })),
      ),
      // For create: send all files (new ones)
      // For update: only send new File objects, backend handles deletion of unselected files
      media_files: isEditMode
        ? mediaSplit.uploads
        : [...mediaSplit.uploads, ...mediaSplit.existing],
      specification_file: isEditMode
        ? specSplit.uploads
        : [...specSplit.uploads, ...specSplit.existing],
      logo: isEditMode
        ? logoSplit.uploads
        : [...logoSplit.uploads, ...logoSplit.existing],
      other: isEditMode
        ? otherSplit.uploads
        : [...otherSplit.uploads, ...otherSplit.existing],
    };

    console.log("Submitting payload:", payload);

    if (isEditMode) {
      updateMutation.mutate(
        { id: additionalData.id, data: payload },
        {
          onSuccess: () => {
            console.log("Update successful");
            onSuccess?.();
            endSubmit();
          },
          onError: (error) => {
            console.error("Update error:", error);
            endSubmit();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          console.log("Create successful");
          onSuccess?.();
          reset();
          endSubmit();
        },
        onError: (error) => {
          console.error("Create error:", error);
          endSubmit();
        },
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 p-4 min-h-screen">
      <div className="flex w-full gap-4">
        <div className="w-[50%]">
          <Controller
            name="host_acc_email"
            control={control}
            render={({ field }) => (
              <FormField
                label="Host Account Email"
                placeholder="Enter host email..."
                error={errors.host_acc_email?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className="w-[50%]">
          <Controller
            name="host_acc_password"
            control={control}
            render={({ field }) => (
              <FormField
                label="Host Account Password"
                type="password"
                placeholder="Enter host password..."
                error={errors.host_acc_password?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="w-[50%]">
          <Controller
            name="website_acc_email"
            control={control}
            render={({ field }) => (
              <FormField
                label="Website Account Email"
                placeholder="Enter website email..."
                error={errors.website_acc_email?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className="w-[50%]">
          <Controller
            name="website_acc_password"
            control={control}
            render={({ field }) => (
              <FormField
                label="Website Account Password"
                type="password"
                placeholder="Enter website password..."
                error={errors.website_acc_password?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {fields.map((item, index) => (
          <div key={item.id} className="flex w-full gap-4 items-end">
            <div className="w-1/3">
              <Controller
                name={`social_media.${index}.link`}
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Social Media Link"
                    placeholder="Enter link..."
                    className="w-full"
                    {...field}
                  />
                )}
              />
            </div>

            <div className="w-1/3">
              <Controller
                name={`social_media.${index}.email`}
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Email"
                    placeholder="Enter email..."
                    className="w-full"
                    {...field}
                  />
                )}
              />
            </div>

            <div className="w-1/3">
              <Controller
                name={`social_media.${index}.password`}
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Password"
                    type="password"
                    placeholder="Enter password..."
                    className="w-full"
                    {...field}
                  />
                )}
              />
            </div>

            <Button
              type="button"
              className="p-2"
              onClick={() => fields.length > 1 && remove(index)}
              disabled={fields.length === 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              className="p-2"
              onClick={() => append({ link: "", email: "", password: "" })}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="media_files"
          control={control}
          render={({ field }) =>
            filesLoading ? (
              <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  Loading media files...
                </span>
              </div>
            ) : (
              <FileUploader
                key={`media_files-${initialMediaFiles.map((f) => f.id).join("-")}`}
                label="Media Files"
                name="Media Files"
                error={errors.media_files?.message}
                initialFiles={initialMediaFiles}
                {...field}
              />
            )
          }
        />

        <Controller
          name="specification_file"
          control={control}
          render={({ field }) =>
            filesLoading ? (
              <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  Loading specification files...
                </span>
              </div>
            ) : (
              <FileUploader
                key={`specification_file-${initialSpecificFiles.map((f) => f.id).join("-")}`}
                label="Specification File"
                name="Specification File"
                error={errors.specification_file?.message}
                initialFiles={initialSpecificFiles}
                {...field}
              />
            )
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="logo"
          control={control}
          render={({ field }) =>
            filesLoading ? (
              <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  Loading logo files...
                </span>
              </div>
            ) : (
              <FileUploader
                key={`logo-${initialLogoFiles.map((f) => f.id).join("-")}`}
                label="Logo"
                name="Logo"
                error={errors.logo?.message}
                initialFiles={initialLogoFiles}
                {...field}
              />
            )
          }
        />

        <Controller
          name="other"
          control={control}
          render={({ field }) =>
            filesLoading ? (
              <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  Loading other files...
                </span>
              </div>
            ) : (
              <FileUploader
                key={`other-${initialOtherFiles.map((f) => f.id).join("-")}`}
                label="Other Files"
                name="Other Files"
                error={errors.other?.message}
                initialFiles={initialOtherFiles}
                {...field}
              />
            )
          }
        />
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : isEditMode
              ? "Update Additional Data"
              : "Create Additional Data"}
        </Button>
      </div>
    </form>
  );
}
