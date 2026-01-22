import api from '@/lib/utils/axios'; 

export const apiService = {
    getAll: () =>
        api.get(`/services`).then((res) => res.data ?? []),

    getById: (id) =>
        api.get(`/services/${id}`).then((res) => res.data?.service ?? res.data ?? null),

    getByDocsId: (id, type) =>
        api.get(`/services/${id}/${type}`).then((res) => res.data ?? []),

    create: (data) =>
        api.post(`/services`, data).then((res) => res.data),

    update: (id, data) =>
        api.put(`/services/${id}`, data).then((res) => res.data),

    delete: (id) =>
        api.delete(`/services/${id}`).then((res) => res.data),
};