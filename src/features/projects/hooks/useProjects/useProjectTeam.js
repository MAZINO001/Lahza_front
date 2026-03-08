import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiProjects } from '@/lib/api/projects';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useProjectTeam(id) {
    return useQuery({
        queryKey: ['projectTeam', id],
        queryFn: () => apiProjects.getProjectTeam(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnMount: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch project team");
            console.error(error);
        },
    });
}
