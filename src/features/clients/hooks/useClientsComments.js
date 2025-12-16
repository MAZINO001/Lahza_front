import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const commentApi = {
    getAll: () => api.get(`${API_URL}/comments`).then(res => res.data ?? []),
    getByType: (type, id) =>
        api.get(`${API_URL}/comments/${type}/${id}`).then(res => res.data ?? []),
    getByUser: (userId) =>
        api.get(`${API_URL}/comments/user/${userId}`).then(res => res.data ?? []),
    create: (type, id, data) => api.post(`${API_URL}/comments/${type}/${id}`, data),
    delete: (commentId) => api.delete(`${API_URL}/comments/${commentId}`),
};

// Queries
export function useComments() {
    return useQuery({
        queryKey: ["comments"],
        queryFn: commentApi.getAll,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCommentsByType(type, id) {
    return useQuery({
        queryKey: ["comments", type, id],
        queryFn: () => commentApi.getByType(type, id),
        enabled: !!type && !!id,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCommentsByUser(userId) {
    return useQuery({
        queryKey: ["comments", "user", userId],
        queryFn: () => commentApi.getByUser(userId),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    });
}

// Mutations
export function useCreateComment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ type, id, data }) => commentApi.create(type, id, data),
        onSuccess: () => {
            toast.success("Comment added successfully!");
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
        onError: () => toast.error("Failed to add comment"),
    });
}

export function useDeleteComment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: commentApi.delete,
        onSuccess: () => {
            toast.success("Comment deleted!");
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
        onError: () => toast.error("Failed to delete comment"),
    });
}
