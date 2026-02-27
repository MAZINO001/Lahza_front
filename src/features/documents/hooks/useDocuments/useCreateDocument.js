import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiDocuments } from '@/lib/api/documents';
import { QUERY_KEYS } from '@/lib/queryKeys';

import { createCacheInvalidator } from "@/lib/CacheInvalidationManager";

export function useCreateDocument(type) {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);
    const entityName = type === "invoices" ? "invoices" : "quotes";

    // Use type-specific query key to prevent cache contamination
    const queryKey = type === "invoices" ? QUERY_KEYS.invoices : QUERY_KEYS.quotes;

    return useMutation({
        mutationFn: (data) => apiDocuments.create(data, type),

        // Optimistic update before server response
        onMutate: async (newDocumentData) => {
            // Cancel in-flight queries
            await queryClient.cancelQueries({ queryKey });

            // Snapshot previous state
            const previousDocuments = queryClient.getQueryData(queryKey);

            // Add optimistic item with temp ID
            const tempId = `temp-${Date.now()}`;
            queryClient.setQueryData(queryKey, (old) => [
                ...(old || []),
                { ...newDocumentData, id: tempId, type }
            ]);

            return { previousDocuments, tempId };
        },

        onSuccess: async (response, variables, context) => {
            // Extract the actual document data from the response
            const documentData = response.data?.[0] || response;

            queryClient.setQueryData(queryKey, (old) =>
                old?.map(doc =>
                    doc.id === context?.tempId ? documentData : doc
                ) || []
            );

            // Invalidate only dependents (invoices, projects, payments, etc.) to avoid refetching the list we just updated
            await cacheInvalidator.invalidateDependentsOnly(entityName, {
                parallel: false
            });

            const label = type === "quotes" ? "Quote" : "Invoice";
            toast.success(`${label} created successfully!`);
        },

        // Rollback on error
        onError: (error, variables, context) => {
            if (context?.previousDocuments) {
                queryClient.setQueryData(queryKey, context.previousDocuments);
            }
            const label = type === "quotes" ? "Quote" : "Invoice";
            toast.error(error?.response?.data?.message || `Failed to create ${label.toLowerCase()}`);
            console.error(error);
        },
    });
}
