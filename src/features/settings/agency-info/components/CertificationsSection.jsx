"use client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  useCertifications,
  useCreateCertification,
  useUpdateCertification,
  useDeleteCertification,
} from "../../hooks/useSettingsAgencyInfoQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import FormField from "@/components/Form/FormField";
import TextareaField from "@/components/Form/TextareaField";
import FileUploader from "@/components/Form/FileUploader";
import SelectField from "@/components/Form/SelectField";
import { StatusBadge } from "@/components/StatusBadge";
import AddCertificationComp from "@/components/settings/addCertificationComp";

export default function CertificationsSection() {
  const { data: certifications, isLoading, error } = useCertifications();
  const deleteCertification = useDeleteCertification();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      certifications: [],
    },
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
  const handleDelete = (id) => {
    deleteCertification.mutate(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-full">
          <h1 className="font-semibold text-lg mb-6">Certifications</h1>

          <AddCertificationComp />
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4">
          {certifications?.map((cert) => (
            <Card key={cert.id}>
              <CardContent>
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
            <div className="text-center py-4 text-muted-foreground border rounded-lg">
              No certifications found. Add your first certification above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
