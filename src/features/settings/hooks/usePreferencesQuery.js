import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleApiError = (error, fallbackMsg) => {
    console.error(error);
    toast.error(error?.response?.data?.message || fallbackMsg);
};

const preferencesApi = {
    get: () =>
        api.get(`${API_URL}/user`).then((res) => res.data?.preferences ?? {}),

    update: (data) =>
        api.put(`${API_URL}/user/preferences`, data).then((res) => res.data),
};

export function usePreferences() {
    return useQuery({
        queryKey: ["preferences"],
        queryFn: preferencesApi.get,
        staleTime: 5 * 60 * 1000, // 5 minutes
        onError: (error) => handleApiError(error, "Failed to fetch preferences"),
    });
}

export function useUpdatePreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: preferencesApi.update,
        onSuccess: (data) => {
            toast.success("Preferences updated successfully!");
            queryClient.setQueryData(["preferences"], data.preferences);
            queryClient.invalidateQueries({ queryKey: ["preferences"] });
        },
        onError: (error) => handleApiError(error, "Failed to update preferences"),
    });
}
