import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiProjects } from '@/lib/api/projects';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useCreateProject() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: apiProjects.create,

        // Optimistic update before server response
        onMutate: async (newProjectData) => {
            // Cancel in-flight queries
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.projects });

            // Snapshot previous state
            const previousProjects = queryClient.getQueryData(QUERY_KEYS.projects);

            // Add optimistic item with temp ID
            const tempId = `temp-${Date.now()}`;
            queryClient.setQueryData(QUERY_KEYS.projects, (old) => [
                ...(old || []),
                { ...newProjectData, id: tempId }
            ]);

            return { previousProjects, tempId };
        },

        // Update with server response (replace temp ID with real ID)
        onSuccess: async (response, variables, context) => {
            queryClient.setQueryData(QUERY_KEYS.projects, (old) =>
                old?.map(project =>
                    project.id === context?.tempId ? response : project
                ) || []
            );
            await cacheInvalidator.invalidateDependentsOnly('projects', { parallel: false });
            toast.success("Project created!");
        },

        // Rollback on error
        onError: (error, variables, context) => {
            if (context?.previousProjects) {
                queryClient.setQueryData(QUERY_KEYS.projects, context.previousProjects);
            }
            toast.error(error?.response?.data?.message || "Failed to create project");
            console.error(error);
        },
    });
}
