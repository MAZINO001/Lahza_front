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
        api.get(`${API_URL}/user`).then((res) => {
            console.log("Raw API response:", res.data);
            const preferences = res.data?.preferences ?? {};
            console.log("Extracted preferences:", preferences);
            // Ensure the preferences structure matches the backend format
            const formattedPreferences = {
                ui: {
                    language: preferences.ui?.language || "en",
                    dark_mode: preferences.ui?.dark_mode || false,
                    currency: preferences.ui?.currency || "eur",
                },
                mail: {
                    payments: preferences.mail?.payments ?? true,
                    invoices: preferences.mail?.invoices ?? true,
                    quotes: preferences.mail?.quotes ?? true,
                    offers: preferences.mail?.offers ?? true,
                },
                browser: {
                    payments: preferences.browser?.payments ?? true,
                    invoices: preferences.browser?.invoices ?? false,
                    quotes: preferences.browser?.quotes ?? true,
                    offers: preferences.browser?.offers ?? true,
                },
            };
            console.log("Formatted preferences:", formattedPreferences);
            return formattedPreferences;
        }),

    update: (data) => {
        console.log("API call - updating preferences with data:", data);
        console.log("Payload being sent to /user/preferences:", JSON.stringify(data, null, 2));
        return api.put(`${API_URL}/user/preferences`, data).then((res) => {
            console.log("API response - preferences updated:", res.data);
            console.log("Full response structure:", JSON.stringify(res.data, null, 2));
            return res.data;
        }).catch(error => {
            console.error("Error updating preferences:", error);
            console.error("Error response:", error?.response?.data);
            throw error;
        });
    },
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
            console.log("Update successful, received data:", data);
            toast.success("Preferences updated successfully!");

            // Refetch preferences to see if currency was stored
            setTimeout(() => {
                console.log("Refetching preferences to check if currency was stored...");
                queryClient.invalidateQueries({ queryKey: ["preferences"] });
            }, 1000);

            queryClient.setQueryData(["preferences"], data.preferences);
            queryClient.invalidateQueries({ queryKey: ["preferences"] });
        },
        onError: (error) => {
            console.error("Update failed:", error);
            handleApiError(error, "Failed to update preferences");
        },
    });
}
