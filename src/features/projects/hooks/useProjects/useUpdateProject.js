import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiProjects } from '@/lib/api/projects';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { createCacheInvalidator } from '@/lib/CacheInvalidationManager';

export function useUpdateProject() {
    const queryClient = useQueryClient();
    const cacheInvalidator = createCacheInvalidator(queryClient);

    return useMutation({
        mutationFn: ({ id, data }) => apiProjects.update(id, data),

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.projects });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.project(id) });

            const previousProjects = queryClient.getQueryData(QUERY_KEYS.projects);
            const previousProject = queryClient.getQueryData(QUERY_KEYS.project(id));

            queryClient.setQueryData(QUERY_KEYS.projects, (old) =>
                old?.map(project =>
                    project.id === id ? { ...project, ...data } : project
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.project(id), (old) =>
                old ? { ...old, ...data } : old
            );

            return { previousProjects, previousProject };
        },

        onSuccess: async (response, { id }) => {
            queryClient.setQueryData(QUERY_KEYS.projects, (old) =>
                old?.map(project =>
                    project.id === id ? response : project
                ) || []
            );
            queryClient.setQueryData(QUERY_KEYS.project(id), response);
            await cacheInvalidator.invalidateDependentsOnly('projects', { parallel: false });
            toast.success("Project updated!");
        },

        onError: (error, { id }, context) => {
            if (context?.previousProjects) {
                queryClient.setQueryData(QUERY_KEYS.projects, context.previousProjects);
            }
            if (context?.previousProject) {
                queryClient.setQueryData(QUERY_KEYS.project(id), context.previousProject);
            }
            toast.error(error?.response?.data?.message || "Failed to update project");
            console.error(error);
        },
    });
}
