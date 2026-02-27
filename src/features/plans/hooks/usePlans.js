// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "@/lib/utils/axios";
// import { toast } from "sonner";
// import { QUERY_KEYS } from "@/lib/queryKeys";

// const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

// export function usePlans(packId) {
//     const queryKey = packId ? QUERY_KEYS.plansByPack(packId) : QUERY_KEYS.plans;

//     return useQuery({
//         queryKey,
//         queryFn: async () => {
//             const params = packId ? { pack_id: packId } : {};
//             const res = await api.get(`${API_URL}/plans`, { params });
//             return res.data || [];
//         },
//         enabled: true,
//         staleTime: 4 * 60 * 1000,
//     });
// }


// export function usePlan(planId) {
//     return useQuery({
//         queryKey: QUERY_KEYS.plan(planId),
//         queryFn: async () => {
//             if (!planId) return null;
//             const res = await api.get(`${API_URL}/plans/${planId}`);
//             // Handle both single plan response and paginated response
//             return res.data?.data || res.data?.plan || res.data || null;
//         },
//         enabled: !!planId,
//         staleTime: 3 * 60 * 1000,
//     });
// }


// export function useCreatePlan() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async (data) => {
//             const res = await api.post(`${API_URL}/plans`, data);
//             return res.data;
//         },
//         onMutate: async () => {
//             // Cancel any outgoing refetches
//             await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.plans] });
//         },
//         onSuccess: (responseData) => {
//             toast.success("Plan created successfully");

//             // Invalidate plans query
//             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });

//             // Invalidate plans for this specific pack if provided
//             const packId = responseData?.plan?.pack_id;
//             if (packId) {
//                 queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plansByPack(packId) });
//             }
//         },
//         onError: (error) => {
//             const msg = error?.response?.data?.message || "Could not create plan";
//             toast.error(msg);
//             console.error("Create plan failed:", error);
//         },
//     });
// }


// export function useUpdatePlan() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({ id, ...data }) => {
//             const res = await api.put(`${API_URL}/plans/${id}`, data);
//             return { ...res.data, pack_id: data.pack_id };
//         },
//         onMutate: async ({ id, ...data }) => {
//             // Cancel any outgoing refetches
//             await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.plans] });
//             return { packId: data.pack_id, planId: id };
//         },
//         onSuccess: (_, variables) => {
//             toast.success("Plan updated successfully");

//             // Invalidate plans query
//             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });

//             // Invalidate specific plan
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(variables.id) });

//             // Invalidate plans for the specific pack if provided
//             if (variables.packId) {
//                 queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plansByPack(variables.packId) });
//             }
//         },
//         onError: (error) => {
//             const msg = error?.response?.data?.message || "Could not update plan";
//             toast.error(msg);
//         },
//     });
// }


// export function useDeletePlan() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async (planId) => {
//             await api.delete(`${API_URL}/plans/${planId}`);
//             return planId;
//         },
//         onMutate: async (planId) => {
//             // Cancel any outgoing refetches
//             await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.plans] });

//             // Get the plan data to find its pack_id
//             const planData = queryClient.getQueryData(QUERY_KEYS.plan(planId));
//             return { planId, packId: planData?.pack_id };
//         },
//         onSuccess: (_, variables) => {
//             toast.success("Plan deleted successfully");

//             // Invalidate plans query
//             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });

//             // Invalidate plans for the specific pack if provided
//             if (variables.packId) {
//                 queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plansByPack(variables.packId) });
//             }
//         },
//         onError: (error) => {
//             const msg = error?.response?.data?.message || "Could not delete plan";
//             toast.error(msg);
//         },
//     });
// }


// export function useAddPlanPrice() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({ planId, ...priceData }) => {
//             const res = await api.post(`${API_URL}/plans/${planId}/prices`, priceData);
//             return res.data;
//         },
//         onSuccess: (_, { planId }) => {
//             toast.success("Price added successfully");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
//             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });
//         },
//         onError: (error) => {
//             const msg = error?.response?.data?.message || "Could not add price";
//             toast.error(msg);
//         },
//     });
// }


// export function useUpdatePlanPrice() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({ planId, priceId, ...priceData }) => {
//             const res = await api.put(`${API_URL}/plans/${planId}/prices/${priceId}`, priceData);
//             return res.data;
//         },
//         onSuccess: (_, { planId }) => {
//             toast.success("Plan price updated successfully");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
//             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });
//         },
//         onError: (error) => {
//             const msg = error?.response?.data?.message || "Could not update plan price";
//             toast.error(msg);
//         },
//     });
// }

// export function useDeletePlanPrice() {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async ({ planId, priceId }) => {
//             await api.delete(`${API_URL}/plans/${planId}/prices/${priceId}`);
//         },
//         onSuccess: (_, { planId }) => {
//             toast.success("Price deleted successfully");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
//             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });
//         },
//         onError: (error) => {
//             const msg = error?.response?.data?.message || "Could not delete price";
//             toast.error(msg);
//         },
//     });
// }


// export function useAddCustomField() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({ planId, ...fieldData }) => {
//             const res = await api.post(`${API_URL}/plans/${planId}/custom-fields`, fieldData);
//             return res.data;
//         },
//         onSuccess: (_, { planId }) => {
//             toast.success("Custom field added successfully");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
//             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });
//         },
//         onError: (error) => {
//             const msg = error?.response?.data?.message || "Could not add custom field";
//             toast.error(msg);
//         },
//     });
// }


// export function useUpdateCustomField() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({ planId, fieldId, ...fieldData }) => {
//             const res = await api.put(`${API_URL}/plans/${planId}/custom-fields/${fieldId}`, fieldData);
//             return res.data;
//         },
//         onSuccess: (_, { planId }) => {
//             toast.success("Custom field updated successfully");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
//             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });
//         },
//         onError: (error) => {
//             const msg = error?.response?.data?.message || "Could not update custom field";
//             toast.error(msg);
//         },
//     });
// }

// export function useDeleteCustomField() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({ planId, fieldId }) => {
//             await api.delete(`${API_URL}/plans/${planId}/custom-fields/${fieldId}`);
//         },
//         onSuccess: (_, { planId }) => {
//             toast.success("Custom field deleted successfully");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
//             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });
//         },
//         onError: (error) => {
//             const msg = error?.response?.data?.message || "Could not delete custom field";
//             toast.error(msg);
//         },
//     });
// }

// export function useAddPlanFeature() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({ planId, ...featureData }) => {
//             const res = await api.post(`${API_URL}/plans/${planId}/features`, featureData);
//             return res.data;
//         },
//         onSuccess: (_, { planId }) => {
//             toast.success("Feature added successfully");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
//             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });
//         },
//         onError: (error) => {
//             const msg = error?.response?.data?.message || "Could not add feature";
//             toast.error(msg);
//         },
//     });
// }

// export function useUpdatePlanFeature() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({ planId, featureId, ...featureData }) => {
//             const res = await api.put(`${API_URL}/plans/${planId}/features/${featureId}`, featureData);
//             return res.data;
//         },
//         onSuccess: (_, { planId }) => {
//             toast.success("Feature updated successfully");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
//             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });
//         },
//         onError: (error) => {
//             const msg = error?.response?.data?.message || "Could not update feature";
//             toast.error(msg);
//         },
//     });
// }

// export function useDeletePlanFeature() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({ planId, featureId }) => {
//             await api.delete(`${API_URL}/plans/${planId}/features/${featureId}`);
//         },
//         onSuccess: (_, { planId }) => {
//             toast.success("Feature deleted successfully");
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
//             queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.plans] });
//         },
//         onError: (error) => {
//             const msg = error?.response?.data?.message || "Could not delete feature";
//             toast.error(msg);
//         },
//     });
// }


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/queryKeys";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export function usePlans(packId) {
    const queryKey = packId ? QUERY_KEYS.plansByPack(packId) : QUERY_KEYS.plans;

    return useQuery({
        queryKey,
        queryFn: async () => {
            const params = packId ? { pack_id: packId } : {};
            const res = await api.get(`${API_URL}/plans`, { params });
            return res.data || [];
        },
        enabled: true,
        staleTime: 4 * 60 * 1000,
    });
}


export function usePlan(planId) {
    return useQuery({
        queryKey: QUERY_KEYS.plan(planId),
        queryFn: async () => {
            if (!planId) return null;
            const res = await api.get(`${API_URL}/plans/${planId}`);
            return res.data?.data || res.data?.plan || res.data || null;
        },
        enabled: !!planId,
        staleTime: 0,
    });
}


export function useCreatePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await api.post(`${API_URL}/plans`, data);
            return res.data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.plans });
        },
        onSuccess: (responseData) => {
            toast.success("Plan created successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            const packId = responseData?.plan?.pack_id;
            if (packId) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plansByPack(packId) });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pack(packId) });
            }
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plans });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not create plan";
            toast.error(msg);
            console.error("Create plan failed:", error);
        },
    });
}


export function useUpdatePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...data }) => {
            const res = await api.put(`${API_URL}/plans/${id}`, data);
            return { ...res.data, pack_id: data.pack_id };
        },
        onMutate: async ({ id, ...data }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.plans });
            return { packId: data.pack_id, planId: id };
        },
        onSuccess: (_, variables) => {
            toast.success("Plan updated successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(variables.id) });
            const packId = variables.pack_id ?? variables.packId;
            if (packId) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plansByPack(packId) });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pack(packId) });
            }
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plans });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not update plan";
            toast.error(msg);
        },
    });
}


export function useDeletePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (planId) => {
            await api.delete(`${API_URL}/plans/${planId}`);
            return planId;
        },
        onMutate: async (planId) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.plans });
            const planData = queryClient.getQueryData(QUERY_KEYS.plan(planId));
            return { planId, packId: planData?.pack_id };
        },
        onSuccess: (_, planId, context) => {
            toast.success("Plan deleted successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            if (context?.packId) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plansByPack(context.packId) });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pack(context.packId) });
            }
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plans });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not delete plan";
            toast.error(msg);
        },
    });
}


export function useAddPlanPrice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, ...priceData }) => {
            const res = await api.post(`${API_URL}/plans/${planId}/prices`, priceData);
            return res.data;
        },
        onSuccess: (_, { planId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plans });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not add price";
            toast.error(msg);
        },
    });
}


export function useUpdatePlanPrice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, priceId, ...priceData }) => {
            const res = await api.put(`${API_URL}/plans/${planId}/prices/${priceId}`, priceData);
            return res.data;
        },
        onSuccess: (_, { planId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plans });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not update plan price";
            toast.error(msg);
        },
    });
}

export function useDeletePlanPrice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ planId, priceId }) => {
            await api.delete(`${API_URL}/plans/${planId}/prices/${priceId}`);
        },
        onSuccess: (_, { planId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plans });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not delete price";
            toast.error(msg);
        },
    });
}


export function useAddCustomField() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, ...fieldData }) => {
            const res = await api.post(`${API_URL}/plans/${planId}/custom-fields`, fieldData);
            return res.data;
        },
        onSuccess: (_, { planId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plans });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not add custom field";
            toast.error(msg);
        },
    });
}


export function useUpdateCustomField() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, fieldId, ...fieldData }) => {
            const res = await api.put(`${API_URL}/plans/${planId}/custom-fields/${fieldId}`, fieldData);
            return res.data;
        },
        onSuccess: (_, { planId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plans });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not update custom field";
            toast.error(msg);
        },
    });
}

export function useDeleteCustomField() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, fieldId }) => {
            await api.delete(`${API_URL}/plans/${planId}/custom-fields/${fieldId}`);
        },
        onSuccess: (_, { planId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plans });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not delete custom field";
            toast.error(msg);
        },
    });
}

export function useAddPlanFeature() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, ...featureData }) => {
            const res = await api.post(`${API_URL}/plans/${planId}/features`, featureData);
            return res.data;
        },
        onSuccess: (_, { planId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plans });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not add feature";
            toast.error(msg);
        },
    });
}

export function useUpdatePlanFeature() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, featureId, ...featureData }) => {
            const res = await api.put(`${API_URL}/plans/${planId}/features/${featureId}`, featureData);
            return res.data;
        },
        onSuccess: (_, { planId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plans });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not update feature";
            toast.error(msg);
        },
    });
}

export function useDeletePlanFeature() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, featureId }) => {
            await api.delete(`${API_URL}/plans/${planId}/features/${featureId}`);
        },
        onSuccess: (_, { planId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packs });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plan(planId) });
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.plans });
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Could not delete feature";
            toast.error(msg);
        },
    });
}