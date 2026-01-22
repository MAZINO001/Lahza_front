import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from '@/lib/api/clients';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useUpdateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiClient.update(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.clients });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.client(id) });

            const previousClients = queryClient.getQueryData(QUERY_KEYS.clients);
            const previousClient = queryClient.getQueryData(QUERY_KEYS.client(id));

            queryClient.setQueryData(QUERY_KEYS.clients, (old) =>
                old?.map(client =>
                    client.id === id ? { ...client, ...data } : client
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.client(id), (old) =>
                old ? { ...old, ...data } : old
            );

            return { previousClients, previousClient };
        },

        onSuccess: (response, { id }) => {
            queryClient.setQueryData(QUERY_KEYS.clients, (old) =>
                old?.map(client =>
                    client.id === id ? response : client
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.client(id), response);
            toast.success("Client updated!");
        },

        onError: (error, { id }, context) => {
            if (context?.previousClients) {
                queryClient.setQueryData(QUERY_KEYS.clients, context.previousClients);
            }
            if (context?.previousClient) {
                queryClient.setQueryData(QUERY_KEYS.client(id), context.previousClient);
            }
            toast.error(error?.response?.data?.message || "Failed to update client");
            console.error(error);
        },
    });
}