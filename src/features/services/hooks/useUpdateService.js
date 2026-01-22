import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiService } from '@/lib/api/services';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useUpdateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => apiService.update(id, data),

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.services });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.service(id) });

            const previousServices = queryClient.getQueryData(QUERY_KEYS.services);
            const previousService = queryClient.getQueryData(QUERY_KEYS.service(id));

            queryClient.setQueryData(QUERY_KEYS.services, (old) =>
                old?.map(service =>
                    service.id === id ? { ...service, ...data } : service
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.service(id), (old) =>
                old ? { ...old, ...data } : old
            );

            return { previousServices, previousService };
        },

        onSuccess: (response, { id }) => {
            queryClient.setQueryData(QUERY_KEYS.services, (old) =>
                old?.map(service =>
                    service.id === id ? response : service
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.service(id), response);
            toast.success("Service updated!");
        },

        onError: (error, { id }, context) => {
            if (context?.previousServices) {
                queryClient.setQueryData(QUERY_KEYS.services, context.previousServices);
            }
            if (context?.previousService) {
                queryClient.setQueryData(QUERY_KEYS.service(id), context.previousService);
            }
            toast.error(error?.response?.data?.message || "Failed to update service");
            console.error(error);
        },
    });
}