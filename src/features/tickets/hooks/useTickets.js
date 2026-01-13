// src/features/tickets/hooks/useTickets.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiTickets = {
    // Get all tickets
    getTickets: () => api.get(`${API_URL}/tickets`).then(res => res.data),

    // Get single ticket
    getTicket: (id) => api.get(`${API_URL}/tickets/${id}`).then(res => res.data),

    // Create ticket
    createTicket: (data) => {
        console.log("=== API CREATE TICKET ===");
        console.log("Data type:", typeof data);
        console.log("Data is FormData:", data instanceof FormData);

        if (data instanceof FormData) {
            // Log FormData contents
            console.log("FormData contents:");
            for (let [key, value] of data.entries()) {
                console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
            }

            return api.post(`${API_URL}/tickets`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => res.data);
        }

        // For JSON requests, log the payload
        console.log("JSON payload:", data);
        return api.post(`${API_URL}/tickets`, data).then(res => res.data);
    },

    // Update ticket
    updateTicket: (id, data) => {
        // Check if there are files in the data
        let hasFile = false;

        if (data instanceof FormData) {
            hasFile = data.has('attachment') && data.get('attachment') instanceof File;
        }

        // If there's a file, keep FormData with multipart
        if (hasFile) {
            return api.post(`${API_URL}/tickets/${id}?_method=PUT`, data, {
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
            return api.put(`${API_URL}/tickets/${id}`, jsonData).then(res => res.data);
        }

        // Otherwise, send as regular JSON
        return api.put(`${API_URL}/tickets/${id}`, data).then(res => res.data);
    },

    // Delete ticket
    deleteTicket: (id) => api.delete(`${API_URL}/tickets/${id}`).then(res => res.data),

    // Search tickets
    searchTickets: (query) => api.get(`${API_URL}/tickets?search=${encodeURIComponent(query)}`).then(res => res.data),
};

// Hook for getting all tickets
export function useTickets() {
    return useQuery({
        queryKey: ["tickets"],
        queryFn: apiTickets.getTickets,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch tickets");
        },
    });
}

// Hook for getting a single ticket
export function useTicket(id) {
    return useQuery({
        queryKey: ["tickets", id],
        queryFn: () => apiTickets.getTicket(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch ticket");
        },
    });
}

// Hook for creating a ticket
export function useCreateTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: apiTickets.createTicket,
        onSuccess: (response) => {
            toast.success("Ticket created successfully!");
            // Invalidate and refetch the tickets list
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            return response;
        },
        onError: (error) => {
            console.error("Full error object:", error);
            console.error("Error response data:", error?.response?.data);
            toast.error(error?.response?.data?.message || "Failed to create ticket");
        },
    });
}

// Hook for updating a ticket
export function useUpdateTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => apiTickets.updateTicket(id, data),
        onSuccess: (response, variables) => {
            toast.success("Ticket updated successfully!");
            // Invalidate and refetch the tickets list and the specific ticket
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            queryClient.invalidateQueries({ queryKey: ["tickets", variables.id] });
            return response;
        },
        onError: (error) => {
            console.error("Full error object:", error);
            console.error("Error response data:", error?.response?.data);
            toast.error(error?.response?.data?.message || "Failed to update ticket");
        },
    });
}

// Hook for deleting a ticket
export function useDeleteTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: apiTickets.deleteTicket,
        onSuccess: () => {
            toast.success("Ticket deleted successfully!");
            // Invalidate and refetch the tickets list
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
        },
        onError: (error) => {
            console.error("Full error object:", error);
            console.error("Error response data:", error?.response?.data);
            toast.error(error?.response?.data?.message || "Failed to delete ticket");
        },
    });
}

// Hook for searching tickets
export function useSearchTickets() {
    return useMutation({
        mutationFn: apiTickets.searchTickets,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to search tickets");
        },
    });
}

// Legacy hook for backward compatibility (combines multiple queries)
export const useTicketsLegacy = () => {
    const { data: tickets, isLoading, error, refetch } = useTickets();
    const createTicketMutation = useCreateTicket();
    const updateTicketMutation = useUpdateTicket();
    const deleteTicketMutation = useDeleteTicket();
    const searchTicketsMutation = useSearchTickets();

    const createTicket = async (ticketData) => {
        // Validate user_id is present
        if (!ticketData.user_id) {
            throw new Error("User ID is required. Please make sure you are logged in.");
        }

        // Transform data to match backend requirements
        const transformedData = {
            user_id: ticketData.user_id, // Now required
            title: ticketData.subject || ticketData.title,
            description: ticketData.description,
            category: ticketData.category,
            subcategory: ticketData.subcategory || null,
            status: ticketData.status || 'open',
            priority: ticketData.priority === 'critical' ? 'urgent' : ticketData.priority,
        };

        // Handle attachments (file upload)
        if (ticketData.attachments && ticketData.attachments.length > 0) {
            const formData = new FormData();

            // Add all form fields
            Object.keys(transformedData).forEach(key => {
                if (transformedData[key] !== null && transformedData[key] !== undefined) {
                    formData.append(key, transformedData[key]);
                }
            });

            // Add attachments (take first file as 'attachment' for backend)
            if (ticketData.attachments[0] instanceof File) {
                formData.append('attachment', ticketData.attachments[0]);
            }

            return createTicketMutation.mutateAsync(formData);
        }

        // For JSON requests, don't send attachment field at all if no files
        return createTicketMutation.mutateAsync(transformedData);
    };

    const updateTicket = async (id, ticketData) => {
        // Transform data to match backend requirements
        const transformedData = {};

        if (ticketData.title !== undefined) transformedData.title = ticketData.title;
        if (ticketData.subject !== undefined) transformedData.title = ticketData.subject;
        if (ticketData.description !== undefined) transformedData.description = ticketData.description;
        if (ticketData.category !== undefined) transformedData.category = ticketData.category;
        if (ticketData.subcategory !== undefined) transformedData.subcategory = ticketData.subcategory;
        if (ticketData.status !== undefined) transformedData.status = ticketData.status;
        if (ticketData.priority !== undefined) {
            transformedData.priority = ticketData.priority === 'critical' ? 'urgent' : ticketData.priority;
        }
        if (ticketData.assigned_to !== undefined) transformedData.assigned_to = ticketData.assigned_to;

        // Handle attachments
        if (ticketData.attachments && ticketData.attachments.length > 0) {
            const formData = new FormData();

            // Add all form fields
            Object.keys(transformedData).forEach(key => {
                if (transformedData[key] !== null && transformedData[key] !== undefined) {
                    formData.append(key, transformedData[key]);
                }
            });

            // Add attachments (take first file as 'attachment' for backend)
            if (ticketData.attachments[0] instanceof File) {
                formData.append('attachment', ticketData.attachments[0]);
            }

            // Add method override for Laravel
            formData.append('_method', 'PUT');

            return updateTicketMutation.mutateAsync({ id, data: formData });
        }

        return updateTicketMutation.mutateAsync({ id, data: transformedData });
    };

    const deleteTicket = async (id) => {
        return deleteTicketMutation.mutateAsync(id);
    };

    const searchTickets = async (query) => {
        return searchTicketsMutation.mutateAsync(query);
    };

    const getTicketStats = async () => {
        if (!tickets) return null;

        const totalTickets = tickets.length;
        const openTickets = tickets.filter(t => t.status === 'open').length;
        const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
        const resolvedTickets = tickets.filter(t => t.status === 'closed').length;
        const closedTickets = tickets.filter(t => t.status === 'closed').length;
        const highPriorityTickets = tickets.filter(t => t.priority === 'high').length;
        const urgentPriorityTickets = tickets.filter(t => t.priority === 'urgent').length;

        return {
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            closedTickets,
            highPriorityTickets,
            urgentPriorityTickets,
        };
    };

    return {
        data: tickets || [],
        loading: isLoading,
        error,
        refetch,
        createTicket,
        updateTicket,
        deleteTicket,
        searchTickets,
        getTicketStats,
        isCreating: createTicketMutation.isPending,
        isUpdating: updateTicketMutation.isPending,
        isDeleting: deleteTicketMutation.isPending,
        isSearching: searchTicketsMutation.isPending,
    };
};