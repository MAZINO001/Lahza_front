/* eslint-disable no-unused-vars */
// src/features/projects/components/ProjectForm.jsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import TextareaField from "@/Components/Form/TextareaField";

import { useDocuments } from "@/features/documents/hooks/useDocumentsQuery";
import {
  useCreateProject,
  useProject,
  useUpdateProject,
} from "../hooks/useProjects";
import { formatId } from "@/lib/utils/formatId";
import Checkbox from "@/components/Checkbox";

export function ProjectForm({ onSuccess }) {
  const [directProject, setDirectProject] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { role } = useAuthContext();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const { data: invoices = [], isLoading: invoicesLoading } =
    useDocuments("invoices");
  const { data: project = [], isLoading: projectLoading } = useProject(id);
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const mutation = project?.id ? updateMutation : createMutation;
  const isEditMode = !!id;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: project || {
      name: "",
      description: "",
      invoice_id: "",
      start_date: "",
      estimated_end_date: "",
      status: "active",
    },
  });

  useEffect(() => {
    setDirectProject(isEditMode && project?.invoice_id === null);
  }, [isEditMode, project?.invoice_id]);

  const onSubmit = (data) => {
    if (isSubmitting || !startSubmit()) return;

    const payload = {
      ...data,
      invoice_id: directProject ? "" : Number(data.invoice_id),
    };
    console.log(payload);
    mutation.mutate(isEditMode ? { id: project.id, data: payload } : payload, {
      onSuccess: () => {
        onSuccess?.();
        if (!isEditMode) reset();
      },
      onSettled: () => endSubmit(),
    });
  };

  const invoiceOptions = invoices.map((invoice) => ({
    label: formatId(invoice.id, "INVOICE"),
    value: String(invoice.id),
  }));
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      {invoicesLoading && (
        <p className="text-sm text-gray-500">Loading invoices...</p>
      )}

      <Controller
        name="name"
        control={control}
        rules={{ required: "Project name is required" }}
        render={({ field }) => (
          <FormField
            label="Project Name"
            placeholder="e.g. Website Redesign"
            error={errors.name?.message}
            {...field}
          />
        )}
      />
      <div className="flex gap-4 items-end justify-between">
        <div className="w-[85%]">
          <Controller
            name="invoice_id"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Invoice (Optional)"
                options={invoiceOptions}
                placeholder={
                  invoicesLoading
                    ? "Loading invoices..."
                    : "Select an invoice (optional)"
                }
                value={String(field.value || "")}
                disabled={invoicesLoading || directProject}
                onChange={(v) => field.onChange(v ? Number(v) : null)}
                error={errors.invoice_id?.message}
              />
            )}
          />
        </div>
        <div className="flex gap-4 w-[15%] border border-border rounded-md p-[5.5px]">
          <Checkbox
            checked={directProject}
            onCheckedChange={setDirectProject}
            className="w-6 h-6 rounded-md"
          />
          <span
            onClick={() => setDirectProject((prev) => !prev)}
            className="cursor-pointer select-none"
          >
            Direct Project
          </span>
        </div>
      </div>

      <Controller
        name="description"
        control={control}
        rules={{ required: "Description is required" }}
        render={({ field }) => (
          <TextareaField
            label="Description"
            placeholder="Describe this project..."
            error={errors.description?.message}
            {...field}
          />
        )}
      />

      <div className="flex gap-4 w-full">
        <div className="w-[50%]">
          <Controller
            name="start_date"
            control={control}
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <FormField
                type="date"
                label="Start Date"
                error={errors.start_date?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className="w-[50%]">
          <Controller
            name="estimated_end_date"
            control={control}
            rules={{ required: "Estimated end date is required" }}
            render={({ field }) => (
              <FormField
                type="date"
                label="Estimated End Date"
                error={errors.estimated_end_date?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/${role}/projects`)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : isEditMode
              ? "Update Project"
              : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
