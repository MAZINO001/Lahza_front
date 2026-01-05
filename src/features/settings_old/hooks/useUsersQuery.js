import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleApiError = (error, fallbackMsg) => {
    console.error(error);
    toast.error(error?.response?.data?.message || fallbackMsg);
};

const usersApi = {
    getAll: () =>
        api.get(`${API_URL}/users`).then((res) => res.data ?? []),

    getById: (id) =>
        api.get(`${API_URL}/users/${id}`).then((res) => res.data ?? null),

    create: (data) =>
        api.post(`${API_URL}/users`, data),

    update: (id, data) =>
        api.put(`${API_URL}/users/${id}`, data),

    delete: (id) => api.delete(`${API_URL}/users/${id}`),
};

export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: usersApi.getAll,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => handleApiError(error, "Failed to fetch users"),
    });
}

export function useUser(id) {
    return useQuery({
        queryKey: ["users", id],
        queryFn: () => usersApi.getById(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => handleApiError(error, "Failed to fetch user"),
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersApi.create,
        onSuccess: () => {
            toast.success("User created successfully!");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => handleApiError(error, "Failed to create user"),
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => usersApi.update(id, data),
        onSuccess: () => {
            toast.success("User updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => handleApiError(error, "Failed to update user"),
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => usersApi.delete(id),
        onSuccess: () => {
            toast.success("User deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => handleApiError(error, "Failed to delete user"),
    });
}
