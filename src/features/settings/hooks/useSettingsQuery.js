import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Company Info API client
const companyInfoApi = {
    getAll: () =>
        api.get(`${API_URL}/company-info`).then((res) => res.data ?? {}),
    create: (data) => api.post(`${API_URL}/company-info`, data),
    update: (id, data) => api.put(`${API_URL}/company-info/${id}`, data),
};

// Certifications API client
const certificationsApi = {
    getAll: () =>
        api.get(`${API_URL}/certifications`).then((res) => res.data ?? []),
    getById: (id) =>
        api
            .get(`${API_URL}/certifications/${id}`)
            .then((res) => res.data ?? null),
    create: (data) => api.post(`${API_URL}/certifications`, data),
    update: (id, data) => api.put(`${API_URL}/certifications/${id}`, data),
    delete: (id) => api.delete(`${API_URL}/certifications/${id}`),
};

// COMPANY INFO HOOKS
export function useCompanyInfo() {
    return useQuery({
        queryKey: ["company-info"],
        queryFn: companyInfoApi.getAll,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            console.log(error);
            toast.error(
                error?.response?.data?.message || "Failed to fetch company info"
            );
        },
    });
}

export function useCreateCompanyInfo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyInfoApi.create,
        onSuccess: () => {
            toast.success("Company info created successfully!");
            queryClient.invalidateQueries({ queryKey: ["company-info"] });
        },
        refetchOnWindowFocus: true,
        onError: (error) =>
            toast.error(
                error?.response?.data?.message || "Failed to create company info"
            ),
    });
}

export function useUpdateCompanyInfo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => companyInfoApi.update(id, data),
        onSuccess: () => {
            toast.success("Company info updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["company-info"] });
        },
        refetchOnWindowFocus: true,
        onError: (error) => {
            console.log(error);
            toast.error(
                error?.response?.data?.message || "Failed to update company info"
            );
        },
    });
}

// CERTIFICATIONS HOOKS
export function useCertifications() {
    return useQuery({
        queryKey: ["certifications"],
        queryFn: certificationsApi.getAll,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            console.log(error);
            toast.error(
                error?.response?.data?.message || "Failed to fetch certifications"
            );
        },
    });
}

export function useCertification(id) {
    return useQuery({
        queryKey: ["certifications", id],
        queryFn: () => certificationsApi.getById(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            console.log(error);
            toast.error(
                error?.response?.data?.message || "Failed to fetch certification"
            );
        },
    });
}

export function useCreateCertification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: certificationsApi.create,
        onSuccess: () => {
            toast.success("Certification created successfully!");
            queryClient.invalidateQueries({ queryKey: ["certifications"] });
        },
        refetchOnWindowFocus: true,
        onError: (error) =>
            toast.error(
                error?.response?.data?.message || "Failed to create certification"
            ),
    });
}

export function useUpdateCertification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => certificationsApi.update(id, data),
        onSuccess: () => {
            toast.success("Certification updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["certifications"] });
        },
        refetchOnWindowFocus: true,
        onError: (error) => {
            console.log(error);
            toast.error(
                error?.response?.data?.message || "Failed to update certification"
            );
        },
    });
}

export function useDeleteCertification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => certificationsApi.delete(id),
        onSuccess: () => {
            toast.success("Certification deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["certifications"] });
        },
        refetchOnWindowFocus: true,
        onError: (error) => {
            console.log(error);
            toast.error(
                error?.response?.data?.message || "Failed to delete certification"
            );
        },
    });
}
