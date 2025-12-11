/* eslint-disable no-unused-vars */
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// const apiAdditionalData = {
//     getByProject: (projectId) => api.get(`${API_URL}/additional-data/project/${projectId}`).then((res) => res.data ?? null),

//     create: (data) =>
//         api.post(`${API_URL}/additional-data`, data).then((res) => res.data),

//     update: (id, data) =>
//         api.put(`${API_URL}/additional-data/${id}`, data).then((res) => res.data),

//     delete: (id) =>
//         api.delete(`${API_URL}/additional-data/${id}`).then((res) => res.data),
// };


const apiAdditionalData = {
    getByProject: (projectId) =>
        api.get(`${API_URL}/additional-data/project/${projectId}`).then((res) => res.data ?? null),

    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {

                if (Array.isArray(data[key]) && data[key][0] instanceof File) {
                    data[key].forEach(file => {
                        formData.append(`${key}[]`, file);
                    });
                }

                else if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                }

                else {
                    formData.append(key, data[key]);
                }
            }
        });

        return api.post(`${API_URL}/additional-data`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => res.data);
    },

    update: (id, data) => {
        const formData = new FormData();


        formData.append('_method', 'PUT');

        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                if (Array.isArray(data[key]) && data[key][0] instanceof File) {
                    if (key === 'logo') {
                        formData.append('logo', data[key][0]);
                    } else {
                        data[key].forEach(file => {
                            formData.append(`${key}[]`, file);
                        });
                    }
                }
                else if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                }
                else {
                    formData.append(key, data[key]);
                }
            }
        });

        return api.post(`${API_URL}/additional-data/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => res.data);
    },

    delete: (id) =>
        api.delete(`${API_URL}/additional-data/${id}`).then((res) => res.data),
};



export function useAdditionalData(projectId) {
    return useQuery({
        queryKey: ["additional-data", projectId],
        queryFn: () => apiAdditionalData.getByProject(projectId),
        enabled: !!projectId,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}

export function useCreateAdditionalData() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => apiAdditionalData.create(data),
        onSuccess: (_, variables) => {
            toast.success("Additional data created!");
            queryClient.invalidateQueries({ queryKey: ["additional-data", variables.project_id] });
        },
        onError: (error) => {
            toast.error("Failed to create additional data.");
            console.error("Creation error:", error);
        },
        refetchOnWindowFocus: true,
    });
}

export function useUpdateAdditionalData() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiAdditionalData.update(id, data),
        onSuccess: (_, { data }) => {
            toast.success("Additional data updated!");
            queryClient.invalidateQueries({ queryKey: ["additional-data", data.project_id] });
        },
        onError: (error) => {
            toast.error("Failed to update additional data.");
            console.error("Update error:", error);
        },
        refetchOnWindowFocus: true,
    });
}

export function useDeleteAdditionalData() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, projectId }) => apiAdditionalData.delete(id),
        onSuccess: (_, { projectId }) => {
            toast.success("Additional data deleted");
            queryClient.invalidateQueries({ queryKey: ["additional-data", projectId] });
        },
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error("Failed to delete additional data.");
            console.error("Deletion error:", error);
        }
    });
}
