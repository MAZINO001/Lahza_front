import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiDocuments } from '@/lib/api/documents';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useUpdateDocument(type) {
    const queryClient = useQueryClient();

    // Use type-specific query key to prevent cache contamination
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

        onSuccess: (response, { id }, context) => {
            console.log('Update response:', response);

            // The actual document data is in response.data
            const serverData = response.data;

            // Merge server response with optimistic data to preserve fields server doesn't return
            const updatedData = { ...context?.optimisticData, ...serverData };

            // Update the documents list with merged data
            queryClient.setQueryData(queryKey, (old) =>
                old?.map(doc =>
                    doc.id === id ? updatedData : doc
                ) || []
            );

            // Update the individual document cache with merged data
            queryClient.setQueryData(QUERY_KEYS.document(id), updatedData);

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
