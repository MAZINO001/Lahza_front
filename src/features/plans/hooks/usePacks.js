// src/features/plans/hooks/usePacks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios"; // your axios instance
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export function usePacks({ activeOnly = false } = {}) {
    return useQuery({
        queryKey: ["packs", { activeOnly }],
        queryFn: async () => {
            const endpoint = activeOnly ? "/packs/active" : "/packs";
            const res = await api.get(`${API_URL}${endpoint}`);
            return res.data || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function usePack(packId) {
    return useQuery({
        queryKey: ["pack", packId],
        queryFn: async () => {
            if (!packId) return null;
            const res = await api.get(`${API_URL}/packs/${packId}`);
            return res.data?.pack || res.data || null;
        },
        enabled: !!packId,
        staleTime: 3 * 60 * 1000,
    });
}

export function useCreatePack() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await api.post(`${API_URL}/packs`, data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Pack created successfully");
            queryClient.invalidateQueries({ queryKey: ["packs"] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not create pack";
            toast.error(msg);
            console.error("Create pack failed:", error);
        },
    });
}

export function useUpdatePack() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...data }) => {
            const res = await api.put(`${API_URL}/packs/${id}`, data);
            return res.data;
        },
        onSuccess: (_, variables) => {
            toast.success("Pack updated");
            queryClient.invalidateQueries({ queryKey: ["packs"] });
            queryClient.invalidateQueries({ queryKey: ["pack", variables.id] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not update pack";
            toast.error(msg);
        },
    });
}

export function useDeletePack() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            await api.delete(`${API_URL}/packs/${id}`);
        },
        onSuccess: (_, id) => {
            toast.success("Pack deleted");
            queryClient.invalidateQueries({ queryKey: ["packs"] });
            queryClient.removeQueries({ queryKey: ["pack", id] });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not delete pack";
            toast.error(msg);
        },
    });
}