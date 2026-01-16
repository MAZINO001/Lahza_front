import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleApiError = (error, fallbackMsg) => {
    console.error(error);
    toast.error(error?.response?.data?.message || fallbackMsg);
};

const usersApi = {
    getAll: (page = 1) =>
        api.get(`${API_URL}/users-all?page=${page}`).then((res) => res.data ?? []),

    getById: (id) =>
        api.get(`${API_URL}/users/${id}`).then((res) => res.data ?? null),

    create: (data) =>
        api.post(`${API_URL}/users`, data),

    update: (id, data) =>
        api.put(`${API_URL}/users/${id}`, data),

    delete: (id) => api.delete(`${API_URL}/users/${id}`),

    updateEmail: (data) =>
        api.put(`${API_URL}/user/email_update`, data),

    updatePassword: (data) =>
        api.put(`${API_URL}/user/password_update`, data),
};

export function useUsers(page = 1) {
    return useQuery({
        queryKey: ["users", page],
        queryFn: () => usersApi.getAll(page),
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

export function useUpdateEmail() {
    return useMutation({
        mutationFn: usersApi.updateEmail,
        onSuccess: () => {
            toast.success("Email updated successfully!");
        },
        onError: (error) => handleApiError(error, "Failed to update email"),
    });
}

export function useUpdatePassword() {
    return useMutation({
        mutationFn: usersApi.updatePassword,
        onSuccess: () => {
            toast.success("Password updated successfully!");
        },
        onError: (error) => handleApiError(error, "Failed to update password"),
    });
}
