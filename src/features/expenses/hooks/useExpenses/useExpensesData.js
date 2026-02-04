// // src/features/expenses/hooks/useExpenses/useExpensesData.js
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "@/lib/utils/axios";
// import { toast } from "sonner";

// const API_URL = import.meta.env.VITE_BACKEND_URL;

// const apiExpense = {
//     getAll: () => api.get(`${API_URL}/expenses`).then(res => res.data ?? []),
//     getById: (id) => api.get(`${API_URL}/expenses/${id}`).then(res => res.data?.expense ?? res.data ?? null),
//     create: (data) => api.post(`${API_URL}/expenses`, data),
//     update: (id, data) => api.put(`${API_URL}/expenses/${id}`, data),
//     delete: (id) => api.delete(`${API_URL}/expenses/${id}`),
// };

// export function useExpenses() {
//     return useQuery({
//         queryKey: ["expenses"],
//         queryFn: apiExpense.getAll,
//         staleTime: 1000 * 60 * 5,
//         refetchOnWindowFocus: true,
//         onError: (error) => {
//             toast.error(error?.response?.data?.message || "Failed to fetch expenses");
//         },
//     });
// }

// export function useExpense(id) {
//     return useQuery({
//         queryKey: ["expenses", id],
//         queryFn: () => apiExpense.getById(id),
//         enabled: !!id,
//         staleTime: 0,
//         refetchOnWindowFocus: true,
//         onError: (error) => {
//             toast.error(error?.response?.data?.message || "Failed to fetch expense");
//         },
//     });
// }

// export function useCreateExpense() {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: apiExpense.create,
//         onSuccess: () => {
//             toast.success("Expense created successfully!");
//             queryClient.invalidateQueries({ queryKey: ["expenses"] });
//         },
//         refetchOnWindowFocus: true,
//         onError: (error) => {
//             console.log(error)
//             toast.error(error?.response?.data?.message || "Failed to create expense")
//         }
//     });
// }

// export function useUpdateExpense() {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: ({ id, data }) => apiExpense.update(id, data),
//         onSuccess: () => {
//             toast.success("Expense updated successfully!");
//             queryClient.invalidateQueries({ queryKey: ["expenses"] });
//             queryClient.invalidateQueries({ queryKey: ["expenses"] });
//         },
//         refetchOnWindowFocus: true,
//         onError: (error) => {
//             console.log(error)
//             toast.error("Failed to update expense")
//         }
//     });
// }

// export function useDeleteExpense() {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: apiExpense.delete,
//         onSuccess: () => {
//             toast.success("Expense deleted");
//             queryClient.invalidateQueries({ queryKey: ["expenses"] });
//         },
//         refetchOnWindowFocus: true,
//         onError: () => toast.error("Failed to delete expense"),
//     });
// }


// src/features/expenses/hooks/useExpenses/useExpensesData.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiExpense = {
    getAll: () => api.get(`${API_URL}/expenses`).then(res => res.data ?? []),
    getById: (id) => api.get(`${API_URL}/expenses/${id}`).then(res => res.data?.expense ?? res.data ?? null),

    create: (data) => {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (data[key] === null || data[key] === undefined) return;

            if (Array.isArray(data[key])) {
                if (data[key].length === 0) return;

                if (data[key][0] instanceof File) {
                    console.log(`Appending ${key}[] with ${data[key].length} files`);
                    data[key].forEach((file) => {
                        formData.append(`${key}[]`, file);
                    });
                } else {
                    console.log(`Appending ${key} as JSON array`);
                    formData.append(key, JSON.stringify(data[key]));
                }
            }
            else if (data[key] instanceof File) {
                console.log(`Appending single file ${key}`);
                formData.append(key, data[key]);
            }
            else {
                console.log(`Appending text ${key}`);
                formData.append(key, data[key]);
            }
        });

        console.log("FormData being sent:");
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  ${key}: File(${value.name})`);
            } else {
                console.log(`  ${key}:`, value);
            }
        }

        return api.post(`${API_URL}/expenses`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => res.data);
    },

    update: (id, data) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');

        Object.keys(data).forEach(key => {
            console.log(`Processing key: ${key}, value:`, data[key], `type: ${typeof data[key]}`);

            if (data[key] === null || data[key] === undefined) {
                console.log(`  → Skipping (null/undefined)`);
                return;
            }

            if (data[key] instanceof File) {
                console.log(`  → Appending as File: ${data[key].name}`);
                formData.append(key, data[key]);
                return;
            }

            if (Array.isArray(data[key])) {
                if (data[key].length === 0) {
                    console.log(`  → Skipping (empty array)`);
                    return;
                }

                if (data[key][0] instanceof File) {
                    console.log(`  → Appending as file array with ${data[key].length} files`);
                    data[key].forEach((file) => {
                        formData.append(`${key}[]`, file);
                    });
                    return;
                }

                return;
            }

            formData.append(key, data[key]);
        });

        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  ${key}: File(${value.name})`);
            } else {
                console.log(`  ${key}: ${value}`);
            }
        }

        return api.post(`${API_URL}/expenses/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => res.data);
    },
    delete: (id) => api.delete(`${API_URL}/expenses/${id}`),
};

export function useExpenses() {
    return useQuery({
        queryKey: ["expenses"],
        queryFn: apiExpense.getAll,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch expenses");
        },
    });
}

export function useExpense(id) {
    return useQuery({
        queryKey: ["expenses", id],
        queryFn: () => apiExpense.getById(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch expense");
        },
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiExpense.create,
        onSuccess: () => {
            toast.success("Expense created successfully!");
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to create expense");
        }
    });
}

export function useUpdateExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiExpense.update(id, data),
        onSuccess: () => {
            toast.success("Expense updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to update expense");
        }
    });
}

export function useDeleteExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiExpense.delete,
        onSuccess: () => {
            toast.success("Expense deleted");
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
        onError: () => toast.error("Failed to delete expense"),
    });
}