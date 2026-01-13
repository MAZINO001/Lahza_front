import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleApiError = (error, fallbackMsg) => {
    console.error(error);
    toast.error(error?.response?.data?.message || fallbackMsg);
};

const rolesApi = {
    getAll: (page = 1) =>
        api.get(`${API_URL}/roles?page=${page}`).then((res) => res.data ?? []),

    getById: (id) =>
        api.get(`${API_URL}/roles/${id}`).then((res) => res.data ?? null),

    create: (data) =>
        api.post(`${API_URL}/roles`, data),

    update: (id, data) =>
        api.put(`${API_URL}/roles/${id}`, data),

    delete: (id) => api.delete(`${API_URL}/roles/${id}`),

    getUserRoles: (userId) =>
        api.get(`${API_URL}/users/${userId}/roles`).then((res) => res.data ?? []),

    assignRoleToUser: (userId, roleId) =>
        api.post(`${API_URL}/users/${userId}/roles/${roleId}`),

    removeRoleFromUser: (userId, roleId) =>
        api.delete(`${API_URL}/users/${userId}/roles/${roleId}`),
};

export function useRoles(page = 1) {
    return useQuery({
        queryKey: ["roles", page],
        queryFn: () => rolesApi.getAll(page),
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => handleApiError(error, "Failed to fetch roles"),
    });
}

export function useRole(id) {
    return useQuery({
        queryKey: ["roles", id],
        queryFn: () => rolesApi.getById(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => handleApiError(error, "Failed to fetch role"),
    });
}

export function useCreateRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rolesApi.create,
        onSuccess: () => {
            toast.success("Role created successfully!");
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: (error) => handleApiError(error, "Failed to create role"),
    });
}

export function useUpdateRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => rolesApi.update(id, data),
        onSuccess: () => {
            toast.success("Role updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: (error) => handleApiError(error, "Failed to update role"),
    });
}

export function useDeleteRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => rolesApi.delete(id),
        onSuccess: () => {
            toast.success("Role deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: (error) => handleApiError(error, "Failed to delete role"),
    });
}

export function useUserRoles(userId) {
    return useQuery({
        queryKey: ["userRoles", userId],
        queryFn: () => rolesApi.getUserRoles(userId),
        enabled: !!userId,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => handleApiError(error, "Failed to fetch user roles"),
    });
}

export function useAssignRoleToUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, roleId }) => rolesApi.assignRoleToUser(userId, roleId),
        onSuccess: (_, { userId }) => {
            toast.success("Role assigned successfully!");
            queryClient.invalidateQueries({ queryKey: ["userRoles", userId] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => handleApiError(error, "Failed to assign role"),
    });
}

export function useRemoveRoleFromUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, roleId }) => rolesApi.removeRoleFromUser(userId, roleId),
        onSuccess: (_, { userId }) => {
            toast.success("Role removed successfully!");
            queryClient.invalidateQueries({ queryKey: ["userRoles", userId] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => handleApiError(error, "Failed to remove role"),
    });
}
