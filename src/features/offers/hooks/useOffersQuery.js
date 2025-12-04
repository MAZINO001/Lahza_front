// src/features/offers/hooks/useOffers.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiOffer = {
    getAll: () => api.get(`${API_URL}/offers`).then(res => res.data ?? []),
    getById: (id) => api.get(`${API_URL}/offers/${id}`).then(res => res.data?.offer ?? res.data ?? null),
    create: (data) => api.post(`${API_URL}/offers`, data),
    update: (id, data) => api.put(`${API_URL}/offers/${id}`, data),
    delete: (id) => api.delete(`${API_URL}/offers/${id}`),
};

export function useOffers() {
    return useQuery({
        queryKey: ["offers"],
        queryFn: apiOffer.getAll,
        staleTime: 5 * 60 * 1000,
    });
}

export function useOffer(id) {
    return useQuery({
        queryKey: ["offers", id],
        queryFn: () => apiOffer.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateOffer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiOffer.create,
        onSuccess: () => {
            toast.success("Offer created successfully!");
            queryClient.invalidateQueries({ queryKey: ["offers"] });
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Failed to create offer"),
    });
}

export function useUpdateOffer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiOffer.update(id, data),
        onSuccess: () => {
            toast.success("Offer updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            queryClient.invalidateQueries({ queryKey: ["offers"] });
        },
        onError: () => toast.error("Failed to update offer"),
    });
}

export function useDeleteOffer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiOffer.delete,
        onSuccess: () => {
            toast.success("Offer deleted");
            queryClient.invalidateQueries({ queryKey: ["offers"] });
        },
        onError: () => toast.error("Failed to delete offer"),
    });
}