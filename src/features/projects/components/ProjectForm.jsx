/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray, Watch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";

import { terms } from "@/lib/Terms_Conditions.json";
import { useDocument } from "../hooks/useDocumentsQuery";
import TextareaField from "@/components/Form/TextareaField";
import { useDocuments } from "@/features/documents/hooks/useDocumentsQuery";
import { useUpdateProject } from "../hooks/useProjects";
import { SelectValue } from "@/components/ui/select";

export function ProjectForm({ onSuccess }) {
  const { id } = useParams();
  const { data: document } = useDocuments("invoices");
  const { data: project } = useDocument(id);
  const isEditMode = false;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      invoice_id: "",
      start_date: "",
      estimated_end_date: "",
      status: "active",
    },
  });
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const updateMutation = useUpdateProject();

  const onSubmit = (data) => {
    if (isSubmitting || !startSubmit()) return;

    const payload = {
      ...data,
      discount_value: Number(data.discount_value),
      service_id: Number(data.service_id),
    };

    mutation.mutate(isEditMode ? { id: project.id, data: payload } : payload, {
      onSuccess: () => {
        onSuccess?.();
        if (!isEditMode) reset();
      },
      onSettled: () => endSubmit(),
    });
  };

  const InvoiceOptions = document.map((s) => ({
    label: s.name,
    value: String(s.id),
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-full">
      <div className="space-y-4">
        <Controller
          name="invoice_date"
          control={control}
          rules={{ required: "Invoice date is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormField
              id="invoice_date"
              label="Invoice Date*"
              type="date"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              error={error?.message}
            />
          )}
        />{" "}
        <Controller
          name="invoice_date"
          control={control}
          rules={{ required: "Invoice date is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormField
              id="invoice_date"
              label="Invoice Date*"
              type="date"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              error={error?.message}
            />
          )}
        />
        <Controller
          name={`has_projects.title.${index}`}
          control={control}
          render={({ field }) => (
            <FormField
              label={index === 0 ? "Project Title" : ""}
              placeholder="Enter Title..."
              className="w-full"
              {...field}
            />
          )}
        />
        <Controller
          name="payment_type"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextareaField
              className=" min-h-22"
              id="notes"
              label="Customer Notes"
              placeholder="Enter notes"
              value={Watch("notes")}
              onChange={(e) => SelectValue("notes", e.target.value)}
            />
          )}
        />
        <Controller
          name="payment_type"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <SelectField
              id="payment_type"
              label="Payment Type"
              type="select"
              value={field.value || ""}
              options={[
                { value: "bank", label: "Bank" },
                { value: "cash", label: "Cash" },
                { value: "espace", label: "Espace" },
                { value: "stripe", label: "Stripe" },
              ]}
              onChange={(e) => field.onChange(e)}
              onBlur={field.onBlur}
              error={error?.message}
            />
          )}
        />
      </div>
    </form>
  );
}
