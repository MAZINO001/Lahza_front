/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import FormField from "@/Components/Form/FormField";
import { Textarea } from "@/components/ui/textarea";
import SelectField from "@/Components/comp-192";
import { Label } from "@/components/ui/label";
import ServiceSelect from "@/Components/Invoice_Quotes/ServiceSelector";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { terms } from "../../lib/Terms_Conditions.json";
import api from "@/utils/axios";
import { useAuthContext } from "@/hooks/AuthContext";
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

  useEffect(() => {
    if (!invoiceId) return;

    const fetchInvoices = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_BACKEND_URL}/invoices/${invoiceId}`
        );

        const data = res.data;
        setInvoiceData(data);
        console.log(data);
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
      }
    };

    fetchInvoices();
  }, [invoiceId]);

  const clientOptions = clients.map((c) => ({
    name: c.name || c.user?.name,
    id: c.id,
  }));
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
        console.log(res.data);
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
  });

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

  const onSubmit = async (data, status) => {
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

      // Check if we're editing (invoiceId exists) or creating new
      if (invoiceId) {
        // UPDATE existing invoice
        req = await api.put(
          `${import.meta.env.VITE_BACKEND_URL}/invoices/${invoiceId}`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        alert("Invoice updated successfully!");
      } else {
        // CREATE new invoice
        req = await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/invoices`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        // const newInvoiceId = req.data.invoice_id;
        // console.log(req);
        // await api.post(`${import.meta.env.VITE_BACKEND_URL}/email/send`, {
        //   email: "marnissimounir05@gmail.com",
        //   type: "invoice",
        //   id: newInvoiceId,
        //   subject: "Your Invoice from LAHZA HM",
        //   message:
        //     "Thanks for your business! Please find the invoice attached.",
        // });

        alert("Invoice created successfully!");
      }

      console.log(payload);
      reset();
      navigate(`/${role}/invoices`);
    } catch (error) {
      console.log(payload);
      console.error("Error details:", error.response?.data || error);
      alert(
        `Failed to ${invoiceId ? "update" : "create"} invoice: ${
          error.response?.data?.message || error.message
        }`
      );
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
        <SelectField
          label="Customer"
          items={clientOptions}
          value={selectedClient}
          onChange={(val) => {
            setSelectedClient(val);
            setValue("customerName", val);
          }}
          placeholder="Select or add a customer"
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

        <FormField
          id="invoiceId"
          label="Invoice#"
          readonly
          value={watch("invoiceId")}
          disabled
        />
        <FormField
          id="invoice_date"
          label="Invoice Date*"
          {...register("invoice_date")}
          type="date"
          value={watch("invoice_date")}
          onChange={(e) => setValue("invoice_date", e.target.value)}
        />
        <FormField
          id="due_date"
          label="Due Date*"
          type="date"
          {...register("due_date")}
          value={watch("due_date")}
          onChange={(e) => setValue("due_date", e.target.value)}
        />

        {/* Item Table */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Item Table
          </h2>
          <div className="overflow-x-auto border rounded-md rounded-br-none">
            <table className="w-full min-w-[500px] border-collapse border border-gray-300">
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
                        <ServiceSelect
                          services={Services}
                          value={selectedService}
                          onChange={(val) => {
                            val = Number(val); // ensure numeric
                            setValue(`items.${index}.service`, val);
                            setValue(`items.${index}.serviceId`, val); // ADDED: Set serviceId too

                            const service = Services.find(
                              (s) => Number(s.id) === val
                            );
                            if (!service) return;

                            const unitPrice = Number(service.base_price);

                            // REMOVED: setValue(`items.${index}.id`, service.id);
                            setValue(`items.${index}.rate`, unitPrice);
                            setValue(
                              `items.${index}.description`,
                              service.description
                            );

                            const quantity = Number(
                              watch(`items.${index}.quantity`) ?? 1
                            );
                            const tax = Number(
                              watch(`items.${index}.tax`) ?? 0
                            );
                            const discount = Number(
                              watch(`items.${index}.discount`) ?? 0
                            );

                            const base = quantity * unitPrice;
                            const taxAmount = base * (tax / 100);
                            const totalAfterTax = base + taxAmount;
                            const discountAmount =
                              totalAfterTax * (discount / 100);
                            const finalAmount = totalAfterTax - discountAmount;

                            setValue(
                              `items.${index}.amount`,
                              Number(finalAmount.toFixed(2))
                            );
                          }}
                          placeholder="Select a service"
                        />

                        {selectedService && (
                          <Textarea
                            // {...register(`items.${index}.description`)}
                            placeholder="Enter service description"
                            className="mt-2 w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                            rows={2}
                          />
                        )}
                      </td>

                      <td className="p-2">
                        <FormField
                          type="number"
                          value={watch(`items.${index}.quantity`) ?? 0}
                          onChange={(e) =>
                            updateItem(index, "quantity", e.target.value)
                          }
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          type="number"
                          value={watch(`items.${index}.rate`) ?? 0}
                          onChange={(e) =>
                            updateItem(index, "rate", e.target.value)
                          }
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          type="number"
                          value={watch(`items.${index}.tax`) ?? 0}
                          onChange={(e) =>
                            updateItem(index, "tax", e.target.value)
                          }
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          type="number"
                          value={watch(`items.${index}.discount`) ?? 0}
                          onChange={(e) =>
                            updateItem(index, "discount", e.target.value)
                          }
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
