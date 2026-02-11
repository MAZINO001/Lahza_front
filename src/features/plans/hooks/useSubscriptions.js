// src/features/subscriptions/hooks/useSubscriptions.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export function useSubscriptions(clientId, packId) {
    return useQuery({
        queryKey: ["subscriptions", clientId, packId],
        queryFn: async () => {
            const params = {};
            if (clientId) params.client_id = clientId;
            if (packId) params.pack_id = packId;

            const res = await api.get(`${API_URL}/subscriptions`, { params });

            // Handle the actual API response structure
            // Response has: { data: [...], current_page: 1, total: 1, ... }
            return res.data?.data || [];
        },
        enabled: true, // Always enabled, works with or without clientId/packId
        staleTime: 4 * 60 * 1000,
    });
}

export function useSubscription(subscriptionId) {
    return useQuery({
        queryKey: ["subscription", subscriptionId],
        queryFn: async () => {
            if (!subscriptionId) return null;
            const res = await api.get(`${API_URL}/subscriptions/${subscriptionId}`);
            return res.data?.subscription || res.data || null;
        },
        enabled: !!subscriptionId,
        staleTime: 3 * 60 * 1000,
    });
}

export function useCreateSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await api.post(`${API_URL}/subscriptions`, data);
            return res.data;
        },
        onSuccess: (responseData) => {
            toast.success("Subscription created successfully");
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });

            // Optional: invalidate subscriptions for this specific client
            const clientId = responseData?.subscription?.client_id;
            if (clientId) {
                queryClient.invalidateQueries({ queryKey: ["subscriptions", clientId] });
            }

            // Optional: invalidate subscriptions for this specific pack
            const packId = responseData?.subscription?.plan?.pack_id;
            if (packId) {
                queryClient.invalidateQueries({ queryKey: ["subscriptions", undefined, packId] });
            }
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not create subscription";
            toast.error(msg);
            console.error("Create subscription failed:", error);
        },
    });
}

export function useUpdateSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ subscriptionId, ...updateData }) => {
            const res = await api.put(`${API_URL}/subscriptions/${subscriptionId}`, updateData);
            return res.data;
        },
        onSuccess: (_, { subscriptionId }) => {
            toast.success("Subscription updated successfully");
            queryClient.invalidateQueries({ queryKey: ["subscription", subscriptionId] });
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not update subscription";
            toast.error(msg);
        },
    });
}

export function useCancelSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ subscriptionId, immediate = true }) => {
            const res = await api.post(`${API_URL}/subscriptions/${subscriptionId}/cancel`, { immediate });
            return res.data;
        },
        onSuccess: (_, { subscriptionId }) => {
            toast.success("Subscription cancelled successfully");
            queryClient.invalidateQueries({ queryKey: ["subscription", subscriptionId] });
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not cancel subscription";
            toast.error(msg);
        },
    });
}

export function useRenewSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (subscriptionId) => {
            const res = await api.post(`${API_URL}/subscriptions/${subscriptionId}/renew`);
            return res.data;
        },
        onSuccess: (_, subscriptionId) => {
            toast.success("Subscription renewed successfully");
            queryClient.invalidateQueries({ queryKey: ["subscription", subscriptionId] });
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not renew subscription";
            toast.error(msg);
        },
    });
}

export function useChangePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ subscriptionId, planId, planPriceId, immediate = true }) => {
            const res = await api.post(`${API_URL}/subscriptions/${subscriptionId}/change-plan`, {
                plan_id: planId,
                plan_price_id: planPriceId,
                immediate,
            });
            return res.data;
        },
        onSuccess: (_, { subscriptionId }) => {
            toast.success("Plan changed successfully");
            queryClient.invalidateQueries({ queryKey: ["subscription", subscriptionId] });
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not change plan";
            toast.error(msg);
        },
    });
}

export function useCheckSubscriptionLimit() {
    return useMutation({
        mutationFn: async ({ subscriptionId, limitKey, currentUsage }) => {
            const res = await api.post(`${API_URL}/subscriptions/${subscriptionId}/check-limit`, {
                limit_key: limitKey,
                current_usage: currentUsage,
            });
            return res.data;
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not check subscription limit";
            toast.error(msg);
        },
    });
}

export function useSubscriptionStats() {
    return useQuery({
        queryKey: ["subscription-stats"],
        queryFn: async () => {
            const res = await api.get(`${API_URL}/subscriptions/stats`);
            return res.data || null;
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useClientActiveSubscription(clientId) {
    return useQuery({
        queryKey: ["client-subscription", clientId],
        queryFn: async () => {
            if (!clientId) return null;
            const res = await api.get(`${API_URL}/clients/${clientId}/subscription`);
            return res.data?.subscription || res.data || null;
        },
        enabled: !!clientId,
        staleTime: 3 * 60 * 1000,
    });
}

export function useDeleteSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (subscriptionId) => {
            await api.delete(`${API_URL}/subscriptions/${subscriptionId}`);
        },
        onSuccess: (_, subscriptionId) => {
            toast.success("Subscription deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
            queryClient.removeQueries({ queryKey: ["subscription", subscriptionId] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not delete subscription";
            toast.error(msg);
        },
    });
}