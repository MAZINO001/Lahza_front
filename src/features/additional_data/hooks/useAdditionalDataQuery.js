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
            if (data[key] !== null && data[key] !== undefined) {
                // Handle array of files
                if (Array.isArray(data[key]) && data[key].length > 0) {
                    // Check if first element is a File
                    if (data[key][0] instanceof File) {
                        data[key].forEach((file, index) => {
                            // Use index in key name for proper handling
                            formData.append(`${key}[${index}]`, file);
                        });
                    } else {
                        // Not files, just append as is
                        formData.append(key, JSON.stringify(data[key]));
                    }
                }
                // Handle single file
                else if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                }
                // Handle regular data
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
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                // Handle array of files
                if (Array.isArray(data[key]) && data[key].length > 0) {
                    // Check if first element is a File
                    if (data[key][0] instanceof File) {
                        // Special handling for logo field (single file)
                        if (key === 'logo') {
                            formData.append('logo', data[key][0]);
                        } else {
                            // For other file arrays, use indexed notation
                            data[key].forEach((file, index) => {
                                formData.append(`${key}[${index}]`, file);
                            });
                        }
                    } else {
                        // Not files, just append as is
                        formData.append(key, JSON.stringify(data[key]));
                    }
                }
                // Handle single file
                else if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                }
                // Handle regular data
                else {
                    formData.append(key, data[key]);
                }
            }
        });

        return api.put(`${API_URL}/additional-data/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => res.data);
    },

    delete: (id) =>
        api.delete(`${API_URL}/additional-data/${id}`).then((res) => res.data),

    download: (filePath) =>
        api.post(`${API_URL}/file-search`, {
            type: "download",
            file_path: filePath,
        }, {
            responseType: 'blob'
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
            // Invalidate the project-specific additional data
            if (variables.project_id) {
                queryClient.invalidateQueries({ queryKey: ["additional-data", variables.project_id] });
            }
            // Also invalidate all additional data queries to be safe
            queryClient.invalidateQueries({ queryKey: ["additional-data"] });
        },
        refetchOnWindowFocus: true,
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to create additional data.";
            toast.error(errorMessage);
            console.error("Creation error:", error?.response?.data);
        },
    });
}

// Update existing additional data
export function useUpdateAdditionalData() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiAdditionalData.update(id, data),
        onSuccess: (response, { data }) => {
            toast.success("Additional data updated!");
            // Invalidate the project-specific additional data
            if (data.project_id) {
                queryClient.invalidateQueries({ queryKey: ["additional-data", data.project_id] });
            }
            // Also invalidate all additional data queries
            queryClient.invalidateQueries({ queryKey: ["additional-data"] });
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
            // Invalidate the project-specific additional data
            if (projectId) {
                queryClient.invalidateQueries({ queryKey: ["additional-data", projectId] });
            }
            // Also invalidate all additional data queries
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

// Download file
export function useDownloadFile() {
    return useMutation({
        mutationFn: ({ filePath, fileName }) => {
            if (!filePath) {
                throw new Error("No file path provided");
            }
            return apiAdditionalData.download(filePath).then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                    "download",
                    fileName || filePath.split("/").pop() || "download",
                );
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
                return { fileName, filePath };
            });
        },
        onSuccess: (response) => {
            toast.success(`${response.fileName || "File"} downloaded successfully`);
        },
        onError: (error) => {
            const errorMessage = error?.message || "Failed to download file";
            toast.error(errorMessage);
            console.error("Download error:", error);
        },
    });
}