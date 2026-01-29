import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiProjects } from '@/lib/api/projects';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useProjectProgress(id) {
    return useQuery({
        queryKey: ['projectProgress', id],
        queryFn: () => apiProjects.getProgress(id),
        enabled: !!id,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch project progress");
            console.error(error);
        },
    });
}
