import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from '@/lib/api/clients';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useDeleteClient() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: (id) => apiClient.delete(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.clients });

            const previousClients = queryClient.getQueryData(QUERY_KEYS.clients);

            queryClient.setQueryData(QUERY_KEYS.clients, (old) =>
                old?.filter(client => client.id !== id) || []
            );

            queryClient.removeQueries({ queryKey: QUERY_KEYS.client(id) });

            return { previousClients };
        },

        onError: (error, id, context) => {
            if (context?.previousClients) {
                queryClient.setQueryData(QUERY_KEYS.clients, context.previousClients);
            }
            toast.error(error?.response?.data?.message || "Failed to delete client");
            console.error(error);
        },

        onSuccess: async () => {
            await cacheInvalidator.invalidateDependentsOnly('clients', { parallel: false });
            toast.success("Client deleted");
        },
    });
}
