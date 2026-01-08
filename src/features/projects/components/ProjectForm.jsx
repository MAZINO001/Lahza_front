/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import TextareaField from "@/Components/Form/TextareaField";

import {
  useDocuments,
  useNoInvoiceProject,
} from "@/features/documents/hooks/useDocumentsQuery";
import {
  useCreateProject,
  useProject,
  useUpdateProject,
} from "../hooks/useProjects";
import { formatId } from "@/lib/utils/formatId";
import Checkbox from "@/components/Checkbox";
import { useClients } from "@/features/clients/hooks/useClientsQuery";
import AddClientModel from "@/components/common/AddClientModel";

export function ProjectForm({ onSuccess }) {
  const [directProject, setDirectProject] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { role } = useAuthContext();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const { data: invoices = [], isLoading: invoicesLoading } =
    useNoInvoiceProject();
  const { data: project = [], isLoading: projectLoading } = useProject(id);
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const mutation = project?.id ? updateMutation : createMutation;
  const isEditMode = !!id;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: project || {
      customerName: "",
      name: "",
      description: "",
      invoice_id: "",
      start_date: "",
      estimated_end_date: "",
      status: "pending",
    },
  });

  useEffect(() => {
    if (isEditMode && project?.id) {
      reset({
        customerName: project.client_id ? String(project.client_id) : "",
        name: project.name || "",
        description: project.description || "",
        invoice_id: project.invoice_id ? String(project.invoice_id) : "",
        start_date: project.start_date || "",
        estimated_end_date: project.estimated_end_date || "",
        status: project.status || "pending",
      });
    }
  }, [isEditMode, project, reset]);

  useEffect(() => {
    setDirectProject(isEditMode && project?.invoice_id === null);
  }, [isEditMode, project?.invoice_id]);

  const onSubmit = (data) => {
    if (isSubmitting || !startSubmit()) return;

    const payload = {
      ...data,
      status: "pending",
      client_id: Number(data.customerName),
      invoice_id: directProject ? "" : Number(data.invoice_id),
    };
    console.log(`payload :`);
    console.log(payload);
    mutation.mutate(isEditMode ? { id: project.id, data: payload } : payload, {
      onSuccess: () => {
        onSuccess?.();
        if (!isEditMode) reset();
        navigate(`/${role}/projects`);
      },
      onSettled: () => endSubmit(),
    });
  };

  const invoiceOptions = invoices.map((invoice) => ({
    label: formatId(invoice.id, "INVOICE"),
    value: String(invoice.id),
  }));

  const { data: clients } = useClients();
  const selectedClientId = watch("customerName");

  const selectedClient = clients?.find(
    (c) => selectedClientId && c.client?.id === Number(selectedClientId)
  );

  const clientOptions = clients?.map((c) => ({
    label: c.client?.user?.name || c.name || "Unknown Client",
    value: String(c.client?.id),
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div className="w-full">
          <Controller
            name="customerName"
            control={control}
            rules={{ required: "Please select a customer" }}
            render={({ field, fieldState: { error } }) => (
              <SelectField
                label="Customer"
                options={clientOptions}
                value={field.value || ""}
                onChange={(val) => field.onChange(val)}
                onBlur={field.onBlur}
                error={error?.message}
                placeholder="Select or add a customer"
              />
            )}
          />
        </div>
        <AddClientModel />
      </div>
      {selectedClient && (
        <div className="flex gap-4 p-4 border rounded bg-background text-sm space-y-4 max-w-[700px]">
          <div className="flex flex-col gap-2 w-[50%]">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {selectedClient?.client?.user?.name}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {selectedClient?.client?.user?.email}
            </p>
            <p>
              <span className="font-medium">Client Type:</span>{" "}
              {selectedClient?.client?.client_type}
            </p>
            {selectedClient?.client?.company && (
              <p>
                <span className="font-medium">Company:</span>{" "}
                {selectedClient?.client?.company}
              </p>
            )}
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {selectedClient?.client?.phone}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {selectedClient?.client?.address}
            </p>
            <p>
              <span className="font-medium">City:</span>{" "}
              {selectedClient?.client?.city}
            </p>
          </div>

          {/* Second Row */}
          <div className="flex flex-col gap-4  w-[50%]">
            <p>
              <span className="font-medium">Country:</span>{" "}
              {selectedClient?.client?.country}
            </p>
            <p>
              <span className="font-medium">Currency:</span>{" "}
              {selectedClient?.client?.currency || "MAD"}
            </p>
            {selectedClient?.client?.ice && (
              <p>
                <span className="font-medium">ICE:</span>{" "}
                {selectedClient?.client?.ice}
              </p>
            )}
            {selectedClient?.client?.siren && (
              <p>
                <span className="font-medium">SIREN:</span>{" "}
                {selectedClient?.client?.siren}
              </p>
            )}
            <p>
              <span className="font-medium">VAT:</span>{" "}
              {selectedClient?.client?.vat || "20%"}
            </p>
          </div>
        </div>
      )}

      {invoicesLoading && (
        <p className="text-sm text-muted-foreground">Loading invoices...</p>
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
