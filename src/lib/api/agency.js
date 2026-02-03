import api from "@/lib/utils/axios";

export const agencyApi = {
    getAll: () =>
        api.get(`/agency`).then((res) => res.data ?? []),

    getById: (id) =>
        api.get(`/agency/${id}`).then((res) => res.data ?? null),

    create: (data) => api.post(`/agency`, data).then((res) => res.data),

    update: (id, data) => api.put(`/agency/${id}`, data).then((res) => res.data),

    delete: (id) => api.delete(`/agency/${id}`).then((res) => res.data),
};