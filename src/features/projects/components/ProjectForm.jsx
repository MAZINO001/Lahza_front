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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useClients } from "@/features/clients/hooks/useClients/useClients";
import AddClientModel from "@/components/common/AddClientModel";
import DateField from "@/components/Form/DateField";
import { cn } from "@/lib/utils";

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
      (isEditMode || isCloneModeActive) && project?.invoice_id === null,
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
    (c) => selectedClientId && c.client?.id === Number(selectedClientId),
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">
                  Address
                </span>
                <span className="text-foreground">
                  {selectedClient?.client?.address || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">City</span>
                <span className="text-foreground">
                  {selectedClient?.client?.city || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">
                  Country
                </span>
                <span className="text-foreground">
                  {selectedClient?.client?.country || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">
                  Currency
                </span>
                <span className="text-foreground">
                  {selectedClient?.client?.currency || "MAD"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">VAT</span>
                <span className="text-foreground">
                  {selectedClient?.client?.vat || "20%"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Personal Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Name</span>
                <span className="text-foreground">
                  {selectedClient?.client?.user?.name || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Email</span>
                <span className="text-foreground break-all">
                  {selectedClient?.client?.user?.email || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Phone</span>
                <span className="text-foreground">
                  {selectedClient?.client?.phone || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">
                  Client Type
                </span>
                <span className="text-foreground">
                  {selectedClient?.client?.client_type || "—"}
                </span>
              </div>
            </CardContent>
          </Card>

          {(selectedClient?.client?.company ||
            selectedClient?.client?.ice ||
            selectedClient?.client?.siren) && (
              <Card className="border-border bg-card text-card-foreground shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Company Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {selectedClient?.client?.company && (
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">
                        Company
                      </span>
                      <span className="text-foreground">
                        {selectedClient.client.company}
                      </span>
                    </div>
                  )}
                  {selectedClient?.client?.ice && (
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">
                        ICE
                      </span>
                      <span className="text-foreground">
                        {selectedClient.client.ice}
                      </span>
                    </div>
                  )}
                  {selectedClient?.client?.siren && (
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">
                        SIREN
                      </span>
                      <span className="text-foreground">
                        {selectedClient.client.siren}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
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
              className={cn(
                "flex items-center space-x-3 rounded-md border bg-card p-2 max-h-9 w-[24%]",
                "hover:bg-accent/50 transition-colors cursor-pointer select-none",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              )}
              onClick={() => setDirectProject((prev) => !prev)}
              role="button"
              tabIndex={0}
            >
              <Checkbox
                checked={directProject}
                onCheckedChange={setDirectProject}
                onClick={(e) => e.stopPropagation()}
                className="h-5 w-5 rounded"
              />
              <span className="text-sm font-medium">Direct Project</span>
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
              // <FormField
              <DateField
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
              // <FormField
              <DateField
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
          onClick={onSuccess || (() => navigate(`/${role}/projects`))}
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
