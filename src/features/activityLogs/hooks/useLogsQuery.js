/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// API functions
const apiLog = {
    getAll: async () => {
        try {
            const res = await api.get(`${API_URL}/logs`);
            return res.data ?? [];
        } catch (err) {
            throw new Error("Failed to fetch logs");
        }
    },

    getById: async (id) => {
        if (!id) return null;
        try {
            const res = await api.get(`${API_URL}/logs/${id}`);
            return res.data ?? null;
        } catch (err) {
            throw new Error("Failed to fetch log");
        }
    },
};

// Hooks
export function useLogs() {
    return useQuery({
        queryKey: ["logs"],
        queryFn: apiLog.getAll,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch logs");
        },
    });
}

export function useLog(id) {
    return useQuery({
        queryKey: ["logs", id],
        queryFn: () => apiLog.getById(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch log");
        },
    });

}
