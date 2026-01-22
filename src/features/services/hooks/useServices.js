import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiService } from '@/lib/api/services';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useServices() {
    return useQuery({
        queryKey: QUERY_KEYS.services,
        queryFn: () => apiService.getAll(),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch services");
            console.error(error);
        },
    });
}

export function useService(id) {
    return useQuery({
        queryKey: QUERY_KEYS.service(id), // FIXED: Use service(id) not services
        queryFn: () => apiService.getById(id),
        enabled: !!id,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch service");
            console.error(error);
        },
    });
}

export function useServicesFromCache(id) {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(QUERY_KEYS.service(id)); // FIXED: Use service(id) not client(id)
}