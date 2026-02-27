import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiDocuments } from '@/lib/api/documents';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useUpdateDocument(type) {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);
    const entityName = type === "invoices" ? "invoices" : "quotes";
    const queryKey = type === "invoices" ? QUERY_KEYS.invoices : QUERY_KEYS.quotes;

    return useMutation({
        mutationFn: ({ id, data }) => apiDocuments.update(id, data, type),

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.document(id) });

            const previousDocuments = queryClient.getQueryData(queryKey);
            const previousDocument = queryClient.getQueryData(QUERY_KEYS.document(id));

            queryClient.setQueryData(queryKey, (old) =>
                old?.map(doc =>
                    doc.id === id ? { ...doc, ...data } : doc
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.document(id), (old) =>
                old ? { ...old, ...data } : old
            );

            return { previousDocuments, previousDocument, optimisticData: { ...data } };
        },

        onSuccess: async (response, { id }, context) => {
            const serverData = response.data;
            const updatedData = { ...context?.optimisticData, ...serverData };

            queryClient.setQueryData(queryKey, (old) =>
                old?.map(doc =>
                    doc.id === id ? updatedData : doc
                ) || []
            );
            queryClient.setQueryData(QUERY_KEYS.document(id), updatedData);

            await cacheInvalidator.invalidateDependentsOnly(entityName, { parallel: false });

            const label = type === "quotes" ? "Quote" : "Invoice";
            toast.success(`${label} updated successfully!`);
        },

        onError: (error, { id }, context) => {
            if (context?.previousDocuments) {
                queryClient.setQueryData(queryKey, context.previousDocuments);
            }
            if (context?.previousDocument) {
                queryClient.setQueryData(QUERY_KEYS.document(id), context.previousDocument);
            }
            const label = type === "quotes" ? "Quote" : "Invoice";
            toast.error(error?.response?.data?.message || `Failed to update ${label.toLowerCase()}`);
            console.error(error);
        },
    });
}
