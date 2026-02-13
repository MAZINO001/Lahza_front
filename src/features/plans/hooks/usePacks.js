// src/features/plans/hooks/usePacks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios"; // your axios instance
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/queryKeys";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export function usePacks({ activeOnly = false } = {}) {
    return useQuery({
        queryKey: [...QUERY_KEYS.packs, { activeOnly }],
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
        queryKey: QUERY_KEYS.pack(packId),
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
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.packs });
        },
        onSuccess: () => {
            toast.success("Pack created successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.packs });
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
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.packs });
        },
        onSuccess: (_, { id }) => {
            toast.success("Pack updated");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            if (id) queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pack(id) });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.packs });
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
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.packs });
        },
        onSuccess: () => {
            toast.success("Pack deleted");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.packs });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not delete pack";
            toast.error(msg);
        },
    });
}