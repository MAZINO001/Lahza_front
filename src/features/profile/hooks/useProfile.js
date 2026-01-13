import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiProfile = {
    updateProfile: (data) => {
        // Check if there's a file in the data
        let hasFile = false;

        if (data instanceof FormData) {
            hasFile = data.has('profile_image') && data.get('profile_image') instanceof File;
        }

        // If there's a file, keep FormData with multipart
        if (hasFile) {
            return api.put(`${API_URL}/user/profile`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => res.data);
        }

        // Convert FormData to JSON object for regular requests
        if (data instanceof FormData) {
            const jsonData = {};
            for (let [key, value] of data.entries()) {
                jsonData[key] = value;
            }
            return api.put(`${API_URL}/user/profile`, jsonData).then(res => res.data);
        }

        // Otherwise, send as regular JSON
        return api.put(`${API_URL}/user/profile`, data).then(res => res.data);
    },

    getProfile: () =>
        api.get(`${API_URL}/user/profile`).then(res => res.data),
};

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: apiProfile.updateProfile,
        onSuccess: (response) => {
            console.log("Profile update response:", response);
            toast.success("Profile updated successfully!");
            // Invalidate and refetch the profile query
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            // Optionally, immediately update the cache with the response data
            queryClient.setQueryData(["profile"], response.user);
        },
        onError: (error) => {
            console.error("Full error object:", error);
            console.error("Error response data:", error?.response?.data);
            toast.error(error?.response?.data?.message || "Failed to update profile");
        },
    });
}

export function useProfile() {
    return useQuery({
        queryKey: ["profile"],
        queryFn: apiProfile.getProfile,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch profile");
        },
    });
}