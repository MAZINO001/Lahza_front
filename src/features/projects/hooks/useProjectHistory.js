import { useQuery } from "@tanstack/react-query";
import api from "@/lib/utils/axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiProjectHistory = {
    getHistory: (clientId) =>
        api.get(`${API_URL}/projects/${clientId}/history`).then((res) => res.data ?? []),
};

export function useProjectHistory(clientId) {
    return useQuery({
        queryKey: ["projectsHistory", clientId],
        queryFn: () => apiProjectHistory.getHistory(clientId),
        enabled: !!clientId,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}