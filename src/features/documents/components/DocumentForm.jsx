import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ServiceSelect from "@/Components/Invoice_Quotes/ServiceSelector";

import { terms } from "@/lib/Terms_Conditions.json";
import {
  useCreateDocument,
  useDocument,
  useUpdateDocument,
} from "../hooks/useDocumentsQuery";
import { useClients } from "@/features/clients/hooks/useClientsQuery";
import { useServices } from "@/features/services/hooks/useServiceQuery";

export function DocumentForm({ document, onSuccess }) {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();

  const location = useLocation();

  const { id } = useParams();
  const segment = location.pathname.split("/")[2];
  const isInvoicePath = segment?.includes("invoice");
  const apiType = isInvoicePath ? "invoice" : "quote";
  const isEditMode = !!id;
  const { data: existingDocument } = useDocument(
    isEditMode ? id : null,
    apiType
  );
  const isInvoice = segment === "invoice" || segment === "invoices";
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const createMutation = useCreateDocument(apiType);
  const updateMutation = useUpdateDocument(apiType);

  const mutation = document?.id ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerName: "",
      ...(isInvoice
        ? {
            invoice_date: new Date().toISOString().split("T")[0],
            due_date: new Date().toISOString().split("T")[0],
          }
        : {
            quoteDate: new Date().toISOString().split("T")[0],
          }),
      notes: "",
      payment_percentage: "50",
      payment_status: "pending",
      payment_type: "",
      terms: terms,
      items: [
        {
          serviceId: null,
          description: "",
          quantity: 1,
          rate: 0,
          tax: 0,
          discount: 0,
          amount: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  useEffect(() => {
    if (existingDocument && isEditMode) {
      const doc = existingDocument;
      reset({
        customerName: doc.client_id,
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
        items:
          (isInvoice ? doc.invoice_services : doc.quote_services)?.map((s) => ({
            serviceId: Number(s.service_id),
            description: s.description || "",
            quantity: s.quantity,
            rate: parseFloat(s.individual_total) / s.quantity || 0,
            tax: parseFloat(s.tax) || 0,
            discount: 0,
            amount: parseFloat(s.individual_total),
          })) || [],
      });
    }
  }, [existingDocument, isEditMode, isInvoice, reset]);

  const clientOptions = clients.map((c) => ({
    label: c.user?.name || c.name || "Unknown Client",
    value: String(c.id),
  }));

  const selectedClientId = watch("customerName");
  const selectedClient = clients.find((c) => c.id === Number(selectedClientId));

  useEffect(() => {
    if (selectedClient) {
      const isMoroccan = selectedClient.country === "maroc";
      const defaultPaymentMethod = isMoroccan ? "bank" : "Stripe";
      setValue("payment_type", defaultPaymentMethod);
    }
  }, [selectedClient, setValue]);

  const addNewRow = () => {
    append({
      service: "",
      serviceId: null,
      description: "",
      quantity: 1,
      rate: 0,
      tax: 0,
      discount: 0,
      amount: 0,
    });
  };

  const deleteRow = (index) => {
    if (fields.length > 1) {
      remove(index);
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
    const tax = Number(watch(`items.${index}.tax`) || 0);
    const discount = Number(watch(`items.${index}.discount`) || 0);

    const base = quantity * rate;
    const taxAmount = base * (tax / 100);
    const totalAfterTax = base + taxAmount;
    const discountAmount = totalAfterTax * (discount / 100);
    const finalAmount = totalAfterTax - discountAmount;

    setValue(`items.${index}.amount`, Number(finalAmount.toFixed(2)));
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const onSubmit = async (data, status) => {
    if (isSubmitting || !startSubmit()) return;
    const payload = {
      client_id: Number(data.customerName),
      ...(isInvoice
        ? {
            invoice_date: data.invoice_date,
            due_date: data.due_date,
            status: status || "unpaid",
            balance_due: Number(calculateTotal().toFixed(2)),
          }
        : {
            quotation_date: data.quoteDate,
            status: status || "draft",
          }),
      total_amount: Number(calculateTotal().toFixed(2)),
      notes: data.notes || "",
      terms: data.terms || terms,
      payment_percentage: Number(data.payment_percentage),
      payment_status: data.payment_status,
      payment_type: data.payment_type,
      services: data.items.map((item) => ({
        service_id: Number(item.serviceId),
        quantity: Number(item.quantity),
        rate: Number(item.rate),
        tax: Number(item.tax || 0),
        discount: Number(item.discount || 0),
        individual_total: Number(item.amount),
      })),
    };
    console.log(payload);
    mutation.mutate(isEditMode ? { id: document.id, data: payload } : payload, {
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
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-full">
      <div className="space-y-4">
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

        {selectedClient && (
          <div className="p-4 border rounded bg-gray-50 text-sm space-y-1 max-w-[300px]">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {selectedClient.user?.name || selectedClient.name}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {selectedClient.address}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {selectedClient.phone}
            </p>
          </div>
        )}

        {isInvoice ? (
          <>
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
              name="due_date"
              control={control}
              rules={{ required: "Due date is required" }}
              render={({ field, fieldState: { error } }) => (
                <FormField
                  id="due_date"
                  label="Due Date*"
                  type="date"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  error={error?.message}
                />
              )}
            />
          </>
        ) : (
          <Controller
            name="quoteDate"
            control={control}
            rules={{ required: "Quote date is required" }}
            render={({ field, fieldState: { error } }) => (
              <FormField
                id="quoteDate"
                label="Quote Date*"
                type="date"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                error={error?.message}
              />
            )}
          />
        )}

        <div className="mt-4">
          <span className="text-sm font-medium  text-gray-800 mb-4">
            Item Table
          </span>
          <div className="overflow-x-auto border rounded-md rounded-br-none">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left text-sm font-semibold text-gray-700">
                    ITEM DETAILS
                  </th>
                  <th className="p-2 text-right text-sm font-semibold text-gray-700 w-30">
                    QUANTITY
                  </th>
                  <th className="p-2 text-right text-sm font-semibold text-gray-700 w-30">
                    RATE
                  </th>
                  <th className="p-2 text-right text-sm font-semibold text-gray-700 w-30">
                    TAX
                  </th>
                  <th className="p-2 text-right text-sm font-semibold text-gray-700 w-30">
                    DISCOUNT
                  </th>
                  <th className="p-2 text-right text-sm font-semibold text-gray-700 w-30">
                    AMOUNT
                  </th>
                  <th className="p-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => {
                  const selectedService = watch(`items.${index}.serviceId`);
                  return (
                    <tr
                      key={field.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-2">
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
                                  (s) => Number(s.id) === serviceId
                                );
                                if (!service) return;

                                const unitPrice = Number(service.base_price);
                                setValue(`items.${index}.rate`, unitPrice);
                                setValue(
                                  `items.${index}.description`,
                                  service.description
                                );
                                setValue(`items.${index}.service`, serviceId);

                                const quantity = Number(
                                  watch(`items.${index}.quantity`) || 1
                                );
                                const tax = Number(
                                  watch(`items.${index}.tax`) || 0
                                );
                                const discount = Number(
                                  watch(`items.${index}.discount`) || 0
                                );

                                const base = quantity * unitPrice;
                                const taxAmount = base * (tax / 100);
                                const totalAfterTax = base + taxAmount;
                                const discountAmount =
                                  totalAfterTax * (discount / 100);
                                const finalAmount =
                                  totalAfterTax - discountAmount;

                                setValue(
                                  `items.${index}.amount`,
                                  Number(finalAmount.toFixed(2))
                                );
                              }}
                              error={error?.message}
                              placeholder="Select a service"
                            />
                          )}
                        />
                        {selectedService && (
                          <Textarea
                            {...register(`items.${index}.description`)}
                            placeholder="Enter service description"
                            className="mt-2 w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                            rows={2}
                            value={watch(`items.${index}.description`) || ""}
                            onChange={(e) =>
                              setValue(
                                `items.${index}.description`,
                                e.target.value
                              )
                            }
                          />
                        )}
                      </td>

                      <td className="p-2">
                        <FormField
                          type="number"
                          value={watch(`items.${index}.quantity`) ?? ""}
                          {...register(`items.${index}.quantity`, {
                            required: "Quantity is required",
                            min: {
                              value: 1,
                              message: "Quantity must be at least 1",
                            },
                            valueAsNumber: true,
                          })}
                          error={errors.items?.[index]?.quantity?.message}
                          onChange={(e) => {
                            updateItem(index, "quantity", e.target.value);
                            trigger(`items.${index}.quantity`);
                          }}
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          type="number"
                          value={watch(`items.${index}.rate`) ?? ""}
                          {...register(`items.${index}.rate`, {
                            required: "Rate is required",
                            min: {
                              value: 0,
                              message: "Rate cannot be negative",
                            },
                            valueAsNumber: true,
                          })}
                          error={errors.items?.[index]?.rate?.message}
                          onChange={(e) => {
                            updateItem(index, "rate", e.target.value);
                            trigger(`items.${index}.rate`);
                          }}
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          type="number"
                          value={watch(`items.${index}.tax`) ?? ""}
                          {...register(`items.${index}.tax`, {
                            required: "Tax is required",
                            min: {
                              value: 0,
                              message: "Tax cannot be negative",
                            },
                            max: {
                              value: 100,
                              message: "Tax cannot exceed 100%",
                            },
                            valueAsNumber: true,
                          })}
                          error={errors.items?.[index]?.tax?.message}
                          onChange={(e) => {
                            updateItem(index, "tax", e.target.value);
                            trigger(`items.${index}.tax`);
                          }}
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          type="number"
                          value={watch(`items.${index}.discount`) ?? ""}
                          {...register(`items.${index}.discount`, {
                            required: "discount is required",
                            min: {
                              value: 0,
                              message: "discount cannot be negative",
                            },
                            max: {
                              value: 100,
                              message: "discount cannot exceed 100%",
                            },
                            valueAsNumber: true,
                          })}
                          error={errors.items?.[index]?.discount?.message}
                          onChange={(e) => {
                            updateItem(index, "discount", e.target.value);
                            trigger(`items.${index}.discount`);
                          }}
                        />
                      </td>
                      <td className="p-2 text-right font-medium text-gray-900">
                        {(watch(`items.${index}.amount`) || 0).toFixed(2)}
                      </td>

                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => deleteRow(index)}
                          className="text-gray-600 hover:text-red-600 transition-colors p-1"
                          disabled={fields.length === 1}
                        >
                          <X size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Button
              type="button"
              onClick={addNewRow}
              className="flex items-center gap-2 text-white cursor-pointer text-sm font-medium mt-3"
            >
              <Plus size={18} /> Add New Row
            </Button>

            <div className="border-gray-300 md:w-[50%] w-full px-2 rounded-bl-lg rounded-br-lg border-b border-x">
              <div className="flex justify-between py-3 text-lg font-semibold">
                <span className="text-gray-800">Total ( $ )</span>
                <span className="text-gray-800">
                  {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full items-center space-between">
          <div
            className={`flex md:flex-row flex-col gap-4 items-end justify-between ${!isInvoice ? "w-full" : "w-[60%]"}`}
          >
            <div className="w-full">
              <Label htmlFor="notes" className="mb-1">
                Customer Notes
              </Label>
              <Textarea
                className=" min-h-22"
                id="notes"
                placeholder="Enter notes"
                value={watch("notes")}
                onChange={(e) => setValue("notes", e.target.value)}
              />
            </div>
          </div>
          {isInvoice && (
            <div className="w-[40%]">
              <Label htmlFor="payment" className="mb-1">
                Payment
              </Label>
              <div className="flex md:flex-row flex-col gap-4 items-end justify-between border border-gray-300 p-4 rounded-lg">
                <div className="w-full flex gap-4 items-center justify-between">
                  <Controller
                    name="payment_type"
                    control={control}
                    rules={{ required: "Payment type is required" }}
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

                  <Controller
                    name="payment_percentage"
                    control={control}
                    rules={{ required: "Amount is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <FormField
                        id="payment_percentage"
                        label="Percentage Paid"
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
                  <Controller
                    name="payment_status"
                    control={control}
                    rules={{ required: "Status is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <SelectField
                        id="payment_status"
                        label="Payment Status"
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
          )}
        </div>

        <div className="flex md:flex-row flex-col gap-4 items-start justify-between">
          <div className="w-full">
            <Label htmlFor="terms" className="mb-1">
              Terms & Conditions
            </Label>
            <Textarea
              id="terms"
              className=" min-h-20 resize-none"
              placeholder="Enter terms"
              rows={4}
              readonly
              value={watch("terms")}
              onChange={(e) => setValue("terms", e.target.value)}
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-end gap-3 mt-8">
          <Button
            onClick={cancelFunction}
            type="button"
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded font-medium text-sm hover:bg-gray-50 transition-colors"
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
                  : existingDocument?.status === "confirmed"
                    ? "confirmed"
                    : "sent"
              )
            )}
            type="button"
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
