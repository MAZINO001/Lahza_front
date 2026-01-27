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
import api from "@/lib/utils/axios";

export function AdditionalDataForm({ onSuccess, projectId }) {
  const navigate = useNavigate();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const { data: additionalData, isLoading } = useAdditionalData(projectId);
  const [initialFilesLoading, setInitialFilesLoading] = useState(false);

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

  const normalizeExistingFiles = async (result) => {
    if (!result) return [];

    const list = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.files)
          ? result.files
          : [];

    const filePromises = list.map(async (item, index) => {
      const path = item?.path ?? "";
      const name =
        item?.name ??
        item?.original_name ??
        item?.filename ??
        item?.file_name ??
        (path ? String(path).split("/").pop() : "") ??
        "";
      const size = Number(item?.size ?? item?.file_size ?? item?.bytes ?? 0);
      const type = item?.type ?? item?.mime_type ?? item?.mimetype ?? "";
      const id =
        item?.id ?? item?.uuid ?? item?.file_id ?? `${name || "file"}-${index}`;

      if (!path || !name) return null;

      try {
        const fileUrl = `${API_URL}/storage/${path}`;

        const response = await api.get(fileUrl, {
          responseType: "blob",
        });

        const file = new File([response.data], name, {
          type: response.data.type || type,
        });

        return {
          id: String(id),
          path,
          name,
          size: size || response.data.size,
          type: type || response.data.type,
          file: file, // Store the actual File object
        };
      } catch (error) {
        console.error(`Failed to fetch file ${name}:`, error);
        return null;
      }
    });

    const files = await Promise.all(filePromises);
    return files.filter((f) => f && f.name);
  };

  // State to hold initial files
  const [initialLogoFiles, setInitialLogoFiles] = useState([]);
  const [initialMediaFiles, setInitialMediaFiles] = useState([]);
  const [initialOtherFiles, setInitialOtherFiles] = useState([]);
  const [initialSpecificFiles, setInitialSpecificFiles] = useState([]);

  // Load initial files when data is available
  useEffect(() => {
    const loadInitialFiles = async () => {
      if (isEditMode && !filesLoading) {
        setInitialFilesLoading(true);
        try {
          const [logo, media, other, specific] = await Promise.all([
            normalizeExistingFiles(logoFiles),
            normalizeExistingFiles(mediaFiles),
            normalizeExistingFiles(otherFiles),
            normalizeExistingFiles(specificFiles),
          ]);

          setInitialLogoFiles(logo);
          setInitialMediaFiles(media);
          setInitialOtherFiles(other);
          setInitialSpecificFiles(specific);
        } catch (error) {
          console.error("Error loading initial files:", error);
        } finally {
          setInitialFilesLoading(false);
        }
      }
    };

    loadInitialFiles();
  }, [
    isEditMode,
    filesLoading,
    logoFiles,
    mediaFiles,
    otherFiles,
    specificFiles,
  ]);

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

    // Since we're now working with actual File objects, we can send them directly
    const mediaFiles = toArray(data.media_files);
    const specFiles = toArray(data.specification_file);
    const logoFiles = toArray(data.logo);
    const otherFiles = toArray(data.other);

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
      media_files: mediaFiles,
      specification_file: specFiles,
      logo: logoFiles,
      other: otherFiles,
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
                initialFiles={initialMediaFiles.map((f) => f.file)}
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
                initialFiles={initialSpecificFiles.map((f) => f.file)}
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
                initialFiles={initialLogoFiles.map((f) => f.file)}
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
                initialFiles={initialOtherFiles.map((f) => f.file)}
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
