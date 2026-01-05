import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleApiError = (error, fallbackMsg) => {
    console.error(error);
    toast.error(error?.response?.data?.message || fallbackMsg);
};

const teamsApi = {
    getAll: () =>
        api.get(`${API_URL}/teams`).then((res) => res.data ?? []),

    getById: (id) =>
        api.get(`${API_URL}/teams/${id}`).then((res) => res.data),

    create: (data) =>
        api.post(`${API_URL}/teams`, data).then((res) => res.data),

    update: (id, data) =>
        api.put(`${API_URL}/teams/${id}`, data).then((res) => res.data),

    delete: (id) => api.delete(`${API_URL}/teams/${id}`),
};

export function useTeams() {
    return useQuery({
        queryKey: ["teams"],
        queryFn: teamsApi.getAll,
        staleTime: 0,
        onError: (error) => handleApiError(error, "Failed to fetch teams"),
    });
}

export function useTeam(id) {
    return useQuery({
        queryKey: ["teams", id],
        queryFn: () => teamsApi.getById(id),
        enabled: !!id,
        onError: (error) => handleApiError(error, "Failed to fetch team"),
    });
}

export function useCreateTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: teamsApi.create,
        onSuccess: () => {
            toast.success("Team created successfully!");
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
        onError: (error) => handleApiError(error, "Failed to create team"),
    });
}

export function useUpdateTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => teamsApi.update(id, data),
        onSuccess: () => {
            toast.success("Team updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
        onError: (error) => handleApiError(error, "Failed to update team"),
    });
}

export function useDeleteTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: teamsApi.delete,
        onSuccess: () => {
            toast.success("Team deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
        onError: (error) => handleApiError(error, "Failed to delete team"),
    });
}
