// src/features/services/hooks/useServices.ts
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Pure API functions
const apiService = {
    getAll: () => api.get(`${API_URL}/services`).then((res) => res.data ?? []),
    getById: (id) =>
        api.get(`${API_URL}/services/${id}`).then((res) => res.data?.service ?? res.data ?? null),
    create: (data) => api.post(`${API_URL}/services`, data),
    update: (id, data) => api.put(`${API_URL}/services/${id}`, data),
    delete: (id) => api.delete(`${API_URL}/services/${id}`),
};

export function useServices() {
    return useQuery({
        queryKey: ["services"],
        queryFn: apiService.getAll,
        staleTime: 5 * 60 * 1000,
    });
}

export function useService(id) {
    return useQuery({
        queryKey: ["services", id],
        queryFn: () => apiService.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateService() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.create,
        onSuccess: () => {
            toast.success("Service created!");
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });
}

export function useUpdateService() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiService.update(id, data),
        onSuccess: () => {
            toast.success("Service updated!");
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });
}

export function useDeleteService() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiService.delete,
        onSuccess: () => {
            toast.success("Service deleted");
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });
}