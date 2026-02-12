// src/features/subscriptions/hooks/useSubscriptions.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/queryKeys";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export function useSubscriptions(clientId, packId) {
    const queryKey = clientId
        ? QUERY_KEYS.subscriptionsByClient(clientId)
        : packId
            ? QUERY_KEYS.subscriptionsByPack(packId)
            : QUERY_KEYS.subscriptions;

    return useQuery({
        queryKey,
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
        queryKey: QUERY_KEYS.subscription(subscriptionId),
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
        onMutate: async (newSubscription) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.subscriptions });

            // Snapshot the previous value
            const previousSubscriptions = queryClient.getQueryData(QUERY_KEYS.subscriptions);

            // Optimistically update to the new value
            queryClient.setQueryData(QUERY_KEYS.subscriptions, (old) => {
                const subscriptionData = newSubscription.subscription || newSubscription;
                return old ? [...old, subscriptionData] : [subscriptionData];
            });

            return { previousSubscriptions };
        },
        onSuccess: (responseData) => {
            toast.success("Subscription created successfully");

            // Invalidate to get fresh data from server
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptions });

            // Optional: invalidate subscriptions for this specific client
            const clientId = responseData?.subscription?.client_id;
            if (clientId) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptionsByClient(clientId) });
            }

            // Optional: invalidate subscriptions for this specific pack
            const packId = responseData?.subscription?.plan?.pack_id;
            if (packId) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptionsByPack(packId) });
            }
        },
        onError: (error, newSubscription, context) => {
            if (context?.previousSubscriptions) {
                queryClient.setQueryData(QUERY_KEYS.subscriptions, context.previousSubscriptions);
            }
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
        onMutate: async ({ subscriptionId, ...updateData }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.subscriptions });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.subscription(subscriptionId) });

            // Snapshot the previous values
            const previousSubscriptions = queryClient.getQueryData(QUERY_KEYS.subscriptions);
            const previousSubscription = queryClient.getQueryData(QUERY_KEYS.subscription(subscriptionId));

            // Optimistically update subscriptions list
            queryClient.setQueryData(QUERY_KEYS.subscriptions, (old) =>
                old?.map(subscription =>
                    subscription.id === subscriptionId ? { ...subscription, ...updateData } : subscription
                ) || []
            );

            // Optimistically update individual subscription
            queryClient.setQueryData(QUERY_KEYS.subscription(subscriptionId), (old) =>
                old ? { ...old, ...updateData } : old
            );

            return { previousSubscriptions, previousSubscription };
        },
        onSuccess: (_, { subscriptionId }) => {
            toast.success("Subscription updated successfully");
            // Invalidate to get fresh data from server
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptions });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscription(subscriptionId) });
        },
        onError: (error, { subscriptionId }, context) => {
            // Rollback on error
            if (context?.previousSubscriptions) {
                queryClient.setQueryData(QUERY_KEYS.subscriptions, context.previousSubscriptions);
            }
            if (context?.previousSubscription) {
                queryClient.setQueryData(QUERY_KEYS.subscription(subscriptionId), context.previousSubscription);
            }
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
        onMutate: async ({ subscriptionId, immediate }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.subscriptions });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.subscription(subscriptionId) });

            // Snapshot the previous values
            const previousSubscriptions = queryClient.getQueryData(QUERY_KEYS.subscriptions);
            const previousSubscription = queryClient.getQueryData(QUERY_KEYS.subscription(subscriptionId));

            // Optimistically update subscriptions list
            queryClient.setQueryData(QUERY_KEYS.subscriptions, (old) =>
                old?.map(subscription =>
                    subscription.id === subscriptionId
                        ? { ...subscription, status: immediate ? 'cancelled' : 'cancelled', cancelled_at: immediate ? new Date().toISOString() : subscription.cancelled_at }
                        : subscription
                ) || []
            );

            // Optimistically update individual subscription
            queryClient.setQueryData(QUERY_KEYS.subscription(subscriptionId), (old) =>
                old ? { ...old, status: immediate ? 'cancelled' : 'cancelled', cancelled_at: immediate ? new Date().toISOString() : old.cancelled_at } : old
            );

            return { previousSubscriptions, previousSubscription };
        },
        onSuccess: (_, { subscriptionId }) => {
            toast.success("Subscription cancelled successfully");
            // Invalidate to get fresh data from server
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptions });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscription(subscriptionId) });
        },
        onError: (error, { subscriptionId }, context) => {
            // Rollback on error
            if (context?.previousSubscriptions) {
                queryClient.setQueryData(QUERY_KEYS.subscriptions, context.previousSubscriptions);
            }
            if (context?.previousSubscription) {
                queryClient.setQueryData(QUERY_KEYS.subscription(subscriptionId), context.previousSubscription);
            }
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
        onMutate: async (subscriptionId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.subscriptions });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.subscription(subscriptionId) });

            // Snapshot the previous values
            const previousSubscriptions = queryClient.getQueryData(QUERY_KEYS.subscriptions);
            const previousSubscription = queryClient.getQueryData(QUERY_KEYS.subscription(subscriptionId));

            return { previousSubscriptions, previousSubscription };
        },
        onSuccess: (responseData, subscriptionId) => {
            // Use the actual renewed subscription data from backend response
            const renewedSubscription = responseData.subscription || responseData;

            // Update subscriptions list with the renewed data
            queryClient.setQueryData(QUERY_KEYS.subscriptions, (old) =>
                old?.map(subscription =>
                    subscription.id === subscriptionId ? renewedSubscription : subscription
                ) || []
            );

            // Update individual subscription with the renewed data
            queryClient.setQueryData(QUERY_KEYS.subscription(subscriptionId), renewedSubscription);

            toast.success("Subscription renewed successfully");

            // Force refetch to ensure UI updates with latest data
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.subscription(subscriptionId) });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.subscriptions });
        },
        onError: (error, subscriptionId, context) => {
            // Rollback on error
            if (context?.previousSubscriptions) {
                queryClient.setQueryData(QUERY_KEYS.subscriptions, context.previousSubscriptions);
            }
            if (context?.previousSubscription) {
                queryClient.setQueryData(QUERY_KEYS.subscription(subscriptionId), context.previousSubscription);
            }
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
        onMutate: async ({ subscriptionId, planId, planPriceId }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.subscriptions });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.subscription(subscriptionId) });

            // Snapshot the previous values
            const previousSubscriptions = queryClient.getQueryData(QUERY_KEYS.subscriptions);
            const previousSubscription = queryClient.getQueryData(QUERY_KEYS.subscription(subscriptionId));

            // Optimistically update subscriptions list
            queryClient.setQueryData(QUERY_KEYS.subscriptions, (old) =>
                old?.map(subscription =>
                    subscription.id === subscriptionId
                        ? { ...subscription, plan_id: planId, plan_price_id: planPriceId }
                        : subscription
                ) || []
            );

            // Optimistically update individual subscription
            queryClient.setQueryData(QUERY_KEYS.subscription(subscriptionId), (old) =>
                old ? { ...old, plan_id: planId, plan_price_id: planPriceId } : old
            );

            return { previousSubscriptions, previousSubscription };
        },
        onSuccess: (_, { subscriptionId }) => {
            toast.success("Plan changed successfully");
            // Invalidate to get fresh data from server
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptions });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscription(subscriptionId) });
        },
        onError: (error, { subscriptionId }, context) => {
            // Rollback on error
            if (context?.previousSubscriptions) {
                queryClient.setQueryData(QUERY_KEYS.subscriptions, context.previousSubscriptions);
            }
            if (context?.previousSubscription) {
                queryClient.setQueryData(QUERY_KEYS.subscription(subscriptionId), context.previousSubscription);
            }
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
        onMutate: async (subscriptionId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.subscriptions });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.subscription(subscriptionId) });

            // Snapshot the previous values
            const previousSubscriptions = queryClient.getQueryData(QUERY_KEYS.subscriptions);
            const previousSubscription = queryClient.getQueryData(QUERY_KEYS.subscription(subscriptionId));

            // Optimistically remove from subscriptions list
            queryClient.setQueryData(QUERY_KEYS.subscriptions, (old) =>
                old?.filter(subscription => subscription.id !== subscriptionId) || []
            );

            // Optimistically remove individual subscription
            queryClient.removeQueries({ queryKey: QUERY_KEYS.subscription(subscriptionId) });

            return { previousSubscriptions, previousSubscription };
        },
        onSuccess: (_, subscriptionId) => {
            toast.success("Subscription deleted successfully");
            // Ensure data is fresh from server
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptions });
            queryClient.removeQueries({ queryKey: QUERY_KEYS.subscription(subscriptionId) });
        },
        onError: (error, subscriptionId, context) => {
            // Rollback on error
            if (context?.previousSubscriptions) {
                queryClient.setQueryData(QUERY_KEYS.subscriptions, context.previousSubscriptions);
            }
            if (context?.previousSubscription) {
                queryClient.setQueryData(QUERY_KEYS.subscription(subscriptionId), context.previousSubscription);
            }
            const msg = error?.response?.data?.message || "Could not delete subscription";
            toast.error(msg);
        },
    });
}