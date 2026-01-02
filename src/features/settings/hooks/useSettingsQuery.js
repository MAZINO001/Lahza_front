import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const buildFormData = (data, fileKeys = [], isUpdate = false) => {
    const formData = new FormData();

    if (isUpdate) {
        formData.append('_method', 'PUT');
    }

    Object.entries(data).forEach(([key, value]) => {
        if (fileKeys.includes(key)) {
            if (Array.isArray(value) && value[0]) {
                formData.append(key, value[0]);
            } else if (value instanceof File) {
                formData.append(key, value);
            }
        }
        // Handle regular fields
        else if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
        }
    });

    return formData;
};

const getMultipartHeaders = () => ({
    'Content-Type': 'multipart/form-data',
});

const handleApiError = (error, fallbackMsg) => {
    console.error(error);
    toast.error(error?.response?.data?.message || fallbackMsg);
};

const companyInfoApi = {
    getAll: () =>
        api.get(`${API_URL}/company-info`).then((res) => {
            const data = res.data;
            return Array.isArray(data) && data.length > 0 ? data[0] : data ?? {};
        }),

    create: (data) => {
        const fileKeys = ['logo_path', 'logo_dark_path', 'signature_path', 'stamp_path'];
        const formData = buildFormData(data, fileKeys);
        return api.post(`${API_URL}/company-info`, formData, {
            headers: getMultipartHeaders(),
        });
    },

    update: (id, data) => {
        const fileKeys = ['logo_path', 'logo_dark_path', 'signature_path', 'stamp_path'];
        const formData = buildFormData(data, fileKeys, true);
        return api.post(`${API_URL}/company-info/${id}`, formData, {
            headers: getMultipartHeaders(),
        });
    },
};

const certificationsApi = {
    getAll: () =>
        api.get(`${API_URL}/certifications`).then((res) => res.data ?? []),

    getById: (id) =>
        api.get(`${API_URL}/certifications/${id}`).then((res) => res.data ?? null),

    create: (data) => {
        const formData = buildFormData(data, ['certificate_image']);
        return api.post(`${API_URL}/certifications`, formData, {
            headers: getMultipartHeaders(),
        });
    },

    update: (id, data) => {
        const formData = buildFormData(data, ['certificate_image'], true);
        return api.post(`${API_URL}/certifications/${id}`, formData, {
            headers: getMultipartHeaders(),
        });
    },

    delete: (id) => api.delete(`${API_URL}/certifications/${id}`),
};

export function useCompanyInfo() {
    return useQuery({
        queryKey: ["company-info"],
        queryFn: companyInfoApi.getAll,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => handleApiError(error, "Failed to fetch company info"),
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
        onError: (error) => handleApiError(error, "Failed to create company info"),
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
        onError: (error) => handleApiError(error, "Failed to update company info"),
    });
}

export function useCertifications() {
    return useQuery({
        queryKey: ["certifications"],
        queryFn: certificationsApi.getAll,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => handleApiError(error, "Failed to fetch certifications"),
    });
}

export function useCertification(id) {
    return useQuery({
        queryKey: ["certifications", id],
        queryFn: () => certificationsApi.getById(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => handleApiError(error, "Failed to fetch certification"),
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
        onError: (error) => handleApiError(error, "Failed to create certification"),
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
        onError: (error) => handleApiError(error, "Failed to update certification"),
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
        onError: (error) => handleApiError(error, "Failed to delete certification"),
    });
}