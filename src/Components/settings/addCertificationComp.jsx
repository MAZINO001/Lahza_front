"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  useCertifications,
  useCreateCertification,
  useUpdateCertification,
} from "../../features/settings/hooks/useSettingsAgencyInfoQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import FormField from "@/components/Form/FormField";
import TextareaField from "@/components/Form/TextareaField";
import FileUploader from "@/components/Form/FileUploader";
import SelectField from "@/components/Form/SelectField";
import { StatusBadge } from "@/components/StatusBadge";
export default function AddCertificationComp() {
  const createCertification = useCreateCertification();
  const updateCertification = useUpdateCertification();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      source_type: "",
      file_path: "",
      url: "",
      preview_image: null,
      issued_by: "",
      issued_at: "",
      expires_at: "",
      status: "",
    },
  });

  const handleCreate = (data) => {
    createCertification.mutate(data);
    reset();
  };

  return (
    <div>
      <Card className="p-0 gap-0">
        <CardHeader className="p-4">
          <CardTitle>Add New Certification</CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <div className="space-y-4">
            <div className="flex gap-4 w-full">
              <div className="space-y-2 w-1/2">
                <Controller
                  name="preview_image"
                  control={control}
                  render={({ field }) => (
                    <FileUploader
                      {...field}
                      label="Preview Image"
                      id="preview_image"
                      accept="image/*"
                    />
                  )}
                />
              </div>
              <div className="space-y-2 w-1/2">
                <Controller
                  name="file_path"
                  control={control}
                  render={({ field }) => (
                    <FileUploader
                      {...field}
                      label="Certificate File"
                      id="file_path"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  )}
                />
              </div>
            </div>
            <div>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: "Certification name is required",
                }}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="text"
                    label="Certification Name"
                    id="title"
                    placeholder="e.g., PMP, AWS Certified"
                    error={errors.title?.message}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="expires_at"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      {...field}
                      type="date"
                      label="Expiry Date (Optional)"
                      id="expires_at"
                      error={errors.expires_at?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="issued_at"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      {...field}
                      type="date"
                      label="Issuing Date"
                      id="issued_at"
                      error={errors.issued_at?.message}
                    />
                  )}
                />
              </div>
            </div>
            <div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextareaField
                    {...field}
                    label="Description"
                    id="description"
                    placeholder="Brief description of the certification"
                    error={errors.description?.message}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="issued_by"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      {...field}
                      type="text"
                      label="Issued By"
                      id="issued_by"
                      placeholder="e.g., Project Management Institute"
                      error={errors.issued_by?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="source_type"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      {...field}
                      label="Source Type"
                      id="source_type"
                      placeholder="Select source type"
                      options={[
                        { value: "file", label: "File" },
                        { value: "url", label: "URL" },
                      ]}
                      error={errors.source_type?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="url"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      {...field}
                      type="url"
                      label="Certificate URL"
                      id="url"
                      placeholder="https://example.com/certificate"
                      error={errors.url?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      {...field}
                      label="Status"
                      id="status"
                      placeholder="Select status"
                      options={[
                        { value: "active", label: "Active" },
                        { value: "expired", label: "Expired" },
                        { value: "pending", label: "Pending" },
                        { value: "revoked", label: "Revoked" },
                      ]}
                      error={errors.status?.message}
                    />
                  )}
                />
              </div>
            </div>
            <Button
              type="button"
              className="float-right mb-4"
              disabled={createCertification.isPending}
              onClick={handleSubmit(handleCreate)}
            >
              {createCertification.isPending
                ? "Creating..."
                : "Add Certification"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
