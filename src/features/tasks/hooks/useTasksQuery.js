import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;


const apiTask = {
    getAll: (projectId) => api.get(`${API_URL}/projects/tasks/${projectId}`).then((res) => res.data ?? []),

    create: (projectId, data) =>
        api.post(`${API_URL}/projects/tasks/${projectId}`, data).then((res) => res.data),

    update: (projectId, taskId, data) =>
        api.put(`${API_URL}/projects/tasks/${projectId}/${taskId}`, data).then((res) => res.data),

    delete: (projectId, taskId) =>
        api.delete(`${API_URL}/projects/tasks/${projectId}/${taskId}`).then((res) => res.data),
};



export function useTasks(projectId) {
    return useQuery({
        queryKey: ["tasks", projectId],
        queryFn: () => apiTask.getAll(projectId),
        enabled: !!projectId,
        staleTime: 5 * 60 * 1000,
    });
}

export function useTask(projectId, taskId) {
    return useQuery({
        queryKey: ["tasks", projectId, taskId],
        queryFn: async () => {
            // Get all tasks for the project and find the specific task
            const response = await api.get(`${API_URL}/projects/tasks/${projectId}`);
            const tasks = response.data ?? [];
            return tasks.find(task => task.id === parseInt(taskId)) || null;
        },
        enabled: !!(projectId && taskId),
        staleTime: 5 * 60 * 1000,
    });
}


export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, data }) => apiTask.create(projectId, data),
        onSuccess: (_, { projectId }) => {
            toast.success("Task created!");
            queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, taskId, data }) => apiTask.update(projectId, taskId, data),
        onSuccess: (_, { projectId }) => {
            toast.success("Task updated!");
            queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, taskId }) => apiTask.delete(projectId, taskId),
        onSuccess: (_, { projectId }) => {
            toast.success("Task deleted");
            queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        },
    });
}
