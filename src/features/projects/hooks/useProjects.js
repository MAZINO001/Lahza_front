import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Pure API functions
const apiProject = {
    getAll: () => api.get(`${API_URL}/projects`).then((res) => res.data ?? []),
    getById: (id) =>
        api.get(`${API_URL}/project/${id}`)
            .then((res) => res.data?.Project ?? res.data ?? null),
    create: (data) => api.post(`${API_URL}/projects`, data),
    update: (id, data) => api.put(`${API_URL}/projects/${id}`, data),
    delete: (id) => api.delete(`${API_URL}/projects/${id}`),
    getProgress: (id) => api.get(`${API_URL}/getProgress/${id}`),
};

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: apiProject.getAll,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}

export function useProjectProgress(id) {
    return useQuery({
        queryKey: ["projectProgress", id],
        queryFn: () => apiProject.getProgress(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}

export function useProject(id) {
    return useQuery({
        queryKey: ["projects", id],
        queryFn: () => apiProject.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiProject.create,
        onSuccess: () => {
            toast.success("Project created!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        refetchOnWindowFocus: true,
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiProject.update(id, data),
        onSuccess: () => {
            toast.success("Project updated!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        refetchOnWindowFocus: true,
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiProject.delete,
        onSuccess: () => {
            toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },

        refetchOnWindowFocus: true,
    });
}