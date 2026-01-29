import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiPayments } from '@/lib/api/payments';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useDeletePayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => apiPayments.delete(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payments });
            const previousPayments = queryClient.getQueryData(QUERY_KEYS.payments);

            queryClient.setQueryData(QUERY_KEYS.payments, (old) =>
                old?.filter(payment => payment.id !== id) || []
            );

            return { previousPayments };
        },

        onSuccess: (_, id) => {
            queryClient.removeQueries({ queryKey: QUERY_KEYS.payment(id) });
            toast.success("Payment deleted");
        },

        onError: (error, id, context) => {
            if (context?.previousPayments) {
                queryClient.setQueryData(QUERY_KEYS.payments, context.previousPayments);
            }
            toast.error(error?.response?.data?.message || "Failed to delete payment");
            console.error(error);
        },
    });
}
