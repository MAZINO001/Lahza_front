/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import TextareaField from "@/Components/Form/TextareaField";
import api from "@/lib/utils/axios";

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

  // Handle clone mode from navigation state
  const { state } = useLocation();
  const cloneFromId = state?.cloneFromId;
  const isCloneMode = !!cloneFromId;

  const { data: invoices = [], isLoading: invoicesLoading } =
    useNoInvoiceProject();
  const { data: project = [], isLoading: projectLoading } = useProject(id);
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const mutation = project?.id ? updateMutation : createMutation;
  const isEditMode = !!id;
  const isCloneModeActive = isCloneMode && !isEditMode;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: isCloneModeActive
      ? {}
      : project || {
          customerName: "",
          name: "",
          description: "",
          invoice_id: "",
          start_date: "",
          estimated_end_date: "",
          status: "pending",
        },
  });

  const { data: currentProject, isLoading: isCloneLoading } =
    useProject(cloneFromId);
  console.log(currentProject);
  useEffect(() => {
    if (isCloneModeActive && !isCloneLoading && currentProject) {
      const fetchProjectData = async () => {
        try {
          const projectData = currentProject;

          reset({
            customerName: projectData?.client_id
              ? String(projectData?.client_id)
              : "",
            name: `${projectData?.name || ""}`,
            description: projectData?.description || "",
            invoice_id: projectData?.invoice_id
              ? String(projectData?.invoice_id)
              : "",
            start_date: projectData?.start_date || "",
            estimated_end_date: projectData?.estimated_end_date || "",
            status: "pending",
          });
        } catch (error) {
          console.error("Failed to fetch project for cloning:", error);
        }
      };

      fetchProjectData();
    } else if (isEditMode && project?.id) {
      // Handle edit mode
      reset({
        customerName: project?.client_id ? String(project.client_id) : "",
        name: project?.name || "",
        description: project?.description || "",
        invoice_id: project?.invoice_id ? String(project.invoice_id) : "",
        start_date: project?.start_date || "",
        estimated_end_date: project?.estimated_end_date || "",
        status: project?.status || "pending",
      });
    }
  }, [
    isEditMode,
    isCloneModeActive,
    cloneFromId,
    project?.id,
    isCloneLoading,
    currentProject,
  ]);

  useEffect(() => {
    setDirectProject(
      (isEditMode || isCloneModeActive) && project?.invoice_id === null
    );
  }, [isEditMode, isCloneModeActive, project?.invoice_id]);

  const onSubmit = (data) => {
    if (isSubmitting || !startSubmit()) return;

    const payload = {
      ...data,
      status: "pending",
      client_id: Number(data.customerName),
      invoice_id: directProject ? "" : Number(data.invoice_id),
    };

    // For clone mode, remove the ID to create a new project
    const mutationPayload = isCloneModeActive
      ? payload
      : isEditMode
        ? { id: project.id, data: payload }
        : payload;

    console.log(`payload :`);
    console.log(mutationPayload);

    mutation.mutate(mutationPayload, {
      onSuccess: () => {
        onSuccess?.();
        if (!isEditMode || isCloneModeActive) reset();
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 h-screen">
      {isCloneModeActive && isCloneLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-sm text-muted-foreground">
            Loading project data for cloning...
          </div>
        </div>
      )}
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
                disabled={isCloneModeActive && isCloneLoading}
              />
            )}
          />
        </div>
        <AddClientModel />
      </div>
      {selectedClient && (
        <div className="space-y-4 flex gap-4">
          <div className="border rounded bg-background p-4">
            <h3 className="font-bold text-base mb-3">Billing</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Address:</span>{" "}
                {selectedClient?.client?.address}
              </p>
              <p>
                <span className="font-medium">City:</span>{" "}
                {selectedClient?.client?.city}
              </p>
              <p>
                <span className="font-medium">Country:</span>{" "}
                {selectedClient?.client?.country}
              </p>
              <p>
                <span className="font-medium">Currency:</span>{" "}
                {selectedClient?.client?.currency || "MAD"}
              </p>
              <p>
                <span className="font-medium">VAT:</span>{" "}
                {selectedClient?.client?.vat || "20%"}
              </p>
            </div>
          </div>

          <div className="border rounded bg-background p-4">
            <h3 className="font-bold text-base mb-3">Personal Info</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {selectedClient?.client?.user?.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {selectedClient?.client?.user?.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {selectedClient?.client?.phone}
              </p>
              <p>
                <span className="font-medium">Client Type:</span>{" "}
                {selectedClient?.client?.client_type}
              </p>
            </div>
          </div>

          {(selectedClient?.client?.company ||
            selectedClient?.client?.ice ||
            selectedClient?.client?.siren) && (
            <div className="border rounded bg-background p-4">
              <h3 className="font-bold text-base mb-3">Company Info</h3>
              <div className="space-y-2 text-sm">
                {selectedClient?.client?.company && (
                  <p>
                    <span className="font-medium">Company:</span>{" "}
                    {selectedClient?.client?.company}
                  </p>
                )}
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
              </div>
            </div>
          )}
        </div>
      )}

      {invoicesLoading && (
        <p className="text-sm text-muted-foreground">Loading invoices...</p>
      )}

      <div className="w-full flex gap-4">
        <div className="w-[40%]">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Project name is required" }}
            render={({ field }) => (
              <FormField
                label="Project Name"
                placeholder="e.g. Website Redesign"
                error={errors.name?.message}
                disabled={isCloneModeActive && isCloneLoading}
                {...field}
              />
            )}
          />
        </div>
        <div className="w-[60%]">
          <div className="flex gap-4 items-end justify-between">
            <div className="w-[76%]">
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
                    disabled={
                      invoicesLoading ||
                      directProject ||
                      (isCloneModeActive && isCloneLoading)
                    }
                    onChange={(v) => field.onChange(v ? Number(v) : null)}
                    error={errors.invoice_id?.message}
                  />
                )}
              />
            </div>
            <div
              onClick={() => setDirectProject((prev) => !prev)}
              className="flex gap-4 w-[24%] border border-border rounded-md p-[5.5px] cursor-pointer select-none"
            >
              <Checkbox
                checked={directProject}
                onCheckedChange={(v) => setDirectProject(v)}
                className="w-6 h-6 rounded-md"
                onClick={(e) => e.stopPropagation()}
              />
              <span>Direct Project</span>
            </div>
          </div>
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
            disabled={isCloneModeActive && isCloneLoading}
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
                disabled={isCloneModeActive && isCloneLoading}
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
                disabled={isCloneModeActive && isCloneLoading}
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
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            mutation.isPending ||
            (isCloneModeActive && isCloneLoading)
          }
        >
          {mutation.isPending
            ? "Saving..."
            : isCloneModeActive
              ? "Clone Project"
              : isEditMode
                ? "Update Project"
                : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
