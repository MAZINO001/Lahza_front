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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2 } from "lucide-react";
import FormField from "@/components/Form/FormField";
import TextareaField from "@/components/Form/TextareaField";

export default function CertificationsSection({ control, errors }) {
  const { data: certifications, isLoading, error } = useCertifications();
  const createCertification = useCreateCertification();
  const updateCertification = useUpdateCertification();
  const deleteCertification = useDeleteCertification();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm();

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

  const handleUpdate = (id, data) => {
    updateCertification.mutate({
      id: id,
      data: data,
    });
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      {...field}
                      type="text"
                      label="Certification Name"
                      id="name"
                      placeholder="e.g., PMP, AWS Certified"
                      error={errors.name?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="issued_date"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      {...field}
                      type="text"
                      label="Issuing date"
                      id="issued_date"
                      placeholder="e.g., Project Management Institute"
                      error={errors.issued_date?.message}
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
                  name="expiry_date"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      {...field}
                      type="date"
                      label="Expiry Date (Optional)"
                      id="expiry_date"
                      error={errors.expiry_date?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="certificate_url"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      {...field}
                      type="url"
                      label="Certificate URL"
                      id="certificate_url"
                      placeholder="https://example.com/certificate"
                      error={errors.certificate_url?.message}
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

      {/* show all certifications  */}

      <div className="grid gap-4">
        {certifications?.map((cert) => (
          <Card key={cert.id}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{cert.name}</h3>
                  <p className="text-gray-600 mt-1">{cert.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Issued: {new Date(cert.issued_date).toLocaleDateString()}
                    </p>
                    {cert.expiry_date && (
                      <p>
                        Expires:{" "}
                        {new Date(cert.expiry_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {cert.certificate_url && (
                    <a
                      href={cert.certificate_url}
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
          <div className="text-center py-8 text-gray-500 border rounded-lg">
            No certifications found. Add your first certification above.
          </div>
        )}
      </div>
    </div>
  );
}
