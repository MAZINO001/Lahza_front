import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiProjects } from '@/lib/api/projects';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useMarkAsComplete() {
    const queryClient = useQueryClient();
    
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
        
        onSuccess: (response, id) => {
            queryClient.setQueryData(QUERY_KEYS.projects, (old) =>
                old?.map(project =>
                    project.id === id ? response : project
                ) || []
            );
            
            queryClient.setQueryData(QUERY_KEYS.project(id), response);
            toast.success("Project marked as complete!");
        },
        
        onError: (error, id, context) => {
            if (context?.previousProjects) {
                queryClient.setQueryData(QUERY_KEYS.projects, context.previousProjects);
            }
            if (context?.previousProject) {
                queryClient.setQueryData(QUERY_KEYS.project(id), context.previousProject);
            }
            toast.error(error?.response?.data?.message || "Failed to mark project as complete");
            console.error(error);
        },
    });
}
