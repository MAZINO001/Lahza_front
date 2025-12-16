import { useQuery } from "@tanstack/react-query";
import api from "@/lib/utils/axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const emailsApi = {
    getById: (id) =>
        api.get(`${API_URL}/clients/${id}/emails`).then(res => res.data ?? []),
};


export function useEmailsById(id) {
    return useQuery({
        queryKey: ["comments", id],
        queryFn: () => emailsApi.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}
