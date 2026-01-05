import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleApiError = (error, fallbackMsg) => {
    console.error(error);
    toast.error(error?.response?.data?.message || fallbackMsg);
};

const permissionsApi = {
    getAll: () =>
        api.get(`${API_URL}/permissions`).then((res) => res.data ?? []),

    getById: (id) =>
        api.get(`${API_URL}/permissions/${id}`).then((res) => res.data),

    create: (data) =>
        api.post(`${API_URL}/permissions`, data).then((res) => res.data),

    update: (id, data) =>
        api.put(`${API_URL}/permissions/${id}`, data).then((res) => res.data),

    delete: (id) => api.delete(`${API_URL}/permissions/${id}`),

    // User permissions management
    assignToUser: (userId, permissionIds) =>
        api.post(`${API_URL}/users/${userId}/permissions`, { permission_ids: permissionIds }).then((res) => res.data),

    removeFromUser: (userId, permissionId) =>
        api.delete(`${API_URL}/users/${userId}/permissions/${permissionId}`).then((res) => res.data),

    getUserPermissions: (userId) =>
        api.get(`${API_URL}/users/${userId}/permissions`).then((res) => res.data ?? []),

    // Role permissions management
    assignToRole: (roleId, permissionIds) =>
        api.post(`${API_URL}/roles/${roleId}/permissions`, { permission_ids: permissionIds }).then((res) => res.data),

    removeFromRole: (roleId, permissionId) =>
        api.delete(`${API_URL}/roles/${roleId}/permissions/${permissionId}`).then((res) => res.data),

    getRolePermissions: (roleId) =>
        api.get(`${API_URL}/roles/${roleId}/permissions`).then((res) => res.data ?? []),
};

export function usePermissions() {
    return useQuery({
        queryKey: ["permissions"],
        queryFn: permissionsApi.getAll,
        staleTime: 0,
        onError: (error) => handleApiError(error, "Failed to fetch permissions"),
    });
}

export function usePermission(id) {
    return useQuery({
        queryKey: ["permissions", id],
        queryFn: () => permissionsApi.getById(id),
        enabled: !!id,
        onError: (error) => handleApiError(error, "Failed to fetch permission"),
    });
}

export function useCreatePermission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: permissionsApi.create,
        onSuccess: () => {
            toast.success("Permission created successfully!");
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
        onError: (error) => handleApiError(error, "Failed to create permission"),
    });
}

export function useUpdatePermission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => permissionsApi.update(id, data),
        onSuccess: () => {
            toast.success("Permission updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
        onError: (error) => handleApiError(error, "Failed to update permission"),
    });
}

export function useDeletePermission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: permissionsApi.delete,
        onSuccess: () => {
            toast.success("Permission deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
        onError: (error) => handleApiError(error, "Failed to delete permission"),
    });
}

// User permissions hooks
export function useUserPermissions(userId) {
    return useQuery({
        queryKey: ["user-permissions", userId],
        queryFn: () => permissionsApi.getUserPermissions(userId),
        enabled: !!userId,
        onError: (error) => handleApiError(error, "Failed to fetch user permissions"),
    });
}

export function useAssignPermissionsToUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, permissionIds }) => permissionsApi.assignToUser(userId, permissionIds),
        onSuccess: (_, { userId }) => {
            toast.success("Permissions assigned to user successfully!");
            queryClient.invalidateQueries({ queryKey: ["user-permissions", userId] });
        },
        onError: (error) => handleApiError(error, "Failed to assign permissions to user"),
    });
}

export function useRemovePermissionFromUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, permissionId }) => permissionsApi.removeFromUser(userId, permissionId),
        onSuccess: (_, { userId }) => {
            toast.success("Permission removed from user successfully!");
            queryClient.invalidateQueries({ queryKey: ["user-permissions", userId] });
        },
        onError: (error) => handleApiError(error, "Failed to remove permission from user"),
    });
}

// Role permissions hooks
export function useRolePermissions(roleId) {
    return useQuery({
        queryKey: ["role-permissions", roleId],
        queryFn: () => permissionsApi.getRolePermissions(roleId),
        enabled: !!roleId,
        onError: (error) => handleApiError(error, "Failed to fetch role permissions"),
    });
}

export function useAssignPermissionsToRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ roleId, permissionIds }) => permissionsApi.assignToRole(roleId, permissionIds),
        onSuccess: (_, { roleId }) => {
            toast.success("Permissions assigned to role successfully!");
            queryClient.invalidateQueries({ queryKey: ["role-permissions", roleId] });
        },
        onError: (error) => handleApiError(error, "Failed to assign permissions to role"),
    });
}

export function useRemovePermissionFromRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ roleId, permissionId }) => permissionsApi.removeFromRole(roleId, permissionId),
        onSuccess: (_, { roleId }) => {
            toast.success("Permission removed from role successfully!");
            queryClient.invalidateQueries({ queryKey: ["role-permissions", roleId] });
        },
        onError: (error) => handleApiError(error, "Failed to remove permission from role"),
    });
}
