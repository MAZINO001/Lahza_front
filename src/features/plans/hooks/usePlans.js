// src/features/plans/hooks/usePlans.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export function usePlans(packId) {
    return useQuery({
        queryKey: ["plans", packId],
        queryFn: async () => {
            const params = packId ? { pack_id: packId } : {};
            const res = await api.get(`${API_URL}/plans`, { params });

            // Handle the actual API response structure
            // Response has: { data: [...], current_page: 1, total: 1, ... }
            return res.data?.data || [];
        },
        enabled: true, // Always enabled, works with or without packId
        staleTime: 4 * 60 * 1000,
    });
}

export function usePlan(planId) {
    return useQuery({
        queryKey: ["plan", planId],
        queryFn: async () => {
            if (!planId) return null;
            const res = await api.get(`${API_URL}/plans/${planId}`);
            return res.data?.plan || res.data || null;
        },
        enabled: !!planId,
        staleTime: 3 * 60 * 1000,
    });
}

export function useCreatePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await api.post(`${API_URL}/plans`, data);
            return res.data;
        },
        onSuccess: (responseData) => {
            toast.success("Plan created successfully");
            queryClient.invalidateQueries({ queryKey: ["plans"] });

            // Optional: invalidate plans for this specific pack
            const packId = responseData?.plan?.pack_id;
            if (packId) {
                queryClient.invalidateQueries({ queryKey: ["plans", packId] });
            }
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not create plan";
            toast.error(msg);
            console.error("Create plan failed:", error);
        },
    });
}

// ────────────────────────────────────────────────
// Optional: if you later want separate price / field mutations
// ────────────────────────────────────────────────

export function useAddPlanPrice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, ...priceData }) => {
            const res = await api.post(`${API_URL}/plans/${planId}/prices`, priceData);
            return res.data;
        },
        onSuccess: (_, { planId }) => {
            queryClient.invalidateQueries({ queryKey: ["plan", planId] });
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
    });
}

export function useDeletePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (planId) => {
            await api.delete(`${API_URL}/plans/${planId}`);
        },
        onSuccess: (_, planId) => {
            toast.success("Plan deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["plans"] });
            queryClient.removeQueries({ queryKey: ["plan", planId] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not delete plan";
            toast.error(msg);
        },
    });
}

export function useAddCustomField() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, ...fieldData }) => {
            const res = await api.post(`${API_URL}/plans/${planId}/custom-fields`, fieldData);
            return res.data;
        },
        onSuccess: (_, { planId }) => {
            queryClient.invalidateQueries({ queryKey: ["plan", planId] });
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
    });
}