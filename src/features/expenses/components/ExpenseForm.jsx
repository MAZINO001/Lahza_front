import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import FormField from "@/components/Form/FormField";
import SelectField from "@/components/Form/SelectField";
import CurrencySelect from "@/components/Form/CurrencySelect";
import {
  useExpense,
  useCreateExpense,
  useUpdateExpense,
} from "../hooks/useExpenses/useExpensesData";
import TextareaField from "@/components/Form/TextareaField";
import DateField from "@/components/Form/DateField";
import FileUploadField from "@/components/Form/FileUploader";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { useClients } from "@/features/clients/hooks/useClients/useClients";
import { useDocuments } from "@/features/documents/hooks/useDocuments/useDocuments";

export function ExpenseForm({
  expenseId,
  onExpenseCreated,
  isEditMode = false,
}) {
  const { data: expense, isLoading: expenseLoading } = useExpense(expenseId);
  const navigate = useNavigate();
  const { role } = useAuthContext();

  const { data: projects } = useProjects();
  const { data: clients } = useClients();
  const { data: invoices } = useDocuments("invoices");

  const AllProjects =
    projects?.map((projects) => ({
      value: String(projects?.id),
      label: projects?.name,
    })) || [];
  const AllClients =
    clients?.map((client) => ({
      value: String(client?.client?.id),
      label: client?.client?.user.name,
    })) || [];
  const AllInvoices =
    invoices?.map((invoice) => ({
      value: String(invoice?.id),
      label: invoice?.client?.user?.name,
    })) || [];

  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: expense || {
      title: "",
      description: "",
      amount: "",
      currency: "USD",
      date: "",
      project_id: "",
      client_id: "",
      invoice_id: "",
      paid_by: "",
      category: "",
      payment_method: "",
      status: "pending",
      // attachment: null,
      attachment: [],
      repeatedly: "none",
    },
  });

  useEffect(() => {
    if (expense?.id) {
      reset({
        title: expense?.title || "",
        description: expense?.description || "",
        amount: expense?.amount || "",
        currency: expense?.currency || "USD",
        date: expense?.date || "",
        project_id: Number(expense?.project_id) || "",
        client_id: Number(expense?.client_id) || "",
        invoice_id: Number(expense?.invoice_id) || "",
        paid_by: expense?.paid_by || "",
        category: expense?.category || "",
        payment_method: expense?.payment_method || "",
        status: expense?.status || "pending",
        // attachment: expense?.attachment || null,
        attachment: [],
        repeatedly: expense?.repeatedly || "none",
      });
    }
  }, [expense, reset]);

  const onSubmit = async (data) => {
    try {
      const submitData = {
        title: data?.title,
        description: data?.description,
        amount: Number(data?.amount),
        currency: data?.currency,
        date: data?.date,
        project_id: data?.project_id || null,
        client_id: data?.client_id || null,
        invoice_id: data?.invoice_id || null,
        paid_by: data?.paid_by || null,
        category: data?.category,
        // attachment: data?.attachment,
        attachment: data?.attachment?.[0],
        payment_method: data?.payment_method,
        status: data?.status,
        repeatedly: data?.repeatedly || "none",
      };

      if (isEditMode && expenseId) {
        updateMutation.mutate(
          { id: expenseId, data: submitData },
          {
            onSuccess: () => {
              navigate(`/${role}/expenses`);
            },
          },
        );
      } else {
        createMutation.mutate(submitData, {
          onSuccess: () => {
            onExpenseCreated?.();
            reset();
          },
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || expenseLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4 h-screen">
      {expenseLoading && expenseId ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-lg">Loading expense...</div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <FormField
                  id="title"
                  label="Title"
                  placeholder="e.g., Office Rent"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.title?.message}
                />
              )}
            />

            <Controller
              name="amount"
              control={control}
              rules={{ required: "Amount is required" }}
              render={({ field }) => (
                <FormField
                  id="amount"
                  label="Amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.amount?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="date"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DateField
                  id="date"
                  label="Date"
                  type="date"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.date?.message}
                />
              )}
            />

            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <CurrencySelect
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.currency?.message}
                />
              )}
            />
          </div>

          <div className="w-full flex gap-4 h-full">
            <div className="w-1/2 flex flex-col min-h-0">
              <Controller
                name="attachment"
                control={control}
                render={({ field }) => (
                  <FileUploadField
                    id="attachment"
                    label="attachment"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.invoice_id?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-1/2 flex flex-col min-h-0">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextareaField
                    id="description"
                    label="Description"
                    placeholder="Optional description..."
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.description?.message}
                    className="flex-1 flex flex-col"
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Category"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "Office", label: "Office" },
                    { value: "Software", label: "Software" },
                    { value: "Meals", label: "Meals" },
                    { value: "Travel", label: "Travel" },
                    { value: "Supplies", label: "Supplies" },
                    { value: "Marketing", label: "Marketing" },
                    { value: "Utilities", label: "Utilities" },
                    { value: "Other", label: "Other" },
                  ]}
                  error={errors.category?.message}
                />
              )}
            />

            <Controller
              name="payment_method"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Payment Method"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "Cash", label: "Cash" },
                    { value: "Credit Card", label: "Credit Card" },
                    { value: "Bank Transfer", label: "Bank Transfer" },
                    { value: "Company Card", label: "Company Card" },
                    { value: "Check", label: "Check" },
                    { value: "Other", label: "Other" },
                  ]}
                  error={errors.payment_method?.message}
                />
              )}
            />
          </div>

          {/* Status and Repeatedly */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Status"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "pending", label: "Pending" },
                    { value: "approved", label: "Approved" },
                    { value: "reimbursed", label: "Reimbursed" },
                    { value: "paid", label: "Paid" },
                  ]}
                  error={errors.status?.message}
                />
              )}
            />

            <Controller
              name="repeatedly"
              control={control}
              rules={{ required: "Frequency is required" }}
              render={({ field }) => (
                <SelectField
                  label="Repeats"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "none", label: "None" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                    { value: "yearly", label: "Yearly" },
                  ]}
                  error={errors.repeatedly?.message}
                />
              )}
            />
          </div>

          {/* Relations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="project_id"
              control={control}
              render={({ field }) => (
                <SelectField
                  id="project_id"
                  label="Project ID"
                  type="text"
                  placeholder="Enter Project ID"
                  options={
                    AllProjects.length
                      ? AllProjects
                      : [{ value: "", label: "No Projects available" }]
                  }
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.project_id?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="client_id"
              control={control}
              render={({ field }) => (
                <SelectField
                  id="client_id"
                  label="Client ID"
                  type="text"
                  placeholder="Enter Client ID"
                  options={
                    AllClients.length
                      ? AllClients
                      : [{ value: "", label: "No Clients available" }]
                  }
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.client_id?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="invoice_id"
              control={control}
              render={({ field }) => (
                <SelectField
                  id="invoice_id"
                  label="Invoice ID"
                  type="text"
                  placeholder="Enter Invoice ID"
                  options={
                    AllInvoices.length
                      ? AllInvoices
                      : [{ value: "", label: "No Invoices available" }]
                  }
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.invoice_id?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              onClick={() => navigate(`/${role}/expenses`)}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Processing..."
                : isEditMode
                  ? "Update Expense"
                  : "Create Expense"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
