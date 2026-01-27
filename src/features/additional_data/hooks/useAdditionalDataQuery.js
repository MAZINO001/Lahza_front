import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiAdditionalData = {
    getByProject: (projectId) =>
        api.get(`${API_URL}/additional-data/project/${projectId}`).then((res) => res.data ?? null),

    create: (data) => {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (data[key] === null || data[key] === undefined) return;

            if (Array.isArray(data[key])) {
                if (data[key].length === 0) return;

                if (data[key][0] instanceof File) {
                    console.log(`Appending ${key}[] with ${data[key].length} files`);
                    data[key].forEach((file) => {
                        formData.append(`${key}[]`, file);
                    });
                } else {
                    console.log(`Appending ${key} as JSON array`);
                    formData.append(key, JSON.stringify(data[key]));
                }
            }
            else if (data[key] instanceof File) {
                console.log(`Appending single file ${key}`);
                formData.append(key, data[key]);
            }
            else {
                console.log(`Appending text ${key}`);
                formData.append(key, data[key]);
            }
        });

        console.log("FormData being sent:");
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  ${key}: File(${value.name})`);
            } else {
                console.log(`  ${key}:`, value);
            }
        }

        return api.post(`${API_URL}/additional-data`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => res.data);
    },

    update: (id, data) => {
        console.log("Update data received:", data);
        const formData = new FormData();

        formData.append('_method', 'PUT');


        const fileFields = ['logo', 'media_files', 'other', 'specification_file'];

        Object.keys(data).forEach(key => {
            if (data[key] === null || data[key] === undefined) {
                console.log(`Skipping ${key}: null/undefined`);
                return;
            }

            if (Array.isArray(data[key])) {
                console.log(`${key} is array with ${data[key].length} items`);

                // Handle file fields - send all files (both new and existing)
                if (fileFields.includes(key)) {
                    console.log(`Appending ${key}[] with ${data[key].length} files`);
                    data[key].forEach((file) => {
                        if (file instanceof File) {
                            formData.append(`${key}[]`, file);
                        }
                    });
                } else {
                    // Other arrays (like social_media) - skip if empty
                    if (data[key].length === 0) {
                        console.log(`Skipping ${key}: empty array`);
                        return;
                    }
                    // Send as single JSON
                    console.log(`Appending ${key} as JSON array`);
                    formData.append(key, JSON.stringify(data[key]));
                }
            }
            else if (data[key] instanceof File) {
                console.log(`Appending single file ${key}`);
                formData.append(key, data[key]);
            }
            else {
                console.log(`Appending ${key}: ${data[key]}`);
                formData.append(key, data[key]);
            }
        });

        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  ${key}: File(${value.name})`);
            } else {
                console.log(`  ${key}: ${value}`);
            }
        }

        return api.post(`${API_URL}/additional-data/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => res.data);
    },
    delete: (id) =>
        api.delete(`${API_URL}/additional-data/${id}`).then((res) => res.data),

    search: (type, fileable_type, fileable_id) =>
        api.post(`${API_URL}/file-search`, {
            type,
            fileable_type,
            fileable_id,
        }).then((res) => res.data),
};

// Get additional data for a specific project
export function useAdditionalData(projectId) {
    return useQuery({
        queryKey: ["additional-data", projectId],
        queryFn: () => apiAdditionalData.getByProject(projectId),
        enabled: !!projectId,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch additional data");
        },
    });
}

// Create new additional data
export function useCreateAdditionalData() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => apiAdditionalData.create(data),
        onSuccess: (response, variables) => {
            toast.success("Additional data created!");
            if (variables.project_id) {
                queryClient.invalidateQueries({ queryKey: ["additional-data", variables.project_id] });
            }
            queryClient.invalidateQueries({ queryKey: ["additional-data"] });
            queryClient.invalidateQueries({ queryKey: ["file-search"] });
        },
        refetchOnWindowFocus: true,
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to create additional data.";
            toast.error(errorMessage);
            console.error("Creation error:", error?.response?.data);
        },
    });
}

export function useUpdateAdditionalData() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiAdditionalData.update(id, data),
        onSuccess: (response, { data }) => {
            toast.success("Additional data updated!");
            if (data.project_id) {
                queryClient.invalidateQueries({ queryKey: ["additional-data", data.project_id] });
            }
            queryClient.invalidateQueries({ queryKey: ["additional-data"] });
            queryClient.invalidateQueries({ queryKey: ["file-search"] });
        },
        refetchOnWindowFocus: true,
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to update additional data.";
            toast.error(errorMessage);
            console.error("Update error:", error?.response?.data);
        },
    });
}

// Delete additional data
export function useDeleteAdditionalData() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, projectId }) => apiAdditionalData.delete(id),
        onSuccess: (response, { projectId }) => {
            toast.success("Additional data deleted");
            if (projectId) {
                queryClient.invalidateQueries({ queryKey: ["additional-data", projectId] });
            }
            queryClient.invalidateQueries({ queryKey: ["additional-data"] });
        },
        refetchOnWindowFocus: true,
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to delete additional data.";
            toast.error(errorMessage);
            console.error("Deletion error:", error?.response?.data);
        },
    });
}


export function useSearchFile(type, fileable_type, fileable_id) {
    return useQuery({
        queryKey: ["file-search", type, fileable_type, fileable_id],
        queryFn: () => apiAdditionalData.search(type, fileable_type, fileable_id),
        enabled: !!(type && fileable_type && fileable_id),
        staleTime: 5 * 60 * 1000, // 5 minutes
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to search file";
            toast.error(errorMessage);
            console.error("Search error:", error);
        },
    });
}