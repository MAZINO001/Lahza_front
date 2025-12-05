// src/features/logs/hooks/useLogs.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/utils/axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Pure API functions
const apiLog = {
    getAll: () => api.get(`${API_URL}/logs`).then((res) => res.data ?? []),
    getById: (id) =>
        api.get(`${API_URL}/logs/${id}`).then((res) => res.data?.service ?? res.data ?? null),
};

export function useLogs() {
    return useQuery({
        queryKey: ["logs"],
        queryFn: apiLog.getAll,
        staleTime: 5 * 60 * 1000,
    });
}

export function useLog(id) {
    return useQuery({
        queryKey: ["logs", id],
        queryFn: () => apiLog.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}
