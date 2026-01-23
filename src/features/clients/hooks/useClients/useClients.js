import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from '@/lib/api/clients';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useClients() {
    return useQuery({
        queryKey: QUERY_KEYS.clients,
        queryFn: () => apiClient.getAll(),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch Clients");
            console.error(error);
        },
    });
}

export function useClient(id) {
    return useQuery({
        queryKey: QUERY_KEYS.client(id),
        queryFn: () => apiClient.getById(id),
        enabled: !!id,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch Client");
            console.error(error);
        },
    });
}

export function useClientsFromCache(id) {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(QUERY_KEYS.client(id));
}