import api from '@/lib/utils/axios';

export const apiOffers = {
    getAll: () => api.get('/offers').then(res => res.data ?? []),
    
    getById: (id) => api.get(`/offers/${id}`).then(res => res.data?.offer ?? res.data ?? null),
    
    create: (data) => api.post('/offers', data),
    
    update: (id, data) => api.put(`/offers/${id}`, data),
    
    delete: (id) => api.delete(`/offers/${id}`),
};
