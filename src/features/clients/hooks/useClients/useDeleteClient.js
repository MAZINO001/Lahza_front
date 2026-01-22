// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { apiClient } from '@/lib/api/clients';
// import { QUERY_KEYS } from '@/lib/queryKeys';

// export function useDeleteClient() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: (id) => apiClient.delete(id),

//         onMutate: async (id) => {
//             await queryClient.cancelQueries({ queryKey: QUERY_KEYS.clients });

//             const previousClients = queryClient.getQueryData(QUERY_KEYS.clients);

//             queryClient.setQueryData(QUERY_KEYS.clients, (old) =>
//                 old?.filter(client => client.id !== id) || []
//             );

//             queryClient.removeQueries({ queryKey: QUERY_KEYS.client(id) });

//             return { previousClients };
//         },

//         onError: (error, id, context) => {
//             if (context?.previousClients) {
//                 queryClient.setQueryData(QUERY_KEYS.clients, context.previousClients);
//             }
//             toast.error(error?.response?.data?.message || "Failed to delete client");
//             console.error(error);
//         },

//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
//             toast.success("Client deleted");
//         },
//     });
// }


import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/clients";
import { QUERY_KEYS } from "@/lib/queryKeys";

export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => apiClient.delete(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.client });

            const previousClients = queryClient.getQueryData(QUERY_KEYS.client);

            // ✅ correct filter by item.client.id
            queryClient.setQueryData(QUERY_KEYS.client, (old = []) =>
                old.filter((item) => item.client.id !== id)
            );

            // optional: remove single client query from cache
            queryClient.removeQueries({ queryKey: QUERY_KEYS.client(id) });

            return { previousClients };
        },

        onError: (error, id, context) => {
            if (context?.previousClients) {
                queryClient.setQueryData(QUERY_KEYS.client, context.previousClients);
            }
            toast.error(error?.response?.data?.message || "Failed to delete client");
            console.error(error);
        },

        onSuccess: () => {
            toast.success("Client deleted");
        },

        onSettled: () => {
            // ensure cache is fresh
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.client });
        },
    });
}
