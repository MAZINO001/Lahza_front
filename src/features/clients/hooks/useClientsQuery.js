import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiClient = {
    getAll: () =>
        api.get(`${API_URL}/clients`).then((res) => res.data ?? []),
    getById: (id) =>
        api
            .get(`${API_URL}/clients/${id}`)
            .then((res) => res.data ?? null),
    create: (data) => api.post(`${API_URL}/clients`, data),
    update: (id, data) => api.put(`${API_URL}/clients/${id}`, data),
    delete: (id) => api.delete(`${API_URL}/clients/${id}`),
};

export function useClients() {
    return useQuery({
        queryKey: ["clients"],
        queryFn: apiClient.getAll,
        staleTime: 5 * 60 * 1000,
    });
}

export function useClient(id) {
    return useQuery({
        queryKey: ["clients", id],
        queryFn: () => apiClient.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiClient.create,
        onSuccess: () => {
            toast.success("Client created successfully!");
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
        onError: (error) =>
            toast.error(
                error?.response?.data?.message || "Failed to create client"
            ),
    });
}

export function useUpdateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiClient.update(id, data),
        onSuccess: () => {
            toast.success("Client updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
        onError: () => toast.error("Failed to update client"),
    });
}

export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (url) => apiClient.delete(url),
        onSuccess: () => {
            toast.success("Client deleted");
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
        onError: () => {
            toast.error("Failed to delete client");
        },
    });
}
