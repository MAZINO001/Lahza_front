import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiProjects } from '@/lib/api/projects';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useDeleteProject() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: (id) => apiProjects.delete(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.projects });
            const previousProjects = queryClient.getQueryData(QUERY_KEYS.projects);

            queryClient.setQueryData(QUERY_KEYS.projects, (old) =>
                old?.filter(project => project.id !== id) || []
            );

            return { previousProjects };
        },

        onSuccess: async (_, id) => {
            queryClient.removeQueries({ queryKey: QUERY_KEYS.project(id) });
            await cacheInvalidator.invalidateDependentsOnly('projects', { parallel: false });
            toast.success("Project deleted");
        },

        onError: (error, id, context) => {
            if (context?.previousProjects) {
                queryClient.setQueryData(QUERY_KEYS.projects, context.previousProjects);
            }
            toast.error(error?.response?.data?.message || "Failed to delete project");
            console.error(error);
        },
    });
}
