import api from "@/lib/utils/axios";

export const apiClient = {
    getAll: () =>
        api.get(`/clients`).then((res) => res.data ?? []),
    getById: (id) =>
        api
            .get(`/clients/${id}`)
            .then((res) => res.data ?? []),

    // create: (data) => api.post(`/clients`, data).then((res) => res.data),
    create: (data) => api.post(`/register`, data).then((res) => res.data),

    update: (id, data) => api.put(`/clients/${id}`, data).then((res) => res.data),
    delete: (id) => api.delete(`/clients/${id}`).then((res) => res.data),
};