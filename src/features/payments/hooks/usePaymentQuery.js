// src/features/payments/hooks/usePayments.ts
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiPayments = {
    getAll: () => api.get(`${API_URL}/payments`).then((res) => {
        console.log("API Response from getAll payments:", res.data);
        return res.data ?? [];
    }),
    getById: (id) =>
        api.get(`${API_URL}/payments/${id}`).then((res) => res.data?.payment ?? res.data ?? null),
    create: (data) => api.post(`${API_URL}/payments`, data).then((res) => res.data),
    update: (id, data) => {
        console.log("API update call - ID:", id, "Data:", data);
        return api.put(`${API_URL}/payments/${id}`, data).then((res) => res.data);
    },
    delete: (id) => api.delete(`${API_URL}/payments/${id}`).then((res) => res.data),
    confirm: (id) => api.put(`${API_URL}/validatePayments/${id}`).then((res) => res.data),
    cancel: (id) => api.put(`${API_URL}/cancelPayment/${id}`).then((res) => res.data),
    updatePaymentDate: (id, paid_at) =>
        api.put(`${API_URL}/payment/date/${id}`, { updated_at: paid_at }).then((res) => res.data),
    getTransactionByProject: (id) =>
        api.get(`${API_URL}/payments/project/${id}`).then((res) => res.data?.payment ?? res.data ?? null),
    additional: (data) => api.post(`${API_URL}/additional-payment`, data).then((res) => res.data),
};

export function usePayments() {
    return useQuery({
        queryKey: ["payments"],
        queryFn: apiPayments.getAll,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch payments");
        },
    });
}

export function usePayment(id) {
    return useQuery({
        queryKey: ["payment", id],
        queryFn: () => apiPayments.getById(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch payment");
        },
    });
}

export function useTransActions(id) {
    return useQuery({
        queryKey: ["transactions", id],
        queryFn: () => apiPayments.getTransactionByProject(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch transactions");
        },
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
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create payment");
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
        onSuccess: (response, { id }) => {
            console.log("Update successful - Response:", response);
            toast.success("Payment updated!");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["payment", id] });
        },
        onError: (error) => {
            console.error("Update failed - Error:", error);
            console.error("Error response:", error.response?.data);
            toast.error(error?.response?.data?.message || "Failed to update payment");
        },
    });
}

export function useDeletePayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiPayments.delete(id),
        onSuccess: (response, id) => {
            toast.success("Payment deleted");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.removeQueries({ queryKey: ["payment", id] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete payment");
        },
    });
}

export function useCreateAdditionalPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiPayments.additional,
        onSuccess: () => {
            toast.success("Additional payment created");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create additional payment");
        },
    });
}

export function useConfirmPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiPayments.confirm(id),
        onSuccess: () => {
            toast.success("Payment confirmed");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        onError: (err) => {
            console.error("Confirm payment failed:", err);
            toast.error(err?.response?.data?.message || "Failed to confirm payment");
        },
    });
}

export function useCancelPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiPayments.cancel(id),
        onSuccess: () => {
            toast.success("Payment canceled");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        onError: (err) => {
            console.error("Cancel payment failed:", err);
            toast.error(err?.response?.data?.message || "Failed to cancel payment");
        },
    });
}

export function useUpdatePaymentDate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, paid_at }) => {
            console.log("Mutation called with ID:", id, "Paid At:", paid_at);
            return apiPayments.updatePaymentDate(id, paid_at);
        },
        onSuccess: () => {
            toast.success("Payment date updated");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        onError: (err) => {
            console.error("Payment date update failed:", err);
            toast.error(err?.response?.data?.message || "Failed to update payment date");
        },
    });
}