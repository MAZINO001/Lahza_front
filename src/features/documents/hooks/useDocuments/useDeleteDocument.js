import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiDocuments } from '@/lib/api/documents';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useDeleteDocument(type) {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);
    const entityName = type === "invoices" ? "invoices" : "quotes";
    const queryKey = type === "invoices" ? QUERY_KEYS.invoices : QUERY_KEYS.quotes;

    return useMutation({
        mutationFn: (id) => apiDocuments.delete(id, type),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey });
            const previousDocuments = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old) =>
                old?.filter(doc => doc.id !== id) || []
            );

            return { previousDocuments };
        },

        onSuccess: async (_, id) => {
            queryClient.removeQueries({ queryKey: QUERY_KEYS.document(id) });
            await cacheInvalidator.invalidateDependentsOnly(entityName, { parallel: false });
            toast.success("Document deleted");
        },

        onError: (error, id, context) => {
            if (context?.previousDocuments) {
                queryClient.setQueryData(queryKey, context.previousDocuments);
            }
            toast.error(error?.response?.data?.message || "Failed to delete document");
            console.error(error);
        },
    });
}
