import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiPayments } from '@/lib/api/payments';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useUpdatePaymentDate() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: ({ id, paid_at }) => apiPayments.updatePaymentDate(id, paid_at),

        onMutate: async ({ id, paid_at }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payments });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payment(id) });

            const previousPayments = queryClient.getQueryData(QUERY_KEYS.payments);
            const previousPayment = queryClient.getQueryData(QUERY_KEYS.payment(id));

            // Optimistically update payment date
            queryClient.setQueryData(QUERY_KEYS.payments, (old) =>
                old?.map(payment =>
                    payment.id === id ? { ...payment, paid_at } : payment
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.payment(id), (old) =>
                old ? { ...old, paid_at } : old
            );

            return { previousPayments, previousPayment };
        },

        onSuccess: async (response, { id }) => {
            toast.success(response.message || "Payment date updated");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payments });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payment(id) });
            await cacheInvalidator.invalidateDependentsOnly('payments', { parallel: false });
        },

        onError: (error, { id }, context) => {
            if (context?.previousPayments) {
                queryClient.setQueryData(QUERY_KEYS.payments, context.previousPayments);
            }
            if (context?.previousPayment) {
                queryClient.setQueryData(QUERY_KEYS.payment(id), context.previousPayment);
            }
            toast.error(error?.response?.data?.message || "Failed to update payment date");
            console.error(error);
        },
    });
}
