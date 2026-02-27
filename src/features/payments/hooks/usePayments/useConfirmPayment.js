import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiPayments } from '@/lib/api/payments';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from "@/lib/CacheInvalidationManager";

export function useConfirmPayment() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: (id) => apiPayments.confirm(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payments });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payment(id) });

            const previousPayments = queryClient.getQueryData(QUERY_KEYS.payments);
            const previousPayment = queryClient.getQueryData(QUERY_KEYS.payment(id));

            // Optimistically update payment status
            queryClient.setQueryData(QUERY_KEYS.payments, (old) =>
                old?.map(payment =>
                    payment.id === id ? { ...payment, status: 'confirmed' } : payment
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.payment(id), (old) =>
                old ? { ...old, status: 'confirmed' } : old
            );

            return { previousPayments, previousPayment };
        },
        onSuccess: async (response) => {
            toast.success(response.message || "Payment confirmed");
            // Invalidate only dependents; payments list already updated optimistically
            await cacheInvalidator.invalidateDependentsOnly('payments', {
                parallel: false
            });
        },

        onError: (error, id, context) => {
            if (context?.previousPayments) {
                queryClient.setQueryData(QUERY_KEYS.payments, context.previousPayments);
            }
            if (context?.previousPayment) {
                queryClient.setQueryData(QUERY_KEYS.payment(id), context.previousPayment);
            }
            toast.error(error?.response?.data?.message || "Failed to confirm payment");
            console.error(error);
        },
    });
}
