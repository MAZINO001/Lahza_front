// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "@/lib/utils/axios";
// import { toast } from "sonner";
// import { agencyApi } from "@/lib/api/agency";
// import { QUERY_KEYS } from "@/lib/queryKeys";

// const API_URL = import.meta.env.VITE_BACKEND_URL;



// const buildFormData = (data, fileKeys = [], isUpdate = false) => {
//     const formData = new FormData();

//     Object.entries(data).forEach(([key, value]) => {
//         if (fileKeys.includes(key)) {
//             if (Array.isArray(value) && value[0]) {
//                 formData.append(key, value[0]);
//             } else if (value instanceof File) {
//                 formData.append(key, value);
//             }
//         }
//         // Handle regular fields
//         else if (value !== null && value !== undefined) {
//             formData.append(key, value);
//         }
//     });

//     return formData;
// };





// const getMultipartHeaders = () => ({});

// const handleApiError = (error, fallbackMsg) => {
//     console.error(error);
//     toast.error(error?.response?.data?.message || fallbackMsg);
// };

// const companyInfoApi = {
//     getAll: () =>
//         api.get(`${API_URL}/company-info`).then((res) => {
//             const { data } = res;
//             return Array.isArray(data) && data.length > 0 ? data[0] : data ?? {};
//         }),

//     update: (id, data) => {
//         const fileKeys = ['logo_path', 'logo_dark_path', 'signature_path', 'stamp_path'];
//         const formData = buildFormData(data, fileKeys, true);
//         return api.put(`${API_URL}/company-info/${id}`, formData, {
//             headers: getMultipartHeaders(),
//         });
//     },
// };

// const certificationsApi = {
//     getAll: () =>
//         api.get(`${API_URL}/certifications`).then((res) => res.data ?? []),

//     getById: (id) =>
//         api.get(`${API_URL}/certifications/${id}`).then((res) => res.data ?? null),

//     create: (data) => {
//         const formData = buildFormData(data, ['certificate_image']);
//         return api.post(`${API_URL}/certifications`, formData, {
//             headers: getMultipartHeaders(),
//         });
//     },

//     update: (id, data) => {
//         const formData = buildFormData(data, ['certificate_image'], true);
//         return api.post(`${API_URL}/certifications/${id}`, formData, {
//             headers: getMultipartHeaders(),
//         });
//     },

//     delete: (id) => api.delete(`${API_URL}/certifications/${id}`),
// };

// export function useCompanyInfo(options = {}) {
//     const enabled = options.enabled !== undefined ? options.enabled : true;
//     return useQuery({
//         queryKey: QUERY_KEYS.companyInfo,
//         queryFn: companyInfoApi.getAll,
//         staleTime: Infinity,
//         refetchOnMount: false,
//         refetchOnWindowFocus: false,
//         enabled,
//         onError: (error) => handleApiError(error, "Failed to fetch company info"),
//     });
// }

// export function useCreateCompanyInfo() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: companyInfoApi.create,
//         onSuccess: () => {
//             toast.success("Company info created successfully!");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companyInfo });
//         },
//         onError: (error) => handleApiError(error, "Failed to create company info"),
//     });
// }

// export function useUpdateCompanyInfo() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: ({ id, data }) => companyInfoApi.update(id, data),
//         onSuccess: () => {
//             toast.success("Company info updated successfully!");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companyInfo });
//         },
//         onError: (error) => handleApiError(error, "Failed to update company info"),
//     });
// }

// export function useCertifications() {
//     return useQuery({
//         queryKey: QUERY_KEYS.certifications,
//         queryFn: certificationsApi.getAll,
//         staleTime: Infinity,
//         refetchOnMount: false,
//         refetchOnWindowFocus: false,
//         onError: (error) => handleApiError(error, "Failed to fetch certifications"),
//     });
// }

// export function useCertification(id) {
//     return useQuery({
//         queryKey: QUERY_KEYS.certification(id),
//         queryFn: () => certificationsApi.getById(id),
//         enabled: !!id,
//         staleTime: Infinity,
//         refetchOnMount: false,
//         refetchOnWindowFocus: false,
//         onError: (error) => handleApiError(error, "Failed to fetch certification"),
//     });
// }

// export function useCreateCertification() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: certificationsApi.create,
//         onSuccess: () => {
//             toast.success("Certification created successfully!");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.certifications });
//         },
//         onError: (error) => handleApiError(error, "Failed to create certification"),
//     });
// }

// export function useUpdateCertification() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: ({ id, data }) => certificationsApi.update(id, data),
//         onSuccess: () => {
//             toast.success("Certification updated successfully!");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.certifications });
//         },
//         onError: (error) => handleApiError(error, "Failed to update certification"),
//     });
// }

// export function useDeleteCertification() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: (id) => certificationsApi.delete(id),
//         onSuccess: () => {
//             toast.success("Certification deleted successfully!");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.certifications });
//         },
//         onError: (error) => handleApiError(error, "Failed to delete certification"),
//     });
// }

// // Agency hooks
// export function useAgency(options = {}) {
//     const enabled = options.enabled !== undefined ? options.enabled : true;
//     return useQuery({
//         queryKey: QUERY_KEYS.agency,
//         queryFn: agencyApi.getAll,
//         staleTime: Infinity,
//         refetchOnMount: false,
//         refetchOnWindowFocus: false,
//         enabled,
//         onError: (error) => handleApiError(error, "Failed to fetch agency data"),
//     });
// }

// export function useAgencyById(id) {
//     return useQuery({
//         queryKey: QUERY_KEYS.agencyById(id),
//         queryFn: () => agencyApi.getById(id),
//         enabled: !!id,
//         staleTime: Infinity,
//         refetchOnMount: false,
//         refetchOnWindowFocus: false,
//         onError: (error) => handleApiError(error, "Failed to fetch agency data"),
//     });
// }

// export function useCreateAgency() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: agencyApi.create,
//         onSuccess: () => {
//             toast.success("Agency created successfully!");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agency });
//         },
//         onError: (error) => handleApiError(error, "Failed to create agency"),
//     });
// }

// export function useUpdateAgency() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: ({ id, data }) => agencyApi.update(id, data),
//         onSuccess: () => {
//             toast.success("Agency updated successfully!");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agency });
//         },
//         onError: (error) => handleApiError(error, "Failed to update agency"),
//     });
// }

// export function useDeleteAgency() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: (id) => agencyApi.delete(id),
//         onSuccess: () => {
//             toast.success("Agency deleted successfully!");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agency });
//         },
//         onError: (error) => handleApiError(error, "Failed to delete agency"),
//     });
// }

// // Cache helper functions
// export function useCompanyInfoFromCache() {
//     const queryClient = useQueryClient();
//     return queryClient.getQueryData(QUERY_KEYS.companyInfo);
// }

// export function useAgencyFromCache() {
//     const queryClient = useQueryClient();
//     return queryClient.getQueryData(QUERY_KEYS.agency);
// }
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";
import { agencyApi } from "@/lib/api/agency";
import { QUERY_KEYS } from "@/lib/queryKeys";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const buildFormData = (data, fileKeys = [], isUpdate = false) => {
    const formData = new FormData();

    // Add _method for PUT requests (Laravel/some frameworks expect this)
    if (isUpdate) {
        formData.append('_method', 'PUT');
    }

    Object.entries(data).forEach(([key, value]) => {
        // Skip null and undefined values
        if (value === null || value === undefined) {
            return;
        }

        // Handle file array fields
        if (fileKeys.includes(key) && Array.isArray(value)) {
            // Process each file in the array
            value.forEach((file) => {
                if (file instanceof File) {
                    formData.append(key, file);
                } else if (typeof file === 'object' && file.name && file.size) {
                    // Skip existing files (already on server)
                    // Do nothing - they're not included in the update
                }
            });

            // For empty file arrays, append empty marker to signal "this was cleared"
            if (value.length === 0) {
                // formData.append(`${key}[]`, JSON.stringify([]));
                return
            }
        }
        // Handle single file fields
        else if (fileKeys.includes(key) && value instanceof File) {
            formData.append(key, value);
        }
        // Handle non-file arrays
        else if (Array.isArray(value)) {
            if (value.length === 0) {
                // Skip empty non-file arrays
                return;
            }
            // Send as JSON for non-file arrays
            formData.append(key, JSON.stringify(value));
        }
        // Handle all other regular fields
        else {
            formData.append(key, value);
        }
    });

    return formData;
};

const getMultipartHeaders = () => ({});

const handleApiError = (error, fallbackMsg) => {
    console.error(error);
    toast.error(error?.response?.data?.message || fallbackMsg);
};

const companyInfoApi = {
    getAll: () =>
        api.get(`${API_URL}/company-info`).then((res) => {
            const { data } = res;
            return Array.isArray(data) && data.length > 0 ? data[0] : data ?? {};
        }),

    update: (id, data) => {
        const fileKeys = ['logo_path', 'logo_dark_path', 'signature_path', 'stamp_path'];
        const formData = buildFormData(data, fileKeys, true);
        return api.post(`${API_URL}/company-info/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
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
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    update: (id, data) => {
        const formData = buildFormData(data, ['certificate_image'], true);
        return api.post(`${API_URL}/certifications/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    delete: (id) => api.delete(`${API_URL}/certifications/${id}`),
};

export function useCompanyInfo(options = {}) {
    const enabled = options.enabled !== undefined ? options.enabled : true;
    return useQuery({
        queryKey: QUERY_KEYS.companyInfo,
        queryFn: companyInfoApi.getAll,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled,
        onError: (error) => handleApiError(error, "Failed to fetch company info"),
    });
}

export function useCreateCompanyInfo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: companyInfoApi.create,
        onSuccess: () => {
            toast.success("Company info created successfully!");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companyInfo });
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
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companyInfo });
        },
        onError: (error) => handleApiError(error, "Failed to update company info"),
    });
}

export function useCertifications() {
    return useQuery({
        queryKey: QUERY_KEYS.certifications,
        queryFn: certificationsApi.getAll,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => handleApiError(error, "Failed to fetch certifications"),
    });
}

export function useCertification(id) {
    return useQuery({
        queryKey: QUERY_KEYS.certification(id),
        queryFn: () => certificationsApi.getById(id),
        enabled: !!id,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => handleApiError(error, "Failed to fetch certification"),
    });
}

export function useCreateCertification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: certificationsApi.create,
        onSuccess: () => {
            toast.success("Certification created successfully!");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.certifications });
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
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.certifications });
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
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.certifications });
        },
        onError: (error) => handleApiError(error, "Failed to delete certification"),
    });
}

// Agency hooks
export function useAgency(options = {}) {
    const enabled = options.enabled !== undefined ? options.enabled : true;
    return useQuery({
        queryKey: QUERY_KEYS.agency,
        queryFn: agencyApi.getAll,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled,
        onError: (error) => handleApiError(error, "Failed to fetch agency data"),
    });
}

export function useAgencyById(id) {
    return useQuery({
        queryKey: QUERY_KEYS.agencyById(id),
        queryFn: () => agencyApi.getById(id),
        enabled: !!id,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => handleApiError(error, "Failed to fetch agency data"),
    });
}

export function useCreateAgency() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: agencyApi.create,
        onSuccess: () => {
            toast.success("Agency created successfully!");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agency });
        },
        onError: (error) => handleApiError(error, "Failed to create agency"),
    });
}

export function useUpdateAgency() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => agencyApi.update(id, data),
        onSuccess: () => {
            toast.success("Agency updated successfully!");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agency });
        },
        onError: (error) => handleApiError(error, "Failed to update agency"),
    });
}

export function useDeleteAgency() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => agencyApi.delete(id),
        onSuccess: () => {
            toast.success("Agency deleted successfully!");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agency });
        },
        onError: (error) => handleApiError(error, "Failed to delete agency"),
    });
}

// Cache helper functions
export function useCompanyInfoFromCache() {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(QUERY_KEYS.companyInfo);
}

export function useAgencyFromCache() {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(QUERY_KEYS.agency);
}