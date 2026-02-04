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
    assignServiceToProject: (data) =>
        api.post(`${API_URL}/project/service/assign`, data).then((res) => res.data),
    assignProjectToInvoice: (data) =>
        api.post(`${API_URL}/project/invoice/assign`, data).then((res) => res.data),
};

export function useProjectServices(projectId) {
    return useQuery({
        queryKey: ["projectServices", projectId],
        queryFn: () => apiProjectSettings.getServices(projectId),
        enabled: !!projectId,
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        cacheTime: 0,
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
        refetchOnMount: true,
        cacheTime: 0,
        onSuccess: (data) => {
            console.log("Project team members fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching project team members:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch project team members");
        },
    });
}

export function useProjectInvoices(projectId) {
    return useQuery({
        queryKey: ["projectInvoices", projectId],
        queryFn: () => {
            console.log("Fetching project invoices for projectId:", projectId);
            return apiProjectSettings.getInvoices(projectId);
        },
        enabled: !!projectId,
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        cacheTime: 0,
        onSuccess: (data) => {
            console.log("Project invoices fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching project invoices:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch project invoices");
        },
    });
}

export function useProjectInvoiceById(projectId, invoiceId) {
    return useQuery({
        queryKey: ["projectInvoice", projectId, invoiceId],
        queryFn: () => {
            console.log("Fetching project invoice by id for projectId:", projectId, "and invoiceId:", invoiceId);
            return apiProjectSettings.getInvoiceById(projectId, invoiceId);
        },
        enabled: !!projectId && !!invoiceId,
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        cacheTime: 0,
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
            const key = ["projectServices", String(projectId)];
            queryClient.invalidateQueries({ queryKey: key });
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
            const key = ["projectTeamMembers", String(projectId)];
            queryClient.invalidateQueries({ queryKey: key });
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
            queryClient.invalidateQueries({ queryKey: ["projectInvoices", String(projectId)] });
            queryClient.invalidateQueries({ queryKey: ["invoicesWithoutProjects"] });
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Failed to remove invoice from project.";
            toast.error(errorMessage);
            console.error("Invoice deletion error:", error);
        },
    });
}

export function useAssignServiceToProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiProjectSettings.assignServiceToProject,
        onSuccess: (data, variables) => {
            console.log("Service assignment success:", data, variables);
            toast.success("Service assigned to project successfully!");
            const pid = String(variables?.project_id ?? variables?.projectId);
            if (pid) queryClient.invalidateQueries({ queryKey: ["projectServices", pid] });
        },
        onError: (error) => {
            console.error("Service assignment error:", error);
            const errorMessage = error?.response?.data?.message || "Failed to assign service to project.";
            toast.error(errorMessage);
        },
    });
}

export function useAssignProjectToInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiProjectSettings.assignProjectToInvoice,
        onSuccess: (data, variables) => {
            console.log("Invoice assignment success:", data, variables);
            toast.success("Invoice assigned to project successfully!");
            const pid = String(variables?.project_id ?? variables?.projectId);
            if (pid) {
                queryClient.invalidateQueries({ queryKey: ["projectInvoices", pid] });
            }
            queryClient.invalidateQueries({ queryKey: ["invoicesWithoutProjects"] });
        },
        onError: (error) => {
            console.error("Invoice assignment error:", error);
            const errorMessage = error?.response?.data?.message || "Failed to assign invoice to project.";
            toast.error(errorMessage);
        },
    });
}