/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import FormField from "@/Components/Form/FormField";
import { Textarea } from "@/components/ui/textarea";
import SelectField from "@/Components/Form/SelectField";
import { Label } from "@/components/ui/label";
import ServiceSelect from "@/Components/Invoice_Quotes/ServiceSelector";
import { useLocation, useNavigate } from "react-router-dom";
import { terms } from "../../lib/Terms_Conditions.json";
import api from "@/utils/axios";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import { useLoading } from "@/hooks/LoadingContext";
export default function InvoiceForm() {
  const [selectedClient, setSelectedClient] = useState("");
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [InvoiceData, setInvoiceData] = useState({});
  const [Services, setServices] = useState([]);
  const navigate = useNavigate();
  const { role } = useAuthContext();

  const location = useLocation();
  const invoiceId = location.state?.invoiceId;
  const { show: showLoading, hide: hideLoading } = useLoading();
  useEffect(() => {
    if (!invoiceId) return;

    const fetchInvoices = async () => {
      showLoading();
      try {
        const res = await api.get(
          `${import.meta.env.VITE_BACKEND_URL}/invoices/${invoiceId}`
        );

        const data = res.data;
        setInvoiceData(data);
        reset({
          customerName: Number(data.client_id),
          invoiceId: data.id,
          invoice_date: data.invoice_date,
          due_date: data.due_date,
          total_amount: data.total_amount,
          balance_due: data.balance_due,
          quote_id: data.quote_id,
          notes: data.notes || "",
          terms: terms,
          items: data.invoice_services.map((qs) => ({
            service: Number(qs.service_id),
            serviceId: Number(qs.service_id),
            description: qs.description || "",
            quantity: qs.quantity,
            rate: parseFloat(qs.individual_total) / qs.quantity,
            tax: parseFloat(qs.tax),
            discount: 0,
            amount: parseFloat(qs.individual_total),
          })),
          discountValue: 0,
          discountType: "%",
        });

        setSelectedClient(Number(data.client_id));
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
      } finally {
        hideLoading();
      }
    };

    fetchInvoices();
  }, [invoiceId]);

  const clientOptions = clients.map((c) => ({
    label: c.name || c.user?.name || "Unknown Client",
    value: c.id.toString(), // or keep as number if you prefer
    // optional: keep full client object for later use
    client: c,
  }));
  console.log(clientOptions);
  const customerData = clients.find(
    (c) => String(c.id) === String(selectedClient)
  );

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `${import.meta.env.VITE_BACKEND_URL}/clients`
        );
        setClients(res.data);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_BACKEND_URL}/services`
        );
        setServices(res.data);
      } catch (error) {
        console.error("Error details:", error.response?.data || error);
        alert(
          `Failed to get services ): ${error.response?.data?.message || error.message}`
        );
      }
    };

    fetchData();
  }, []);

  const cancelFunction = () => {
    reset();
    navigate(`/${role}/invoices`);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      customerName: "",
      invoiceId: "001",
      invoice_date: new Date().toISOString().split("T")[0],
      due_date: new Date().toISOString().split("T")[0],
      notes: "",
      total_amount: 0,
      balance_due: 0,
      terms: terms,
      items: [
        {
          service: "",
          serviceId: null,
          description: "",
          quantity: 1,
          rate: 0,
          tax: 0,
          discount: 0,
          amount: 0,
        },
      ],
      discountValue: 0,
      discountType: "%",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  console.log(errors);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const discountType = watch("discountType") || "%";
  const discountValue = watch("discountValue") || 0;

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
    if (fields.length > 1) remove(index);
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

  const calculateSubTotal = () =>
    items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const calculateDiscount = () => {
    const value = Number(discountValue) || 0;
    if (discountType === "%") {
      return (calculateSubTotal() * value) / 100;
    }
    return value;
  };

  const calculateTotal = () => calculateSubTotal() - calculateDiscount();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const onSubmit = async (data, status) => {
    if (!startSubmit()) return;
    const statusToSend = status ?? InvoiceData?.status ?? "unpaid";
    const payload = {
      client_id: parseInt(data.customerName),
      invoice_date: data.invoice_date,
      due_date: data.due_date,
      balance_due: 0,
      status: statusToSend,
      total_amount: parseFloat(
        data.items
          .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
          .toFixed(2)
      ),
      quote_id: null,
      services: data.items.map((item) => ({
        service_id: Number(item.serviceId),
        quantity: parseInt(item.quantity),
        rate: parseFloat(item.rate),
        tax: parseFloat(item.tax || 0),
        discount: parseFloat(item.discount || 0),
        individual_total: parseFloat(item.amount),
      })),
      notes: data.notes || "",
    };

    try {
      let req;
      if (invoiceId) {
        req = await api.put(
          `${import.meta.env.VITE_BACKEND_URL}/invoices/${invoiceId}`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        alert("Invoice updated successfully!");
      } else {
        req = await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/invoices`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        alert("Invoice created successfully!");
      }

      reset();
      navigate(`/${role}/invoices`);
    } catch (error) {
      console.error("Error details:", error.response?.data || error);
      alert(
        `Failed to ${invoiceId ? "update" : "create"} invoice: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      endSubmit();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    // <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:w-[60%] w-full">
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        {invoiceId ? "Edit Invoice" : "New Invoice"}
      </h1>

      <div className="space-y-4">
        <Controller
          name="customerName"
          control={control}
          rules={{ required: "Please select a customer" }}
          render={({
            field,
            fieldState: { error, invalid, isTouched, isDirty },
          }) => (
            <SelectField
              label="Customer"
              options={clientOptions}
              value={field.value || ""}
              onChange={(val) => {
                field.onChange(val);
                setSelectedClient(val); // your local UI state (optional)
              }}
              onBlur={field.onBlur} // correct touched behavior
              error={error?.message}
              // you can even use invalid/isTouched if you want red border only after blur
              placeholder="Select or add a customer"
            />
          )}
        />
        {customerData && (
          <div className="p-4 border rounded bg-gray-50 text-sm space-y-1 max-w-[300px]">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {customerData.user?.name || customerData.name}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {customerData.address}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {customerData.phone}
            </p>
          </div>
        )}

        <Controller
          name="invoiceId"
          control={control}
          render={({ field }) => (
            <FormField
              id="invoiceId"
              label="Invoice#"
              readonly
              disabled
              {...field}
            />
          )}
        />

        <Controller
          name="invoice_date"
          control={control}
          rules={{ required: "Invoice date is required" }}
          render={({ field }) => (
            <FormField
              id="invoice_date"
              label="Invoice Date*"
              type="date"
              error={errors.invoice_date?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="due_date"
          control={control}
          rules={{ required: "Due date is required" }}
          render={({ field }) => (
            <FormField
              id="due_date"
              label="Due Date*"
              type="date"
              error={errors.due_date?.message}
              {...field}
            />
          )}
        />
        {/* Item Table */}
        <div className="mt-4">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Item Table
          </h2>
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
                              services={Services}
                              value={field.value || ""} // ← always in sync
                              onChange={(val) => {
                                const serviceId = Number(val);

                                // 1. Update RHF (this auto-triggers validation!)
                                field.onChange(serviceId);

                                // 2. Now safely do all your side effects
                                const service = Services.find(
                                  (s) => Number(s.id) === serviceId
                                );
                                if (!service) return;

                                const unitPrice = Number(service.base_price);

                                setValue(`items.${index}.rate`, unitPrice);
                                setValue(
                                  `items.${index}.description`,
                                  service.description
                                );
                                setValue(`items.${index}.service`, serviceId); // if you store both

                                // Recalculate total
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

        {/* Notes & Totals */}
        <div className="flex md:flex-row flex-col gap-4 items-end justify-between">
          <div className="w-full">
            <Label htmlFor="notes" className="mb-1">
              Customer Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Enter notes"
              value={watch("notes")}
              onChange={(e) => setValue("notes", e.target.value)}
            />
          </div>
        </div>

        {/* Terms & Attach File */}
        <div className="flex md:flex-row flex-col gap-4 items-start justify-between">
          <div className="w-full">
            <Label htmlFor="terms" className="mb-1">
              Terms & Conditions
            </Label>
            <Textarea
              id="terms"
              placeholder="Enter terms"
              rows={4}
              value={watch("terms")}
              onChange={(e) => setValue("terms", e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex md:flex-row flex-col justify-end gap-3 mt-8">
          <Button
            onClick={cancelFunction}
            type="button"
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit((data) => onSubmit(data, "draft"))()}
            type="button"
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Save as Draft
          </Button>

          <Button
            onClick={() => handleSubmit((data) => onSubmit(data, "sent"))()}
            type="button"
          >
            Save and Send
          </Button>
        </div>
      </div>
    </form>
  );
}
