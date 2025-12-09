// src/features/payments/hooks/usePayments.ts
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Pure API functions
const apiPayments = {
    getAll: () => api.get(`${API_URL}/payments`).then((res) => {
        console.log("API Response from getAll payments:", res.data);
        return res.data ?? [];
    }),
    getById: (id) =>
        api.get(`${API_URL}/payments/${id}`).then((res) => res.data?.payment ?? res.data ?? null),
    create: (data) => api.post(`${API_URL}/payments`, data),
    update: (id, data) => {
        console.log("API update call - ID:", id, "Data:", data);
        return api.put(`${API_URL}/payments/${id}`, data);
    },
    delete: (id) => api.delete(`${API_URL}/payments/${id}`),

    confirm: (id) => api.put(`${API_URL}/validatePayments/${id}`),
};

export function usePayments() {
    return useQuery({
        queryKey: ["payments"],
        queryFn: apiPayments.getAll,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
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
        mutationFn: ({ id, data }) => {
            console.log("Mutation called with ID:", id, "Data:", data);
            return apiPayments.update(id, data);
        },
        onSuccess: (response) => {
            console.log("Update successful - Response:", response);
            toast.success("Payment updated!");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        onError: (error) => {
            console.error("Update failed - Error:", error);
            console.error("Error response:", error.response?.data);
            toast.error("Failed to update payment");
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

export function CreateAdditionalPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiPayments.additional,
        onSuccess: () => {
            toast.success("additional Payment created");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
}
export function useConfirmPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiPayments.confirm(id), // make sure id is passed
        onSuccess: () => {
            toast.success("Payment Confirmed");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        onError: (err) => {
            console.error("Confirm payment failed:", err);
            toast.error("Failed to confirm payment");
        },
    });
}