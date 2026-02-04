import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleApiError = (error, fallbackMsg) => {
    console.error(error);
    toast.info(error?.response?.data?.message || fallbackMsg);
};

const projectsApi = {
    getAll: () =>
        api.get(`${API_URL}/projects`).then((res) => res.data ?? []),

    getById: (id) =>
        api.get(`${API_URL}/project/${id}`).then((res) => res.data),

    create: (data) =>
        api.post(`${API_URL}/projects`, data).then((res) => res.data),

    update: (id, data) =>
        api.put(`${API_URL}/project/${id}`, data).then((res) => res.data),

    delete: (id) => api.delete(`${API_URL}/projects/${id}`),

    getProjectTeam: (id) => api.get(`${API_URL}/project/team/${id}`).then((res) => res.data),

    addAssignment: (data) =>
        api.post(`${API_URL}/addAssignment`, data).then((res) => res.data),

    deleteAssignment: (data) =>
        api.delete(`${API_URL}/deleteAssignment`, { data }),
};

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: projectsApi.getAll,
        staleTime: 0,
        onError: (error) => handleApiError(error, "Failed to fetch projects"),
    });
}

export function useProject(id) {
    return useQuery({
        queryKey: ["projects", id],
        queryFn: () => projectsApi.getById(id),
        enabled: !!id,
        onError: (error) => handleApiError(error, "Failed to fetch project"),
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectsApi.create,
        onSuccess: () => {
            toast.success("Project created successfully!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (error) => handleApiError(error, "Failed to create project"),
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => projectsApi.update(id, data),
        onSuccess: () => {
            toast.success("Project updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (error) => handleApiError(error, "Failed to update project"),
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectsApi.delete,
        onSuccess: () => {
            toast.success("Project deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (error) => handleApiError(error, "Failed to delete project"),
    });
}

export function useProjectTeam(id) {
    return useQuery({
        queryKey: ["projectTeam", id],
        queryFn: () => projectsApi.getProjectTeam(id),
        enabled: !!id,
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => handleApiError(error, "Failed to fetch project team"),
    });
}

export function useAddProjectAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectsApi.addAssignment,
        onSuccess: (_, { project_id }) => {
            toast.success("Project assigned successfully!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["projectTeamMembers", project_id] });
            queryClient.refetchQueries({ queryKey: ["projectTeamMembers", project_id] });
        },
        onError: (error) => handleApiError(error, "Failed to assign project"),
    });
}

export function useDeleteProjectAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectsApi.deleteAssignment,
        onSuccess: (_, { project_id }) => {
            toast.success("Project assignment removed successfully!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["projectTeamMembers", project_id] });
        },
        onError: (error) => handleApiError(error, "Failed to remove project assignment"),
    });
}
