import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from '@/lib/api/clients';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useCreateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => apiClient.create(data),

        onMutate: async (newClientData) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.clients });

            const previousClients = queryClient.getQueryData(QUERY_KEYS.clients);

            const tempId = `temp-${Date.now()}`;
            queryClient.setQueryData(QUERY_KEYS.clients, (old) => [
                ...(old || []),
                { ...newClientData, id: tempId }
            ]);

            return { previousClients, tempId };
        },

        onSuccess: (res, variables, context) => {
            const newClientItem = {
                client: res.data[0].client,
                totalPaid: 0,
                balanceDue: 0,
            }

            queryClient.setQueryData(QUERY_KEYS.clients, (old = []) => {
                return old.map(client =>
                    client.id === context?.tempId
                        ? { ...newClientItem, id: res.data[0].id }
                        : client
                );
            })
        },

        onError: (error, variables, context) => {
            if (context?.previousClients) {
                queryClient.setQueryData(QUERY_KEYS.clients, context.previousClients);
            }
            toast.error(error?.response?.data?.message || "Failed to create client");
            console.error(error);
        },
    });
}