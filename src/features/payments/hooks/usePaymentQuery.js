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

    cancel: (id) => api.put(`${API_URL}/cancelPayment/${id}`),
    updatePaymentDate: (id, paid_at) => api.put(`${API_URL}/payment/date/${id}`, { updated_at: paid_at })

};

export function usePayments() {
    return useQuery({
        queryKey: ["payments"],
        queryFn: apiPayments.getAll,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch payments");
        },
    });
}

export function usePayment(id) {
    return useQuery({
        queryKey: ["payments", id],
        queryFn: () => apiPayments.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch payment");
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
        refetchOnWindowFocus: true,
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
        refetchOnWindowFocus: true,
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
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete payment");
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
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create additional payment");
        },
        refetchOnWindowFocus: true,

    });
}
export function useConfirmPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiPayments.confirm(id),
        onSuccess: () => {
            toast.success("Payment Confirmed");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        refetchOnWindowFocus: true,
        onError: (err) => {
            console.error("Confirm payment failed:", err);
            toast.error("Failed to confirm payment");
        },
    });
}
export function useCancelPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiPayments.cancel(id),
        onSuccess: () => {
            toast.success("Payment Canceled");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        refetchOnWindowFocus: true,
        onError: (err) => {
            console.error("Cancel payment failed:", err);
            toast.error("Failed to Cancel payment");
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
            toast.success("Payment Date Updated");
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        refetchOnWindowFocus: true,
        onError: (err) => {
            console.error("Payment Date Update failed:", err);
            toast.error("Failed to update Payment Date");
        },
    });
}
