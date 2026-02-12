// src/features/plans/hooks/usePlans.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/queryKeys";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export function usePlans(packId) {
    const queryKey = packId ? QUERY_KEYS.plansByPack(packId) : QUERY_KEYS.plans;

    return useQuery({
        queryKey,
        queryFn: async () => {
            const params = packId ? { pack_id: packId } : {};
            const res = await api.get(`${API_URL}/plans`, { params });

            return res.data || [];
        },
        enabled: true, // Always enabled, works with or without packId
        staleTime: 4 * 60 * 1000,
    });
}

export function usePlan(planId) {
    return useQuery({
        queryKey: QUERY_KEYS.plan(planId),
        queryFn: async () => {
            if (!planId) return null;
            const res = await api.get(`${API_URL}/plans/${planId}`);
            // Handle both single plan response and paginated response
            return res.data?.data || res.data?.plan || res.data || null;
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
        onMutate: async () => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.plans] });
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.packs] });
        },
        onSuccess: (responseData) => {
            toast.success("Plan created successfully");

            // Invalidate to get fresh data from server
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });

            // Also invalidate packs to refresh plan counts
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.packs] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.packs, { activeOnly: true }] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.packs, { activeOnly: false }] });

            // IMPORTANT: Invalidate plans for this specific pack
            const packId = responseData?.plan?.pack_id;
            if (packId) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plansByPack(packId) });
            }
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not create plan";
            toast.error(msg);
            console.error("Create plan failed:", error);
        },
    });
}

export function useDeletePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (planId) => {
            await api.delete(`${API_URL}/plans/${planId}`);
            return planId;
        },
        onMutate: async (planId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.plans] });
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.packs] });

            // Get the plan data to find its pack_id
            const planData = queryClient.getQueryData(QUERY_KEYS.plan(planId));
            return { planId, packId: planData?.pack_id };
        },
        onSuccess: (_, variables) => {
            toast.success("Plan deleted successfully");
            // Ensure data is fresh from server
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.packs] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.packs, { activeOnly: true }] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.packs, { activeOnly: false }] });

            // IMPORTANT: Invalidate plans for the specific pack this plan belonged to
            if (variables.packId) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plansByPack(variables.packId) });
            }

            // Also invalidate subscriptions to get fresh data
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.subscriptions] });
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

export function useUpdatePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...data }) => {
            const res = await api.put(`${API_URL}/plans/${id}`, data);
            return { ...res.data, pack_id: data.pack_id };
        },
        onMutate: async ({ id, ...data }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.plans] });
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.packs] });

            return { packId: data.pack_id };
        },
        onSuccess: (_, variables) => {
            toast.success("Plan updated");
            // Invalidate to get fresh data from server
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.packs] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.packs, { activeOnly: true }] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.packs, { activeOnly: false }] });

            // IMPORTANT: Invalidate plans for the specific pack this plan belongs to
            if (variables.packId) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plansByPack(variables.packId) });
            }

            // Also invalidate subscriptions to get fresh data
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.subscriptions] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not update plan";
            toast.error(msg);
        },
    });
}

export function useUpdatePlanPrice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, priceId, ...priceData }) => {
            const res = await api.put(`${API_URL}/plans/${planId}/prices/${priceId}`, priceData);
            return res.data;
        },
        onSuccess: (_, { planId }) => {
            toast.success("Plan price updated");
            queryClient.invalidateQueries({ queryKey: ["plan", planId] });
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not update plan price";
            toast.error(msg);
        },
    });
}

export function useUpdateCustomField() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, fieldId, ...fieldData }) => {
            const res = await api.put(`${API_URL}/plans/${planId}/custom-fields/${fieldId}`, fieldData);
            return res.data;
        },
        onSuccess: (_, { planId }) => {
            toast.success("Custom field updated");
            queryClient.invalidateQueries({ queryKey: ["plan", planId] });
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not update custom field";
            toast.error(msg);
        },
    });
}

export function useDeleteCustomField() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, fieldId }) => {
            await api.delete(`${API_URL}/plans/${planId}/custom-fields/${fieldId}`);
        },
        onSuccess: (_, { planId }) => {
            toast.success("Custom field deleted");
            queryClient.invalidateQueries({ queryKey: ["plan", planId] });
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not delete custom field";
            toast.error(msg);
        },
    });
}