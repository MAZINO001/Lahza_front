import { useQuery } from "@tanstack/react-query";
import api from "@/lib/utils/axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiClientHistory = {
    getHistory: (clientId) =>
        api.get(`${API_URL}/clients/${clientId}/history`).then((res) => res.data ?? []),
};

export function useClientHistory(clientId) {
    return useQuery({
        queryKey: ["clientHistory", clientId],
        queryFn: () => apiClientHistory.getHistory(clientId),
        enabled: !!clientId,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
}