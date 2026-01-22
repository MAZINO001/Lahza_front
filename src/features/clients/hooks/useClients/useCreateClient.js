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

        onSuccess: (newClient) => {
            queryClient.setQueryData(QUERY_KEYS.client, (old = []) => [...old, newClient]);
            toast.success("Client created!");
        },

        // onSuccess: async (response) => {
        //     try {
        //         // fetch the full client object from the backend
        //         const fullClient = await apiClient.getById(response.client_id.id);

        //         queryClient.setQueryData(QUERY_KEYS.client, (old = []) => [...old, fullClient]);
        //         toast.success("Client created!");
        //     } catch (err) {
        //         toast.error("Client created but failed to load full data");
        //     }
        // },

        onError: (error, variables, context) => {
            if (context?.previousClients) {
                queryClient.setQueryData(QUERY_KEYS.clients, context.previousClients);
            }
            toast.error(error?.response?.data?.message || "Failed to create client");
            console.error(error);
        },
    });
}