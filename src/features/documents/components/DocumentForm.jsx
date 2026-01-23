/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, X, GripVertical } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import SelectField_Search from "@/Components/Form/SelectField_Search";
import { Label } from "@/components/ui/label";
import FileUploader from "@/components/Form/FileUploader";
import ServiceSelect from "@/features/documents/components/ServiceSelector";

import { terms } from "@/lib/Terms_Conditions.json";
import {
  useCreateDocument,
  useDocument,
  useNoInvoiceProject,
  useUpdateDocument,
} from "../hooks/useDocumentsQuery";
import { useClients } from "@/features/clients/hooks/useClients/useClients";
import { useServices } from "@/features/services/hooks/useServices";
import AddClientModel from "@/components/common/AddClientModel";
import TextareaField from "@/components/Form/TextareaField";
import DateField from "@/components/Form/DateField";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DocumentForm({ type, onSuccess }) {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const { id } = useParams();

  const { state } = useLocation();
  const clientId = state?.clientId;
  const cloneFromId = state?.cloneFromId;
  const quoteId = state?.quoteId;

  const isEditMode = !!id;
  const isCloneMode = !!cloneFromId;
  const isConvertMode = !!quoteId && type === "invoices";

  const documentId = quoteId ?? id ?? cloneFromId;
  const documentType = quoteId ? "quotes" : type;

  const { data: document } = useDocument(documentId, documentType);
  const isInvoice = type === "invoices";
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: services = [], isLoading: servicesLoading } = useServices();

  const createMutation = useCreateDocument(type);
  const updateMutation = useUpdateDocument(type);

  const mutation = isEditMode ? updateMutation : createMutation;

  const projects = document?.client?.has_projects
    ? JSON.parse(document.has_projects)
    : [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerName: clientId || "",
      ...(isInvoice
        ? {
            invoice_date: "",
            due_date: "",
            // invoice_date: new Date().toISOString().split("T")[0],
            // due_date: new Date().toISOString().split("T")[0],
          }
        : {
            quoteDate: new Date().toISOString().split("T")[0],
            // attach_file:[];
          }),
      notes: "",
      payment_percentage: "50",
      payment_status: "pending",
      payment_type: "",
      description: "",
      terms,
      old_projects: [],
      has_projects: { title: [] },
      items: [
        {
          serviceId: null,
          description: "",
          quantity: 1,
          rate: 0,
          // tax: 0,
          tax_rate: 0,
          discount: 0,
          amount: 0,
        },
      ],
    },
  });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: "items",
  });

  const {
    fields: has_projectFields,
    append: appendHas_project,
    remove: removeHas_project,
  } = useFieldArray({
    control,
    name: "has_projects.title",
  });

  const items = watch("items");

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index) => {
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const currentItems = [...items];
    const draggedItem = currentItems[draggedIndex];

    // Remove the dragged item from its original position
    currentItems.splice(draggedIndex, 1);

    // Insert it at the new position
    currentItems.splice(dropIndex, 0, draggedItem);

    // Update the form with the new order
    setValue("items", currentItems);

    // Reset drag states
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const formatToBullets = (text) => {
    if (!text.trim()) return text;

    return text
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((item) => `- ${item}`)
      .join("\n");
  };

  useEffect(() => {
    if (document && (isEditMode || isCloneMode || isConvertMode)) {
      const doc = document;
      let projectTitles = [];
      if (projects && projects.title && Array.isArray(projects.title)) {
        projectTitles = projects.title.filter((t) => t !== "");
      } else if (Array.isArray(projects) && projects.length > 0) {
        projectTitles = projects
          .map((p) => p.title || "")
          .filter((t) => t !== "");
      }

      // For convert mode, we're creating an invoice from a quote
      if (isConvertMode) {
        reset({
          customerName: doc.client?.id || doc.client_id || clientId,
          invoice_date: new Date().toISOString().split("T")[0],
          due_date: new Date().toISOString().split("T")[0],
          notes: doc.notes || "",
          terms: doc.terms || terms,
          payment_percentage: "50",
          payment_status: "pending",
          payment_type: doc.payment_type || "",
          description: doc?.description,
          has_projects: {
            title: projectTitles,
          },
          old_projects: doc?.old_projects,
          items:
            doc.quote_services?.map((s) => {
              const serviceDetails = services.find(
                (srv) => Number(srv.id) === Number(s.service_id),
              );
              console.log(s);
              return {
                serviceId: Number(s.service_id),
                description: serviceDetails?.description || "",
                quantity: s.quantity,
                rate: parseFloat(s.individual_total) / s.quantity || 0,
                // tax: Number(s?.tax) || 0,
                tax_rate: Number(s?.tax) || 0,
                discount: 0,
                amount: parseFloat(s.individual_total),
              };
            }) || [],
        });
      } else {
        // Original logic for edit and clone modes
        reset({
          customerName: doc.client?.id || doc.client_id || clientId,
          ...(isInvoice
            ? {
                invoice_date: doc.invoice_date,
                due_date: doc.due_date,
              }
            : {
                quoteDate: doc.quotation_date,
              }),
          notes: doc.notes || "",
          terms: doc.terms || terms,
          payment_percentage: "50",
          payment_status: "pending",
          payment_type: doc.payment_type,
          description: doc?.description,
          has_projects: {
            title: projectTitles,
          },
          old_projects: doc?.old_projects,
          items:
            (isInvoice ? doc.invoice_services : doc.quote_services)?.map(
              (s) => {
                const serviceDetails = services.find(
                  (srv) => Number(srv.id) === Number(s.service_id),
                );
                console.log(s);
                console.log(serviceDetails);
                return {
                  serviceId: Number(s.service_id),
                  description: serviceDetails?.description || "",
                  quantity: s.quantity,
                  rate: parseFloat(s.individual_total) / s.quantity || 0,
                  // tax: Number(s?.tax) || 0,
                  tax_rate: Number(s?.tax) || 0,
                  discount: 0,
                  amount: parseFloat(s.individual_total),
                };
              },
            ) || [],
        });
      }
    }
  }, [
    document,
    isEditMode,
    isCloneMode,
    isConvertMode,
    isInvoice,
    reset,
    services,
  ]);

  const clientOptions = clients?.map((c) => ({
    label: c.client?.user?.name || c.name || "Unknown Client",
    value: String(c.client?.id),
  }));

  const { data: AllProjects } = useNoInvoiceProject();

  const ProjectOptions = AllProjects?.map((p) => ({
    label: p.name || "Unknown Project",
    value: String(p.id),
  }));

  const selectedClientId = watch("customerName");

  const selectedClient = clients?.find(
    (c) => c.client?.id === Number(selectedClientId),
  );

  useEffect(() => {
    if (selectedClient) {
      const isMoroccan =
        selectedClient?.client?.country?.trim().toLowerCase() === "maroc";
      const defaultPaymentMethod = isMoroccan ? "bank" : "stripe";
      setValue("payment_type", defaultPaymentMethod);
    }
  }, [selectedClient, setValue]);

  useEffect(() => {
    const currentProjects = watch("has_projects");
    if (!currentProjects?.title || currentProjects.title.length === 0) {
      setValue("has_projects", { title: [] });
    }
  }, []);

  const addNewRow = () => {
    appendItem({
      service: "",
      serviceId: null,
      description: "",
      quantity: 1,
      rate: 0,
      // tax: 0,
      tax_rate: 0,
      discount: 0,
      amount: 0,
    });
  };

  const deleteRow = (index) => {
    if (itemFields.length > 1) {
      removeItem(index);
    }
  };

  const cancelFunction = () => {
    reset();
    navigate(`/${role}/${isInvoice ? "invoices" : "quotes"}`);
  };

  const updateItem = (index, field, value) => {
    setValue(`items.${index}.${field}`, Number(value));
    const quantity = Number(watch(`items.${index}.quantity`) || 1);
    const rate = Number(watch(`items.${index}.rate`) || 0);
    const tax = Number(watch(`items.${index}.tax_rate`) || 0);
    const discount = Number(watch(`items.${index}.discount`) || 0);
    const base = quantity * rate;

    // Calculate HT amount (excluding tax)
    const discountAmount = base * (discount / 100);
    const finalAmount = base - discountAmount;

    setValue(`items.${index}.amount`, Number(finalAmount.toFixed(2)));
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const onSubmit = async (data, status) => {
    if (isSubmitting || !startSubmit()) return;

    console.log(data);
    const payload = {
      client_id: Number(data.customerName),

      ...(isInvoice
        ? {
            invoice_date: data.invoice_date,
            due_date: data.due_date,
            status: status || "unpaid",
            description: data.description,
            balance_due: Number(calculateTotal().toFixed(2)),
            ...(isConvertMode && { quote_id: quoteId }),
          }
        : {
            quotation_date: data.quoteDate,
            status: status || "draft",
            description: data.description,
          }),

      total_amount: Number(calculateTotal().toFixed(2)),
      notes: data.notes || "",
      terms: data.terms || terms,

      has_projects: JSON.stringify({
        title: data.has_projects?.title || [],
      }),

      payment_percentage: Number(data.payment_percentage),
      payment_status: data.payment_status,
      payment_type: data.payment_type,
      services: data.items.map((item) => ({
        service_id: Number(item.serviceId),
        quantity: Number(item.quantity),
        rate: Number(item.rate),
        // tax: item.tax_rate != null ? Number(item.tax_rate) : 0,
        tax: Number(item.tax_rate) || 0,
        discount: Number(item.discount || 0),
        individual_total: Number(item.amount),
      })),
    };

    if (isInvoice || (!isInvoice && !isEditMode)) {
      payload.old_projects = data.old_projects;
    }

    console.log("the payload:", payload);

    mutation.mutate(isEditMode ? { id, data: payload } : payload, {
      onSuccess: () => {
        onSuccess?.();
        if (!isEditMode) reset();
      },
      onSettled: () => endSubmit(),
    });
  };

  if (clientsLoading || servicesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-full min-h-screen">
      <div className="space-y-4">
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
                  <span className="font-medium text-muted-foreground">
                    City
                  </span>
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
                  <span className="font-medium text-muted-foreground">
                    Name
                  </span>
                  <span className="text-foreground">
                    {selectedClient?.client?.user?.name || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">
                    Email
                  </span>
                  <span className="text-foreground break-all">
                    {selectedClient?.client?.user?.email || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">
                    Phone
                  </span>
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

        {isInvoice ? (
          <>
            <div className="flex gap-4 w-full">
              <div className="w-[8%]">
                <FormField
                  label="Invoice Id"
                  type="text"
                  className="opacity-80"
                  value={"00001"}
                  placeholder="Type An Object"
                  disabled={() => true}
                />
              </div>
              <div className="w-[92%]">
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormField
                      id="description"
                      label="Object"
                      type="text"
                      value={field.value || ""}
                      placeholder="Type An Object"
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      error={error?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <div className="w-[50%]">
                <Controller
                  name="invoice_date"
                  control={control}
                  rules={{ required: "Invoice date is required" }}
                  render={({ field, fieldState: { error } }) => (
                    // <FormField
                    <DateField
                      id="invoice_date"
                      label="Invoice Date*"
                      type="date"
                      value={field.value || ""}
                      // onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      error={error?.message}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="w-[50%]">
                <Controller
                  name="due_date"
                  control={control}
                  rules={{ required: "Due date is required" }}
                  render={({ field, fieldState: { error } }) => (
                    // <FormField
                    <DateField
                      id="due_date"
                      label="Due Date*"
                      type="date"
                      value={field.value || ""}
                      // onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      error={error?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <div className="w-[30%]">
              <Controller
                name="quoteDate"
                control={control}
                rules={{ required: "Quote date is required" }}
                render={({ field, fieldState: { error } }) => (
                  // <FormField
                  <DateField
                    id="quoteDate"
                    label="Quote Date*"
                    type="date"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    error={error?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-[70%]">
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormField
                    id="description"
                    label="Object"
                    type="text"
                    value={field.value || ""}
                    placeholder="Type An Object"
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    error={error?.message}
                  />
                )}
              />
            </div>
          </div>
        )}

        <div className="mt-1 space-y-4">
          <h3 className="text-sm font-medium text-foreground">Items</h3>

          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="w-10 p-3 text-center"></th>
                    <th className="p-3 text-left text-sm font-semibold text-muted-foreground">
                      ITEM / DESCRIPTION
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-muted-foreground w-29">
                      QUANTITY
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-muted-foreground w-29">
                      RATE
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-muted-foreground w-29">
                      TAX %
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-muted-foreground w-29">
                      DISCOUNT %
                    </th>
                    <th className="p-3 text-right text-sm font-semibold text-muted-foreground w-32">
                      AMOUNT
                    </th>
                    <th className="w-14 p-3 text-center"></th>
                  </tr>
                </thead>

                <tbody>
                  {itemFields.map((field, index) => {
                    const selectedService = watch(`items.${index}.serviceId`);
                    const isDragging = draggedIndex === index;
                    const isDragOver = dragOverIndex === index;

                    return (
                      <tr
                        key={field.id}
                        className={cn(
                          "border-b last:border-b-0 hover:bg-muted/50 transition-colors ",
                          isDragging && "opacity-60 bg-muted/70",
                          isDragOver &&
                            "border-t-2 border-t-primary bg-primary/5",
                        )}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => {
                          e.preventDefault();
                          handleDragOver(index);
                        }}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        style={{ cursor: isDragging ? "grabbing" : "grab" }}
                      >
                        {/* Drag handle */}
                        <td className="p-3 text-center ">
                          <GripVertical
                            className="mx-auto h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing"
                            onMouseDown={() => handleDragStart(index)}
                          />
                        </td>

                        {/* Service + Description */}
                        <td className="p-3 ">
                          <div className="space-y-3 ">
                            <Controller
                              name={`items.${index}.serviceId`}
                              control={control}
                              rules={{
                                required: "Service is required",
                                validate: (value) =>
                                  !!value || "Service is required",
                              }}
                              render={({ field, fieldState: { error } }) => (
                                <ServiceSelect
                                  services={services}
                                  value={field.value || ""}
                                  onChange={(val) => {
                                    const serviceId = Number(val);
                                    field.onChange(serviceId);

                                    const service = services.find(
                                      (s) => Number(s.id) === serviceId,
                                    );
                                    if (!service) return;

                                    const unitPrice = Number(
                                      service.base_price,
                                    );
                                    setValue(`items.${index}.rate`, unitPrice);
                                    setValue(
                                      `items.${index}.description`,
                                      service.description,
                                    );
                                    setValue(
                                      `items.${index}.service`,
                                      serviceId,
                                    );

                                    const quantity =
                                      Number(
                                        watch(`items.${index}.quantity`) || 1,
                                      ) || 1;

                                    const tax_rate = Number(service.tax_rate);
                                    setValue(
                                      `items.${index}.tax_rate`,
                                      tax_rate,
                                    );

                                    const discount =
                                      Number(
                                        watch(`items.${index}.discount`) || 0,
                                      ) || 0;

                                    const base = quantity * unitPrice;

                                    // Calculate HT amount (excluding tax)
                                    const discountAmount =
                                      base * (discount / 100);
                                    const finalAmount = base - discountAmount;

                                    setValue(
                                      `items.${index}.amount`,
                                      Number(finalAmount.toFixed(2)),
                                    );
                                  }}
                                  error={error?.message}
                                  placeholder="Select a service"
                                />
                              )}
                            />

                            {selectedService && (
                              <TextareaField
                                {...register(`items.${index}.description`)}
                                placeholder="Service description (one per line)"
                                rows={4}
                                value={formatToBullets(
                                  watch(`items.${index}.description`) || "",
                                )}
                                onChange={(e) => {
                                  const cleanText = e.target.value
                                    .split("\n")
                                    .map((line) =>
                                      line.replace(/^•\s*/, "").trim(),
                                    )
                                    .filter((line) => line.length > 0)
                                    .join(", ");
                                  setValue(
                                    `items.${index}.description`,
                                    cleanText,
                                  );
                                }}
                                error={
                                  errors.items?.[index]?.description?.message
                                }
                              />
                            )}
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="p-3">
                          <FormField
                            type="number"
                            value={watch(`items.${index}.quantity`) ?? ""}
                            error={errors.items?.[index]?.quantity?.message}
                            {...register(`items.${index}.quantity`, {
                              required: "Required",
                              min: { value: 1, message: "≥ 1" },
                              valueAsNumber: true,
                            })}
                            onChange={(e) => {
                              updateItem(index, "quantity", e.target.value);
                              trigger(`items.${index}.quantity`);
                            }}
                          />
                        </td>

                        {/* Rate */}
                        <td className="p-3">
                          <FormField
                            type="number"
                            value={watch(`items.${index}.rate`) ?? ""}
                            error={errors.items?.[index]?.rate?.message}
                            {...register(`items.${index}.rate`, {
                              required: "Required",
                              min: { value: 0, message: "≥ 0" },
                              valueAsNumber: true,
                            })}
                            onChange={(e) => {
                              updateItem(index, "rate", e.target.value);
                              trigger(`items.${index}.rate`);
                            }}
                          />
                        </td>

                        {/* Tax */}
                        <td className="p-3">
                          <FormField
                            type="number"
                            value={
                              watch(`items.${index}.tax_rate`) ??
                              watch(`items.${index}.tax`) ??
                              ""
                            }
                            error={errors.items?.[index]?.tax_rate?.message}
                            {...register(`items.${index}.tax_rate`, {
                              min: { value: 0, message: "≥ 0" },
                              max: { value: 100, message: "≤ 100" },
                              valueAsNumber: true,
                            })}
                            onChange={(e) => {
                              updateItem(index, "tax_rate", e.target.value);
                              trigger(`items.${index}.tax_rate`);
                            }}
                          />
                        </td>

                        {/* Discount */}
                        <td className="p-3">
                          <FormField
                            type="number"
                            value={watch(`items.${index}.discount`) ?? ""}
                            error={errors.items?.[index]?.discount?.message}
                            {...register(`items.${index}.discount`, {
                              required: "Required",
                              min: { value: 0, message: "≥ 0" },
                              max: { value: 100, message: "≤ 100" },
                              valueAsNumber: true,
                            })}
                            onChange={(e) => {
                              updateItem(index, "discount", e.target.value);
                              trigger(`items.${index}.discount`);
                            }}
                          />
                        </td>

                        {/* Amount (calculated) */}
                        <td className="p-3 text-right font-medium text-foreground">
                          {(watch(`items.${index}.amount`) || 0).toFixed(2)}
                        </td>

                        {/* Delete */}
                        <td className="p-3 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteRow(index)}
                            disabled={itemFields.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer with Add + Total */}
            <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewRow}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add Row
              </Button>

              <div className="flex items-center gap-6 text-sm font-medium">
                <span className="text-muted-foreground">Total (MAD)</span>
                <span className="text-lg font-semibold text-foreground">
                  {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full items-start space-between">
          {(type === "invoices" || (type === "quotes" && !isEditMode)) && (
            <div
              className={`flex gap-4 items-end justify-between ${
                !isInvoice ? "w-full" : "w-[50%]"
              }`}
            >
              <div className="w-full">
                <Controller
                  name="old_projects"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectField_Search
                      label="Project"
                      options={ProjectOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      customValue={watch("has_projects.title") || []}
                      onCustomChange={(newCustom) =>
                        setValue("has_projects.title", newCustom)
                      }
                      error={error?.message}
                      placeholder="Select or add a project"
                    />
                  )}
                />
              </div>
            </div>
          )}
          {isInvoice && (
            <div className="w-[50%]">
              <div className="flex md:flex-row flex-col gap-4 items-end justify-between rounded-lg">
                <div className="w-full flex gap-4 items-center justify-between">
                  <div className="w-[33%]">
                    <Controller
                      name="payment_type"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <SelectField
                          id="payment_type"
                          label="Type"
                          type="select"
                          value={field.value || ""}
                          options={[
                            { value: "bank", label: "Bank" },
                            { value: "cash", label: "Cash" },
                            { value: "cheque", label: "Cheque" },
                            { value: "stripe", label: "Stripe" },
                          ]}
                          onChange={(e) => field.onChange(e)}
                          onBlur={field.onBlur}
                          error={error?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="w-[33%]">
                    <Controller
                      name="payment_percentage"
                      control={control}
                      rules={{ required: "Amount is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <FormField
                          id="payment_percentage"
                          label="Percentage"
                          min="1"
                          max="100"
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          onBlur={field.onBlur}
                          error={error?.message}
                        />
                      )}
                    />
                  </div>
                  <div className="w-[33%]">
                    <Controller
                      name="payment_status"
                      control={control}
                      rules={{ required: "Status is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <SelectField
                          id="payment_status"
                          label="Status"
                          type="select"
                          value={field.value || ""}
                          options={[
                            { value: "pending", label: "Pending" },
                            { value: "paid", label: "Paid" },
                          ]}
                          onChange={(e) => field.onChange(e)}
                          onBlur={field.onBlur}
                          error={error?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex md:flex-row flex-col gap-4 items-start justify-between h-full">
          <div className={`${isInvoice ? "w-[50%]" : "w-[40%]"}`}>
            <div className="w-full">
              <TextareaField
                className=" min-h-22"
                id="notes"
                label="Customer Notes"
                placeholder="Enter notes"
                value={watch("notes")}
                onChange={(e) => setValue("notes", e.target.value)}
              />
            </div>
          </div>
          <div className={`${isInvoice ? "w-[50%]" : "w-[40%]"}`}>
            <TextareaField
              id="terms"
              label="Terms & Conditions"
              className=" min-h-20 resize-none"
              placeholder="Enter terms"
              rows={4}
              readonly
              value={watch("terms")}
              onChange={(e) => setValue("terms", e.target.value)}
            />
          </div>
          {!isInvoice && (
            <div className="w-[20%] h-full ">
              <Controller
                name="attach_file"
                control={control}
                render={({ field }) => (
                  <FileUploader
                    name="Attach File"
                    label="Attach File(s) to Quote"
                    placeholder="Add Your Attach File"
                    error={errors.attach_file?.message}
                    {...field}
                  />
                )}
              />
            </div>
          )}
        </div>

        <div className="flex md:flex-row flex-col justify-end gap-3 mt-8">
          <Button
            onClick={cancelFunction}
            type="button"
            className="px-6 py-2 bg-background border border-border text-foreground rounded font-medium text-sm hover:bg-background transition-colors"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit((data) => onSubmit(data, "draft"))}
            type="button"
            disabled={isSubmitting}
          >
            {isEditMode ? "Update Draft" : "Save as Draft"}
          </Button>

          <Button
            onClick={handleSubmit((data) =>
              onSubmit(
                data,
                isInvoice
                  ? "sent"
                  : document?.client?.status === "confirmed"
                    ? "confirmed"
                    : "sent",
              ),
            )}
            type="submit"
            disabled={isSubmitting}
          >
            {isEditMode
              ? isInvoice
                ? "Update & Resend"
                : "Update & Send"
              : isInvoice
                ? "Send Invoice"
                : "Send Quote"}
          </Button>
        </div>
      </div>
    </form>
  );
}
