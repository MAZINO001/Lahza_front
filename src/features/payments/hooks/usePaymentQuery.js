// src/features/payments/hooks/usePayments.ts
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Pure API functions
const apiPayments = {
    getAll: () => api.get(`${API_URL}/payments`).then((res) => res.data ?? []),
    getById: (id) =>
        api.get(`${API_URL}/payments/${id}`).then((res) => res.data?.payment ?? res.data ?? null),
    create: (data) => api.post(`${API_URL}/payments`, data),
    update: (id, data) => api.put(`${API_URL}/payments/${id}`, data),
    delete: (id) => api.delete(`${API_URL}/payments/${id}`),
};

export function usePayments() {
    return useQuery({
        queryKey: ["payments"],
        queryFn: apiPayments.getAll,
        staleTime: 5 * 60 * 1000,
    });
}

export function usePayment(id) {
    return useQuery({
        queryKey: ["payments", id],
        queryFn: () => apiPayments.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreatePayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiPayments.create,
        onSuccess: () => {
            toast.success("Payment created!");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
}

export function useUpdatePayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiPayments.update(id, data),
        onSuccess: () => {
            toast.success("Payment updated!");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
}

export function useDeletePayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiPayments.delete,
        onSuccess: () => {
            toast.success("Payment deleted");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
}