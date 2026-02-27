import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiPayments } from '@/lib/api/payments';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useCreateAdditionalPayment() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: apiPayments.additional,
        
        onMutate: async (newPaymentData) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payments });
            const previousPayments = queryClient.getQueryData(QUERY_KEYS.payments);
            
            const tempId = `temp-${Date.now()}`;
            queryClient.setQueryData(QUERY_KEYS.payments, (old) => [
                ...(old || []),
                { ...newPaymentData, id: tempId, type: 'additional' }
            ]);
            
            return { previousPayments, tempId };
        },
        
        onSuccess: async (response, variables, context) => {
            queryClient.setQueryData(QUERY_KEYS.payments, (old) =>
                old?.map(payment =>
                    payment.id === context?.tempId ? response : payment
                ) || []
            );
            await cacheInvalidator.invalidateDependentsOnly('payments', { parallel: false });
            toast.success("Additional payment created");
        },
        
        onError: (error, variables, context) => {
            if (context?.previousPayments) {
                queryClient.setQueryData(QUERY_KEYS.payments, context.previousPayments);
            }
            toast.error(error?.response?.data?.message || "Failed to create additional payment");
            console.error(error);
        },
    });
}
