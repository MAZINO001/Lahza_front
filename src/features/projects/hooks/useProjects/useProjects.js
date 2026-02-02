import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiProjects } from '@/lib/api/projects';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useProjects(options) {
    options = options || {};
    var enabled = options.enabled !== undefined ? options.enabled : true;
    return useQuery({
        queryKey: QUERY_KEYS.projects,
        queryFn: apiProjects.getAll,
        enabled,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch projects");
            console.error(error);
        },
    });
}

export function useProject(id) {
    return useQuery({
        queryKey: QUERY_KEYS.project(id),
        queryFn: () => apiProjects.getById(id),
        enabled: !!id,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch project");
            console.error(error);
        },
    });
}

export function useProjectFromCache(id) {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(QUERY_KEYS.project(id));
}
