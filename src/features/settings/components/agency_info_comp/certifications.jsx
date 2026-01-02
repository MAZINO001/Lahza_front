/* eslint-disable no-unused-vars */
"use client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  useCertifications,
  useCreateCertification,
  useUpdateCertification,
  useDeleteCertification,
} from "../../hooks/useSettingsQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import FormField from "@/components/Form/FormField";
import TextareaField from "@/components/Form/TextareaField";
import FileUploader from "@/components/Form/FileUploader";
import SelectField from "@/components/Form/SelectField";
import { StatusBadge } from "@/components/StatusBadge";

export default function CertificationsSection() {
  const { data: certifications, isLoading, error } = useCertifications();
  const createCertification = useCreateCertification();
  const updateCertification = useUpdateCertification();
  const deleteCertification = useDeleteCertification();

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
      preview_image: "null",
      issued_by: "",
      issued_at: "",
      expires_at: "",
      status: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  React.useEffect(() => {
    if (certifications) {
      reset({ certifications: certifications });
    }
  }, [certifications, reset]);

  if (isLoading) {
    return <div>Loading certifications...</div>;
  }

  if (error) {
    return <div>Error loading certifications</div>;
  }

  const handleCreate = (data) => {
    createCertification.mutate(data);
    reset();
  };

  const handleDelete = (id) => {
    deleteCertification.mutate(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg">Certifications</h1>
      </div>

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

      <div className="space-y-4">
        <div className="grid gap-4">
          {certifications?.map((cert) => (
            <Card key={cert.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{cert.title}</h3>
                      <StatusBadge status={cert.status} />
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {cert.description}
                    </p>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Issued by: {cert.issued_by}</p>
                      <p>
                        Issued: {new Date(cert.issued_at).toLocaleDateString()}
                      </p>
                      {cert.expires_at && (
                        <p>
                          Expires:{" "}
                          {new Date(cert.expires_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                      >
                        View Certificate
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(cert.id)}
                      disabled={deleteCertification.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {certifications?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border rounded-lg">
              No certifications found. Add your first certification above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
