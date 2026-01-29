// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { apiDocuments } from '@/lib/api/documents';
// import { QUERY_KEYS } from '@/lib/queryKeys';

// export function useCreateInvoiceFromQuote() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: (id) => apiDocuments.createFromQuote(id),

//         onMutate: async (quoteId) => {
//             // Cancel both quotes and invoices queries since this operation affects both
//             await queryClient.cancelQueries({ queryKey: QUERY_KEYS.quotes });
//             await queryClient.cancelQueries({ queryKey: QUERY_KEYS.invoices });
//             const previousQuotes = queryClient.getQueryData(QUERY_KEYS.quotes);
//             const previousInvoices = queryClient.getQueryData(QUERY_KEYS.invoices);
//             return { previousQuotes, previousInvoices };
//         },

//         onSuccess: () => {
//             toast.success('Invoice created from quote successfully');
//             // Invalidate both queries since both might be affected
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.quotes });
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices });
//         },

//         onError: (error, variables, context) => {
//             if (context?.previousQuotes) {
//                 queryClient.setQueryData(QUERY_KEYS.quotes, context.previousQuotes);
//             }
//             if (context?.previousInvoices) {
//                 queryClient.setQueryData(QUERY_KEYS.invoices, context.previousInvoices);
//             }
//             toast.error(error?.response?.data?.message || "Failed to create invoice from quote");
//             console.error(error);
//         },
//     });
// }

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiDocuments } from '@/lib/api/documents';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from "@/lib/CacheInvalidationManager";

export function useCreateInvoiceFromQuote() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: (id) => apiDocuments.createFromQuote(id),

        onMutate: async (quoteId) => {
            // Cancel all three affected queries
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.quotes });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.invoices });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payments }); // ADD THIS

            const previousQuotes = queryClient.getQueryData(QUERY_KEYS.quotes);
            const previousInvoices = queryClient.getQueryData(QUERY_KEYS.invoices);
            const previousPayments = queryClient.getQueryData(QUERY_KEYS.payments); // ADD THIS

            return { previousQuotes, previousInvoices, previousPayments }; // ADD THIS
        },
        
        onSuccess: async (response) => {
            toast.success('Invoice created from quote successfully');
            await cacheInvalidator.invalidateMultiple(['quotes', 'invoices'], {
                parallel: false
            });
        },
        onError: (error, variables, context) => {
            if (context?.previousQuotes) {
                queryClient.setQueryData(QUERY_KEYS.quotes, context.previousQuotes);
            }
            if (context?.previousInvoices) {
                queryClient.setQueryData(QUERY_KEYS.invoices, context.previousInvoices);
            }
            if (context?.previousPayments) { // ADD THIS
                queryClient.setQueryData(QUERY_KEYS.payments, context.previousPayments);
            }
            toast.error(error?.response?.data?.message || "Failed to create invoice from quote");
            console.error(error);
        },
    });
}