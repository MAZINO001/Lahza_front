import api from '@/lib/utils/axios';

export const apiDocuments = {
    getAll: (type) =>
        api.get(`/${type}`).then((res) => res.data?.[type] || res.data?.invoices || res.data?.quotes || res.data || []),

    getById: (id, type) =>
        api.get(`/${type}/${id}`).then((res) => res.data?.invoice || res.data?.quote || res.data),

    getProjects: () =>
        api.get('/getproject/invoices').then((res) => res.data || []),

    getInvoices: () =>
        api.get('/invoice/projects').then((res) => res.data || []),

    create: (data, type) =>
        api.post(`/${type}`, data),

    createFromQuote: (id) =>
        api.post(`/quotes/${id}/create-invoice`),

    update: (id, data, type) =>
        api.put(`/${type}/${id}`, data),

    delete: (id, type) =>
        api.delete(`/${type}/${id}`),
};
