import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiProjects } from '@/lib/api/projects';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useMarkAsComplete() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: (id) => apiProjects.postProjectDone(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.projects });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.project(id) });

            const previousProjects = queryClient.getQueryData(QUERY_KEYS.projects);
            const previousProject = queryClient.getQueryData(QUERY_KEYS.project(id));

            // Optimistically update project status
            queryClient.setQueryData(QUERY_KEYS.projects, (old) =>
                old?.map(project =>
                    project.id === id ? { ...project, status: 'completed' } : project
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.project(id), (old) =>
                old ? { ...old, status: 'completed' } : old
            );

            return { previousProjects, previousProject };
        },

        onSuccess: async (response, id) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project(id) });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["tasks", id] });
            await cacheInvalidator.invalidateDependentsOnly('projects', { parallel: false });
            toast.success("Project marked as complete!");
        },

        onError: (error, id, context) => {
            if (context?.previousProjects) {
                queryClient.setQueryData(QUERY_KEYS.projects, context.previousProjects);
            }
            if (context?.previousProject) {
                queryClient.setQueryData(QUERY_KEYS.project(id), context.previousProject);
            }

            // Handle specific INVALID_STATUS error
            if (error?.response?.data?.message?.includes('INVALID_STATUS')) {
                toast.info("Only projects with status 'in_progress' can be marked as complete");
            } else {
                toast.error(error?.response?.data?.message || "Failed to mark project as complete");
            }
            console.error(error);
        },
    });
}
