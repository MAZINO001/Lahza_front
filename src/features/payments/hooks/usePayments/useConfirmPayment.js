// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { apiPayments } from '@/lib/api/payments';
// import { QUERY_KEYS } from '@/lib/queryKeys';
// import { createCacheInvalidator } from "@/lib/CacheInvalidationManager";

// export function useConfirmPayment() {
//     const queryClient = useQueryClient();
//     const cacheInvalidator = createCacheInvalidator(queryClient);

//     return useMutation({
//         mutationFn: (id) => apiPayments.confirm(id),

//         onMutate: async (id) => {
//             await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payments });
//             await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payment(id) });

//             const previousPayments = queryClient.getQueryData(QUERY_KEYS.payments);
//             const previousPayment = queryClient.getQueryData(QUERY_KEYS.payment(id));

//             // Try to resolve the related invoice ID from cache
//             let invoiceId = previousPayment?.invoice_id;
//             if (!invoiceId && Array.isArray(previousPayments)) {
//                 const matched = previousPayments.find((payment) => payment.id === id);
//                 invoiceId = matched?.invoice_id;
//             }

//             // Optimistically update payment status to match receipts filter and backend
//             queryClient.setQueryData(QUERY_KEYS.payments, (old) =>
//                 old?.map(payment =>
//                     payment.id === id ? { ...payment, status: 'paid' } : payment
//                 ) || []
//             );

//             queryClient.setQueryData(QUERY_KEYS.payment(id), (old) =>
//                 old ? { ...old, status: 'paid' } : old
//             );

//             return { previousPayments, previousPayment, invoiceId };
//         },
//         onSuccess: async (response, id, context) => {
//             toast.success(response.message || "Payment confirmed");
//             // Invalidate only dependents; payments list already updated optimistically
//             await cacheInvalidator.invalidateDependentsOnly('payments', {
//                 parallel: false
//             });

//             // Also refresh the specific invoice views that depend on this payment
//             const invoiceId = context?.invoiceId;
//             if (invoiceId) {
//                 await queryClient.invalidateQueries({ queryKey: ["document-payments", invoiceId] });
//                 await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.document(invoiceId) });
//             }
//         },

//         onError: (error, id, context) => {
//             if (context?.previousPayments) {
//                 queryClient.setQueryData(QUERY_KEYS.payments, context.previousPayments);
//             }
//             if (context?.previousPayment) {
//                 queryClient.setQueryData(QUERY_KEYS.payment(id), context.previousPayment);
//             }
//             toast.error(error?.response?.data?.message || "Failed to confirm payment");
//             console.error(error);
//         },
//     });
// }


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

            let invoiceId = previousPayment?.invoice_id;
            if (!invoiceId && Array.isArray(previousPayments)) {
                const matched = previousPayments.find((payment) => payment.id === id);
                invoiceId = matched?.invoice_id;
            }

            // Optimistically update payment status
            queryClient.setQueryData(QUERY_KEYS.payments, (old) =>
                old?.map(payment =>
                    payment.id === id ? { ...payment, status: 'paid' } : payment
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.payment(id), (old) =>
                old ? { ...old, status: 'paid' } : old
            );

            return { previousPayments, previousPayment, invoiceId };
        },

        onSuccess: async (response, id, context) => {
            toast.success(response.message || "Payment confirmed");
            
            // Force refetch to get the actual server state (new payment might be created)
            await queryClient.invalidateQueries({ 
                queryKey: QUERY_KEYS.payments,
                refetchType: 'active'
            });

            await queryClient.invalidateQueries({ 
                queryKey: QUERY_KEYS.payment(id),
                refetchType: 'active'
            });

            const invoiceId = context?.invoiceId;
            if (invoiceId) {
                await queryClient.invalidateQueries({ 
                    queryKey: ["document-payments", invoiceId],
                    refetchType: 'active'
                });
                await queryClient.invalidateQueries({ 
                    queryKey: QUERY_KEYS.document(invoiceId),
                    refetchType: 'active'
                });
            }

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