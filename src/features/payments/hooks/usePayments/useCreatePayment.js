import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiPayments } from '@/lib/api/payments';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useCreatePayment() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: apiPayments.create,

        // Optimistic update before server response
        onMutate: async (newPaymentData) => {
            // Cancel in-flight queries
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payments });

            // Snapshot previous state
            const previousPayments = queryClient.getQueryData(QUERY_KEYS.payments);

            // Add optimistic item with temp ID
            const tempId = `temp-${Date.now()}`;
            queryClient.setQueryData(QUERY_KEYS.payments, (old) => [
                ...(old || []),
                { ...newPaymentData, id: tempId }
            ]);

            return { previousPayments, tempId };
        },

        // Update with server response (replace temp ID with real ID)
        onSuccess: async (response, variables, context) => {
            queryClient.setQueryData(QUERY_KEYS.payments, (old) =>
                old?.map(payment =>
                    payment.id === context?.tempId ? response : payment
                ) || []
            );
            await cacheInvalidator.invalidateDependentsOnly('payments', { parallel: false });
            toast.success("Payment created!");
        },

        // Rollback on error
        onError: (error, variables, context) => {
            if (context?.previousPayments) {
                queryClient.setQueryData(QUERY_KEYS.payments, context.previousPayments);
            }
            toast.error(error?.response?.data?.message || "Failed to create payment");
            console.error(error);
        },
    });
}
