// src/features/additional_data/components/AdditionalDataForm.jsx
import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/components/Form/FormField";
import FileUploader from "@/components/Form/FileUploader";

import {
  useCreateAdditionalData,
  useUpdateAdditionalData,
} from "@/features/additional_data/hooks/useAdditionalDataQuery";
import { Minus, Plus } from "lucide-react";

export function AdditionalDataForm({
  additionalData,
  onSuccess,
  projectId,
  clientID,
}) {
  const navigate = useNavigate();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const createMutation = useCreateAdditionalData();
  const updateMutation = useUpdateAdditionalData();
  const mutation = additionalData?.id ? updateMutation : createMutation;
  const isEditMode = !!additionalData?.id;
  console.log(additionalData);
  // Helper function to parse JSON safely
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
            media_files: additionalData.media_files || "",
            specification_file: additionalData.specification_file || "",
            logo: additionalData.logo || "",
            other: additionalData.other || "",
          };
        })()
      : {
          project_id: projectId,
          client_id: clientID,
          host_acc_email: "",
          host_acc_password: "",
          website_acc_email: "",
          website_acc_password: "",
          social_media: [{ link: "", email: "", password: "" }],
          media_files: "",
          specification_file: "",
          logo: "",
          other: "",
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "social_media",
  });

  const onSubmit = (data) => {
    if (isSubmitting || !startSubmit()) return;

    const payload = {
      project_id: Number(data.project_id),
      client_id: Number(data.client_id),
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
        }))
      ),
      media_files: data.media_files,
      specification_file: data.specification_file,
      logo: data.logo,
      other: data.other,
    };

    console.log("payload", payload);

    mutation.mutate(
      isEditMode ? { id: additionalData.id, data: payload } : payload,
      {
        onSuccess: () => {
          onSuccess?.();

          if (isEditMode) {
            const hostAcc = parseJSON(additionalData.host_acc, {});
            const websiteAcc = parseJSON(additionalData.website_acc, {});
            const socialMedia = parseJSON(additionalData.social_media, []);

            reset({
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
              media_files: additionalData.media_files || "",
              specification_file: additionalData.specification_file || "",
              logo: additionalData.logo || "",
              other: additionalData.other || "",
            });
          }
        },
        onSettled: () => endSubmit(),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
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
                    placeholder="Enter password..."
                    className="w-full"
                    {...field}
                  />
                )}
              />
            </div>

            <button
              type="button"
              className="p-2 rounded bg-red-500 text-white"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded bg-black text-white"
              onClick={() => append({ link: "", email: "", password: "" })}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="media_files"
          control={control}
          render={({ field }) => (
            <FileUploader
              label="Media Files"
              placeholder="Media files path or URL"
              error={errors.media_files?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="specification_file"
          control={control}
          render={({ field }) => (
            <FileUploader
              label="Specification File"
              placeholder="Specification file path or URL"
              error={errors.specification_file?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="logo"
          control={control}
          render={({ field }) => (
            <FileUploader
              label="Logo"
              placeholder="Logo file path or URL"
              error={errors.logo?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="other"
          control={control}
          render={({ field }) => (
            <FileUploader
              label="Other Files"
              placeholder="Other information"
              error={errors.other?.message}
              {...field}
            />
          )}
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
