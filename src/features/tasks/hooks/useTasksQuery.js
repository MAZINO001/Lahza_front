import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;


const apiTask = {
    getAll: () => api.get(`${API_URL}/tasks`).then((res) => res.data ?? []),

    getById: (id) =>
        api.get(`${API_URL}/tasks/${id}`)
            .then((res) => res.data?.task ?? res.data ?? null),

    create: (data) =>
        api.post(`${API_URL}/tasks`, data).then((res) => res.data),

    update: (id, data) =>
        api.put(`${API_URL}/tasks/${id}`, data).then((res) => res.data),

    delete: (id) =>
        api.delete(`${API_URL}/tasks/${id}`).then((res) => res.data),
};



export function useTasks() {
    return useQuery({
        queryKey: ["tasks"],
        queryFn: apiTask.getAll,
        staleTime: 5 * 60 * 1000,
    });
}

export function useTask(id) {
    return useQuery({
        queryKey: ["tasks", id],
        queryFn: () => apiTask.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}


export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiTask.create,
        onSuccess: () => {
            toast.success("Task created!");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiTask.update(id, data),
        onSuccess: () => {
            toast.success("Task updated!");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiTask.delete,
        onSuccess: () => {
            toast.success("Task deleted");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}
