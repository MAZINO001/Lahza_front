import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiTickets = {

    getTickets: () => api.get(`${API_URL}/tickets`).then(res => res.data),


    getTicket: (id) => api.get(`${API_URL}/tickets/${id}`).then(res => res.data),


    createTicket: (data) => {
        if (data instanceof FormData) {
            return api.post(`${API_URL}/tickets`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => res.data);
        }

        return api.post(`${API_URL}/tickets`, data).then(res => res.data);
    },


    updateTicket: (id, data) => {

        let hasFile = false;

        if (data instanceof FormData) {
            hasFile = data.has('attachment') && data.get('attachment') instanceof File;
        }


        if (hasFile) {
            return api.post(`${API_URL}/tickets/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => res.data);
        }


        if (data instanceof FormData) {
            const jsonData = {};
            for (let [key, value] of data.entries()) {
                jsonData[key] = value;
            }
            return api.put(`${API_URL}/tickets/${id}`, jsonData).then(res => res.data);
        }


        return api.put(`${API_URL}/tickets/${id}`, data).then(res => res.data);
    },


    deleteTicket: (id) => api.delete(`${API_URL}/tickets/${id}`).then(res => res.data),


    searchTickets: (query) => api.get(`${API_URL}/tickets?search=${encodeURIComponent(query)}`).then(res => res.data),
};


export function useTickets() {
    return useQuery({
        queryKey: ["tickets"],
        queryFn: apiTickets.getTickets,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch tickets");
        },
    });
}


export function useTicket(id) {
    return useQuery({
        queryKey: ["tickets", id],
        queryFn: () => apiTickets.getTicket(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch ticket");
        },
    });
}


export function useCreateTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: apiTickets.createTicket,
        onSuccess: (response) => {
            toast.success("Ticket created successfully!");

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


export function useUpdateTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => apiTickets.updateTicket(id, data),
        onSuccess: (response, variables) => {
            toast.success("Ticket updated successfully!");

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


export function useDeleteTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: apiTickets.deleteTicket,
        onSuccess: () => {
            toast.success("Ticket deleted successfully!");

            queryClient.invalidateQueries({ queryKey: ["tickets"] });
        },
        onError: (error) => {
            console.error("Full error object:", error);
            console.error("Error response data:", error?.response?.data);
            toast.error(error?.response?.data?.message || "Failed to delete ticket");
        },
    });
}


export function useSearchTickets() {
    return useMutation({
        mutationFn: apiTickets.searchTickets,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to search tickets");
        },
    });
}


export const useTicketsLegacy = () => {
    const { data: tickets, isLoading, error, refetch } = useTickets();
    const createTicketMutation = useCreateTicket();
    const updateTicketMutation = useUpdateTicket();
    const deleteTicketMutation = useDeleteTicket();
    const searchTicketsMutation = useSearchTickets();

    const createTicket = async (ticketData) => {

        if (!ticketData.user_id) {
            throw new Error("User ID is required. Please make sure you are logged in.");
        }


        const transformedData = {
            user_id: ticketData.user_id,
            title: ticketData.subject || ticketData.title,
            description: ticketData.description,
            category: ticketData.category,
            subcategory: ticketData.subcategory || null,
            status: ticketData.status || 'open',
            priority: ticketData.priority === 'critical' ? 'urgent' : ticketData.priority,
        };


        if (ticketData.attachments && ticketData.attachments.length > 0) {
            const formData = new FormData();


            Object.keys(transformedData).forEach(key => {
                if (transformedData[key] !== null && transformedData[key] !== undefined) {
                    formData.append(key, transformedData[key]);
                }
            });


            if (ticketData.attachments[0] instanceof File) {
                formData.append('attachment', ticketData.attachments[0]);
            }

            return createTicketMutation.mutateAsync(formData);
        }


        return createTicketMutation.mutateAsync(transformedData);
    };

    const updateTicket = async (id, ticketData) => {

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


        if (ticketData.attachments && ticketData.attachments.length > 0) {
            const formData = new FormData();


            Object.keys(transformedData).forEach(key => {
                if (transformedData[key] !== null && transformedData[key] !== undefined) {
                    formData.append(key, transformedData[key]);
                }
            });


            if (ticketData.attachments[0] instanceof File) {
                formData.append('attachment', ticketData.attachments[0]);
            }


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