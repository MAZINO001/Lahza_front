import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiTask = {
    // Get all tasks across all projects
    getAllTasks: () => api.get(`${API_URL}/tasks`).then((res) => res.data ?? []),

    // Get tasks for a specific project (filter from all tasks)
    getByProject: async (projectId) => {
        const response = await api.get(`${API_URL}/tasks`);
        const allTasks = response.data ?? [];
        return allTasks.filter(task => task.project_id === parseInt(projectId));
    },

    create: (projectId, data) =>
        api.post(`${API_URL}/projects/tasks/${projectId}`, data).then((res) => res.data),

    update: (projectId, taskId, data) =>
        api.put(`${API_URL}/projects/tasks/${projectId}/${taskId}`, data).then((res) => res.data),

    updateStatus: (taskId, data) =>
        api.put(`${API_URL}/task/${taskId}`, data).then((res) => res.data),

    markComplete: (taskId) =>
        api.put(`${API_URL}/task/${taskId}`, { status: 'completed' }).then((res) => res.data),

    delete: (projectId, taskId) =>
        api.delete(`${API_URL}/projects/tasks/${projectId}/${taskId}`).then((res) => res.data),
};

// Get all tasks (no project filter)
export function useAllTasks() {
    return useQuery({
        queryKey: ["tasks"],
        queryFn: () => apiTask.getAllTasks(),
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch tasks");
        },
    });
}

// Get tasks for a specific project
export function useTasks(projectId) {
    return useQuery({
        queryKey: ["tasks", projectId],
        queryFn: () => apiTask.getByProject(projectId),
        enabled: !!projectId,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch tasks");
        },
    });
}

// Get a single task by ID
export function useTask(projectId, taskId) {
    return useQuery({
        queryKey: ["tasks", projectId, taskId],
        queryFn: async () => {
            const tasks = await apiTask.getByProject(projectId);
            return tasks.find(task => task.id === parseInt(taskId)) || null;
        },
        enabled: !!(projectId && taskId),
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch task");
        },
    });
}

// Create a new task
export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, data }) => apiTask.create(projectId, data),
        onSuccess: (_, { projectId }) => {
            toast.success("Task created!");
            // Invalidate both the project-specific tasks and all tasks
            queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }, refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create task");
        },
    });
}

// Update a task
export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, taskId, data }) => apiTask.update(projectId, taskId, data),
        onSuccess: (_, { projectId }) => {
            toast.success("Task updated!");
            queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }, refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update task");
        },
    });
}

// Update task status (uses the separate status route)
export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, data }) => apiTask.updateStatus(taskId, data),
        onSuccess: (_, { projectId }) => {
            toast.success("Task status updated!");
            // If projectId is provided, invalidate project-specific tasks
            if (projectId) {
                queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
            }
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }, refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update task status");
        },
    });
}

// Delete a task
export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, taskId }) => apiTask.delete(projectId, taskId),
        onSuccess: (_, { projectId }) => {
            toast.success("Task deleted");
            queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }, refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete task");
        },
    });
}

// Mark task as complete
export function useMarkTaskComplete() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, projectId }) => {
            if (projectId) {
                // If projectId is provided, use the project-specific endpoint
                return apiTask.update(projectId, taskId, { status: 'completed' });
            } else {
                // Otherwise use the standalone endpoint
                return apiTask.markComplete(taskId);
            }
        },
        onSuccess: (_, { projectId }) => {
            toast.success("Task marked as complete!");
            if (projectId) {
                queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
            }
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }, refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to mark task as complete");
        },
    });
}