import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiProjectSettings = {
    getServices: (projectId) =>
        api.get(`${API_URL}/projects/${projectId}/services`).then((res) => res.data ?? []),
    getTeamMembers: (projectId) =>
        api.get(`${API_URL}/project/team/${projectId}`).then((res) => res.data ?? []),
    getInvoices: (projectId) =>
        api.get(`${API_URL}/projects/${projectId}/invoices`).then((res) => res.data ?? []),
    getInvoiceById: (projectId, invoiceId) =>
        api.get(`${API_URL}/projects/${projectId}/invoices/${invoiceId}`).then((res) => res.data),
    deleteService: (projectId, serviceId) =>
        api.delete(`${API_URL}/projects/${projectId}/services/${serviceId}`).then((res) => res.data),
    removeTeamMember: (projectId, userId) =>
        api.delete(`${API_URL}/project/team/${projectId}/${userId}`).then((res) => res.data),
    deleteInvoice: (projectId, invoiceId) =>
        api.delete(`${API_URL}/projects/${projectId}/invoices/${invoiceId}`).then((res) => res.data),
};

export function useProjectServices(projectId) {
    return useQuery({
        queryKey: ["projectServices", projectId],
        queryFn: () => apiProjectSettings.getServices(projectId),
        enabled: !!projectId,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch project services");
        },
    });
}

export function useProjectTeamMembers(projectId) {
    return useQuery({
        queryKey: ["projectTeamMembers", projectId],
        queryFn: () => apiProjectSettings.getTeamMembers(projectId),
        enabled: !!projectId,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch project team members");
        },
    });
}

export function useProjectInvoices(projectId) {
    return useQuery({
        queryKey: ["projectInvoices", projectId],
        queryFn: () => apiProjectSettings.getInvoices(projectId),
        enabled: !!projectId,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch project invoices");
        },
    });
}

export function useProjectInvoiceById(projectId, invoiceId) {
    return useQuery({
        queryKey: ["projectInvoice", projectId, invoiceId],
        queryFn: () => apiProjectSettings.getInvoiceById(projectId, invoiceId),
        enabled: !!projectId && !!invoiceId,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch invoice details");
        },
    });
}

export function useDeleteProjectService() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, serviceId }) => apiProjectSettings.deleteService(projectId, serviceId),
        onSuccess: (_, { projectId }) => {
            toast.success("Service removed from project!");
            queryClient.invalidateQueries({ queryKey: ["projectServices", projectId] });
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to remove service from project.";
            toast.error(errorMessage);
            console.error("Service deletion error:", error);
        },
    });
}

export function useRemoveProjectTeamMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, userId }) => apiProjectSettings.removeTeamMember(projectId, userId),
        onSuccess: (_, { projectId }) => {
            toast.success("Team member removed from project!");
            queryClient.invalidateQueries({ queryKey: ["projectTeamMembers", projectId] });
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to remove team member from project.";
            toast.error(errorMessage);
            console.error("Team member removal error:", error);
        },
    });
}

export function useDeleteProjectInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, invoiceId }) => apiProjectSettings.deleteInvoice(projectId, invoiceId),
        onSuccess: (_, { projectId }) => {
            toast.success("Invoice removed from project!");
            queryClient.invalidateQueries({ queryKey: ["projectInvoices", projectId] });
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to remove invoice from project.";
            toast.error(errorMessage);
            console.error("Invoice deletion error:", error);
        },
    });
}