import api from '@/lib/utils/axios';

export const apiPayments = {
    getAll: () => api.get('/payments').then((res) => res.data ?? []),
    
    getById: (id) =>
        api.get(`/payments/${id}`).then((res) => res.data?.payment ?? res.data ?? null),
    
    create: (data) => api.post('/payments', data).then((res) => res.data),
    
    update: (id, data) => api.put(`/payments/${id}`, data).then((res) => res.data),
    
    delete: (id) => api.delete(`/payments/${id}`).then((res) => res.data),
    
    confirm: (id) => api.put(`/validatePayments/${id}`).then((res) => res.data),
    
    cancel: (id) => api.put(`/cancelPayment/${id}`).then((res) => res.data),
    
    updatePaymentDate: (id, paid_at) =>
        api.put(`/payment/date/${id}`, { updated_at: paid_at }).then((res) => res.data),
    
    getTransactionByProject: (id) =>
        api.get(`/payments/project/${id}`).then((res) => res.data?.payment ?? res.data ?? null),
    
    additional: (data) => api.post('/additional-payment', data).then((res) => res.data),
};
