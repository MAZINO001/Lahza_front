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

    create: (data) => api.post(`${API_URL}/projects`, data).then((res) => res.data),

    update: (id, data) => api.put(`${API_URL}/projects/${id}`, data).then((res) => res.data),

    delete: (id) => api.delete(`${API_URL}/projects/${id}`).then((res) => res.data),

    getProgress: (id) => api.get(`${API_URL}/getProgress/${id}`).then((res) => res.data),
};

// Get all projects
export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: apiProject.getAll,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}

// Get a single project by ID
export function useProject(id) {
    return useQuery({
        queryKey: ["project", id],
        queryFn: () => apiProject.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}

// Get project progress
export function useProjectProgress(id) {
    return useQuery({
        queryKey: ["projectProgress", id],
        queryFn: () => apiProject.getProgress(id),
        enabled: !!id,
        retry: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}

// Create a new project
export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiProject.create,
        onSuccess: () => {
            toast.success("Project created!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        refetchOnWindowFocus: true,
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to create project.";
            toast.error(errorMessage);
            console.error("Project creation error:", error);
        },
    });
}

// Update an existing project
export function useUpdateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiProject.update(id, data),
        onSuccess: (response, { id }) => {
            toast.success("Project updated!");
            // Invalidate both the list and the specific project
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["projects", id] });
            queryClient.invalidateQueries({ queryKey: ["projectProgress", id] });
        },
        refetchOnWindowFocus: true,
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to update project.";
            toast.error(errorMessage);
            console.error("Project update error:", error);
        },
    });
}

// Delete a project
export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiProject.delete(id),
        onSuccess: (response, id) => {
            toast.success("Project deleted");
            // Invalidate all project-related queries
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            // Remove the specific project from cache
            queryClient.removeQueries({ queryKey: ["projects", id] });
            queryClient.removeQueries({ queryKey: ["projectProgress", id] });
            // Also invalidate related data
            queryClient.invalidateQueries({ queryKey: ["tasks", id] });
            queryClient.invalidateQueries({ queryKey: ["additional-data", id] });
        },
        refetchOnWindowFocus: true,
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to delete project.";
            toast.error(errorMessage);
            console.error("Project deletion error:", error);
        },
    });
}