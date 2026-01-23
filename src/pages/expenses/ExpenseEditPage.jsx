import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import FormSection from "@/Components/Form/FormSection";
import FormField from "@/Components/Form/FormField";
import {
    useExpense,
    useUpdateExpense,
} from "@/features/expenses/hooks/useExpenses/useExpensesData";

export default function ExpenseEditPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const expenseId = state?.expenseId;
    const { role } = useAuthContext();
    const [submitting, setSubmitting] = useState(false);
    const { data: data, isLoading } = useExpense(expenseId);
    const updateExpenseMutation = useUpdateExpense();

    const {
        handleSubmit,
        watch,
        setValue,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: data?.expense.title || "",
            amount: data?.expense.amount || "",
            category: data?.expense.category || "",
            date: data?.expense.date || "",
            description: data?.expense.description || "",
            status: data?.expense.status || "",
        },
    });

    useEffect(() => {
        if (data) {
            reset({
                title: data?.expense.title || "",
                amount: data?.expense.amount || "",
                category: data?.expense.category || "",
                date: data?.expense.date || "",
                description: data?.expense.description || "",
                status: data?.expense.status || "",
            });
        }
    }, [data, reset]);

    const onSubmit = (data) => {
        setSubmitting(true);

        const submitData = {
            title: data.title || "",
            amount: data.amount || "",
            category: data.category || "",
            date: data.date || "",
            description: data.description || "",
            status: data.status || "",
        };

        updateExpenseMutation.mutate(
            { id: expenseId, data: submitData },
            {
                onSuccess: () => {
                    setSubmitting(false);
                    navigate(`/${role}/expenses`);
                },
                onError: (error) => {
                    setSubmitting(false);
                    console.error("Update failed:", error);
                },
            },
        );
    };

    const handleCancel = () => {
        navigate(`/${role}/expenses`);
    };

    if (isLoading || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4 h-screen">
            <FormSection title="Update Expense Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        name="title"
                        control={control}
                        rules={{ required: "Title is required" }}
                        render={({ field }) => (
                            <FormField
                                id="title"
                                label="Title"
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
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.amount?.message}
                            />
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        name="category"
                        control={control}
                        rules={{ required: "Category is required" }}
                        render={({ field }) => (
                            <FormField
                                id="category"
                                label="Category"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.category?.message}
                            />
                        )}
                    />

                    <Controller
                        name="date"
                        control={control}
                        rules={{ required: "Date is required" }}
                        render={({ field }) => (
                            <FormField
                                id="date"
                                label="Date"
                                type="date"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.date?.message}
                            />
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: "Status is required" }}
                        render={({ field }) => (
                            <FormField
                                id="status"
                                label="Status"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.status?.message}
                            />
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <FormField
                                id="description"
                                label="Description"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.description?.message}
                            />
                        )}
                    />
                </div>
            </FormSection>

            <div className="flex justify-end gap-4 pt-4">
                <Button
                    type="button"
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full md:w-auto"
                    disabled={submitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Updating..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
