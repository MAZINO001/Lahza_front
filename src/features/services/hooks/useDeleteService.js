import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiService } from '@/lib/api/services';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useDeleteService() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: (id) => apiService.delete(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.services });

            const previousServices = queryClient.getQueryData(QUERY_KEYS.services);

            queryClient.setQueryData(QUERY_KEYS.services, (old) =>
                old?.filter(service => service.id !== id) || []
            );

            queryClient.removeQueries({ queryKey: QUERY_KEYS.service(id) });

            return { previousServices };
        },

        onError: (error, id, context) => {
            if (context?.previousServices) {
                queryClient.setQueryData(QUERY_KEYS.services, context.previousServices);
            }
            toast.error(error?.response?.data?.message || "Failed to delete service");
            console.error(error);
        },

        onSuccess: async () => {
            await cacheInvalidator.invalidateDependentsOnly('services', { parallel: false });
            toast.success("Service deleted");
        },
    });
}