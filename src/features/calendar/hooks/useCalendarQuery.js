import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const eventsApi = {
    getAll: () =>
        api.get(`${API_URL}/events`).then(res => res.data ?? []),
    getById: (id) =>
        api.get(`${API_URL}/events/${id}`).then(res => res.data),
    create: (data) =>
        api.post(`${API_URL}/events`, data).then(res => res.data),
    update: (id, data) =>
        api.put(`${API_URL}/events/${id}`, data).then(res => res.data),
    delete: (id) =>
        api.delete(`${API_URL}/events/${id}`).then(res => res.data),
};

export function useEvents() {
    return useQuery({
        queryKey: ["events"],
        queryFn: eventsApi.getAll,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 2,
        onError: (error) => {
            console.log(error)
            toast.error(error?.response?.data?.message || "Failed to fetch events");
        },
    });
}

export function useEventById(id) {
    return useQuery({
        queryKey: ["events", id],
        queryFn: () => eventsApi.getById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        retry: 2,
        onError: (error) => {
            console.log(error)
            toast.error(error?.response?.data?.message || "Failed to fetch event");
        },
    });
}

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eventsApi.create,
        onSuccess: () => {
            toast.success("Event created successfully");
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error) => {
            console.log(error)
            toast.error(error?.response?.data?.message || "Failed to create event");
        },
    });
}

export function useUpdateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => eventsApi.update(id, data),
        onSuccess: (_, variables) => {
            toast.success("Event updated successfully");
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["events", variables.id] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update event");
        },
    });
}

export function useDeleteEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => eventsApi.delete(id),
        onSuccess: (_, deletedId) => {
            toast.success("Event deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["events", deletedId] });
        },
        onError: (error) => {
            console.log(error)
            toast.error(error?.response?.data?.message || "Failed to delete event");
        },
    });
}
