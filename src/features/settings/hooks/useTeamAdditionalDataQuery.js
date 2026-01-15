import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleApiError = (error, fallbackMsg) => {
    console.error(error);
    toast.error(error?.response?.data?.message || fallbackMsg);
};

const teamAdditionalDataApi = {
    get: (teamUserId) =>
        api.get(`${API_URL}/team-additional-data/${teamUserId}`).then((res) => res.data ?? null),

    create: (data) => {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            // Skip empty file fields
            if (key === 'contract_file' || key === 'cv') {
                if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                }
            } else if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
                formData.append(key, data[key]);
            }
        });

        return api.post(`${API_URL}/team-additional-data`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => res.data ?? []);
    },

    update: (teamUserId, data) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.keys(data).forEach(key => {
            if (key === 'contract_file' || key === 'cv') {
                if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                }
            } else if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
                formData.append(key, data[key]);
            }
        });
        console.log(formData)

        return api.put(`${API_URL}/team-additional-data/${teamUserId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => res.data);
    },

    delete: (teamUserId) =>
        api.delete(`${API_URL}/team-additional-data/${teamUserId}`).then((res) => res.data),
};

export function useTeamAdditionalData(teamUserId) {
    return useQuery({
        queryKey: ["team-additional-data", teamUserId],
        queryFn: () => teamAdditionalDataApi.get(teamUserId),
        enabled: !!teamUserId,
        onError: (error) => handleApiError(error, "Failed to fetch team additional data"),
    });
}

export function useCreateTeamAdditionalData() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: teamAdditionalDataApi.create,
        onSuccess: () => {
            toast.success("Team additional data created successfully!");
            queryClient.invalidateQueries({ queryKey: ["team-additional-data"] });
        },
        onError: (error) => handleApiError(error, "Failed to create team additional data"),
    });
}

export function useUpdateTeamAdditionalData() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ teamUserId, data }) => teamAdditionalDataApi.update(teamUserId, data),
        onSuccess: (_, { teamUserId }) => {
            toast.success("Team additional data updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["team-additional-data", teamUserId] });
        },
        onError: (error) => handleApiError(error, "Failed to update team additional data"),
    });
}

export function useDeleteTeamAdditionalData() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (teamUserId) => teamAdditionalDataApi.delete(teamUserId),
        onSuccess: (_, teamUserId) => {
            toast.success("Team additional data deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["team-additional-data", teamUserId] });
        },
        onError: (error) => handleApiError(error, "Failed to delete team additional data"),
    });
}