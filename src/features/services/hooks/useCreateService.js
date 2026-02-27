import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiService } from '@/lib/api/services';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useCreateService() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: (data) => apiService.create(data),

        // Optimistic update before server response
        onMutate: async (newServiceData) => {
            // Cancel in-flight queries
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.services });

            // Snapshot previous state
            const previousServices = queryClient.getQueryData(QUERY_KEYS.services);

            // Add optimistic item with temp ID
            const tempId = `temp-${Date.now()}`;
            queryClient.setQueryData(QUERY_KEYS.services, (old) => [
                ...(old || []),
                { ...newServiceData, id: tempId }
            ]);

            return { previousServices, tempId };
        },

        // Update with server response (replace temp ID with real ID)
        onSuccess: async (response, variables, context) => {
            const tempId = context?.tempId;
            queryClient.setQueryData(QUERY_KEYS.services, (old) =>
                old?.map(service =>
                    service.id === tempId ? response : service
                ) || []
            );
            await cacheInvalidator.invalidateDependentsOnly('services', { parallel: false });
            toast.success("Service created!");
        },

        // Rollback on error
        onError: (error, variables, context) => {
            if (context?.previousServices) {
                queryClient.setQueryData(QUERY_KEYS.services, context.previousServices);
            }
            toast.error(error?.response?.data?.message || "Failed to create service");
            console.error(error);
        },
    });
}