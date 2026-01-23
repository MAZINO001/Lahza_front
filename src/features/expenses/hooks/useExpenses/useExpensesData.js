// src/features/expenses/hooks/useExpenses/useExpensesData.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiExpense = {
    getAll: () => api.get(`${API_URL}/expenses`).then(res => res.data ?? []),
    getById: (id) => api.get(`${API_URL}/expenses/${id}`).then(res => res.data?.expense ?? res.data ?? null),
    create: (data) => api.post(`${API_URL}/expenses`, data),
    update: (id, data) => api.put(`${API_URL}/expenses/${id}`, data),
    delete: (id) => api.delete(`${API_URL}/expenses/${id}`),
};

export function useExpenses() {
    return useQuery({
        queryKey: ["expenses"],
        queryFn: apiExpense.getAll,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch expenses");
        },
    });
}

export function useExpense(id) {
    return useQuery({
        queryKey: ["expenses", id],
        queryFn: () => apiExpense.getById(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch expense");
        },
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiExpense.create,
        onSuccess: () => {
            toast.success("Expense created successfully!");
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
        refetchOnWindowFocus: true,
        onError: (error) => toast.error(error?.response?.data?.message || "Failed to create expense"),
    });
}

export function useUpdateExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiExpense.update(id, data),
        onSuccess: () => {
            toast.success("Expense updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
        refetchOnWindowFocus: true,
        onError: () => toast.error("Failed to update expense"),
    });
}

export function useDeleteExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiExpense.delete,
        onSuccess: () => {
            toast.success("Expense deleted");
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
        refetchOnWindowFocus: true,
        onError: () => toast.error("Failed to delete expense"),
    });
}
