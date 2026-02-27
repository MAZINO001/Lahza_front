import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiPayments } from '@/lib/api/payments';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useUpdatePayment() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: ({ id, data }) => apiPayments.update(id, data),

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payments });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payment(id) });

            const previousPayments = queryClient.getQueryData(QUERY_KEYS.payments);
            const previousPayment = queryClient.getQueryData(QUERY_KEYS.payment(id));

            queryClient.setQueryData(QUERY_KEYS.payments, (old) =>
                old?.map(payment =>
                    payment.id === id ? { ...payment, ...data } : payment
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.payment(id), (old) =>
                old ? { ...old, ...data } : old
            );

            return { previousPayments, previousPayment };
        },

        onSuccess: async (response, variables) => {
            const { id } = variables;
            toast.success(response.message || "Payment updated");
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
            toast.error(error?.response?.data?.message || "Failed to update payment");
            console.error(error);
        },
    });
}
