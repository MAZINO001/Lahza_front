import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleApiError = (error, fallbackMsg) => {
    console.error(error);
    toast.error(error?.response?.data?.message || fallbackMsg);
};

const objectivesApi = {
    getAll: () =>
        api.get(`${API_URL}/objectives`).then((res) => res.data ?? []),

    getById: (id) =>
        api.get(`${API_URL}/objectives/${id}`).then((res) => res.data),

    create: (data) =>
        api.post(`${API_URL}/objectives`, data).then((res) => res.data),

    update: (id, data) =>
        api.put(`${API_URL}/objectives/${id}`, data).then((res) => res.data),

    delete: (id) => api.delete(`${API_URL}/objectives/${id}`),
};

export function useObjectives() {
    return useQuery({
        queryKey: ["objectives"],
        queryFn: objectivesApi.getAll,
        staleTime: 0,
        onError: (error) => handleApiError(error, "Failed to fetch objectives"),
    });
}

export function useObjective(id) {
    return useQuery({
        queryKey: ["objectives", id],
        queryFn: () => objectivesApi.getById(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        onSuccess: () => {
            toast.success("Objective fetched successfully!");
        },
        onError: (error) => handleApiError(error, "Failed to fetch objective"),
    });
}

export function useCreateObjective() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: objectivesApi.create,
        onSuccess: () => {
            toast.success("Objective created successfully!");
            queryClient.invalidateQueries({ queryKey: ["objectives"] });
        },
        onError: (error) => handleApiError(error, "Failed to create objective"),
    });
}

export function useUpdateObjective() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => objectivesApi.update(id, data),
        onSuccess: () => {
            toast.success("Objective updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["objectives"] });
        },
        onError: (error) => handleApiError(error, "Failed to update objective"),
    });
}

export function useDeleteObjective() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: objectivesApi.delete,
        onSuccess: () => {
            toast.success("Objective deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["objectives"] });
        },
        onError: (error) => handleApiError(error, "Failed to delete objective"),
    });
}
