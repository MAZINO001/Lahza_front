import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiProject = {
    getAll: () => api.get(`${API_URL}/projects`).then((res) => res.data ?? []),
    getById: (id) =>
        api.get(`${API_URL}/project/${id}`)
            .then((res) => res.data?.Project ?? res.data ?? null),
    create: (data) => api.post(`${API_URL}/projects`, data).then((res) => res.data),
    update: (id, data) => api.put(`${API_URL}/project/${id}`, data).then((res) => res.data),
    delete: (id) => api.delete(`${API_URL}/projects/${id}`).then((res) => res.data),
    getProgress: (id) => api.get(`${API_URL}/getProgress/${id}`).then((res) => res.data),
    getProjectTeam: (id) => api.get(`${API_URL}/project/team/${id}`).then((res) => res.data),
    postProjectDone: (id) => api.post(`${API_URL}/projects/${id}/complete`).then((res) => res.data),
};

export function useProjects(options) {
    options = options || {};
    let enabled = options.enabled !== undefined ? options.enabled : true;
    return useQuery({
        queryKey: ["projects"],
        queryFn: apiProject.getAll,
        staleTime: 0,
        enabled,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch projects");
        },
    });
}

export function useProject(id) {
    return useQuery({
        queryKey: ["project", id],
        queryFn: () => apiProject.getById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch project");
        },
    });
}

export function useProjectProgress(id) {
    return useQuery({
        queryKey: ["projectProgress", id],
        queryFn: () => apiProject.getProgress(id),
        enabled: !!id,
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch project progress");
        },
    });
}

export function useProjectTeam(id) {
    return useQuery({
        queryKey: ["projectTeam", id],
        queryFn: () => apiProject.getProjectTeam(id),
        enabled: !!id,
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch project team");
        },
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
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to create project.";
            toast.error(errorMessage);
            console.error("Project creation error:", error);
        },
    });
}

export function useMarkAsDone() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiProject.update(id, data),
        onSuccess: (response, { id }) => {
            toast.success("Project marked as done!");
            queryClient.invalidateQueries({ queryKey: ["project", id] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to mark project as done.";
            toast.error(errorMessage);
            console.error("Mark as done error:", error);
        },
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiProject.update(id, data),
        onSuccess: (response, { id }) => {
            toast.success("Project updated!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", id] });
            queryClient.invalidateQueries({ queryKey: ["projectProgress", id] });
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to update project.";
            toast.error(errorMessage);
            console.error("Project update error:", error);
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiProject.delete(id),
        onSuccess: (response, id) => {
            toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.removeQueries({ queryKey: ["project", id] });
            queryClient.removeQueries({ queryKey: ["projectProgress", id] });
            queryClient.invalidateQueries({ queryKey: ["tasks", id] });
            queryClient.invalidateQueries({ queryKey: ["additional-data", id] });
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to delete project.";
            toast.error(errorMessage);
            console.error("Project deletion error:", error);
        },
    });
}

export function useMarkAsComplete() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiProject.postProjectDone(id),
        onSuccess: (response, id) => {
            toast.success("Project marked as complete!");
            queryClient.invalidateQueries({ queryKey: ["project", id] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["tasks", id] });
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to mark project as complete.";
            toast.error(errorMessage);
            console.error("Mark as complete error:", error);
        },
    });
}