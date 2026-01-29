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
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch offers");
        },
    });
}

export function useOffer(id) {
    return useQuery({
        queryKey: ["offers", id],
        queryFn: () => apiOffer.getById(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch offer");
        },
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
        refetchOnWindowFocus: true,
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
        refetchOnWindowFocus: true,
        onError: () => toast.error("Failed to update offer"),
    });
}

export function useDeleteOffer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiOffer.delete,
        onMutate: async (id) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["offers"] });

            // Snapshot the previous value
            const previousOffers = queryClient.getQueryData(["offers"]);

            // Optimistically remove the offer from the cache
            queryClient.setQueryData(["offers"], (old) =>
                old?.filter(offer => offer.id !== id) || []
            );

            return { previousOffers };
        },
        onError: (error, id, context) => {
            // If the mutation fails, roll back to the previous value
            if (context?.previousOffers) {
                queryClient.setQueryData(["offers"], context.previousOffers);
            }
            toast.error("Failed to delete offer");
        },
        onSuccess: () => {
            toast.success("Offer deleted");
            // No need to invalidate since optimistic update already removed it
        },
    });
}