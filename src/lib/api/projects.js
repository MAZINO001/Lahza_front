import api from '@/lib/utils/axios';

export const apiProjects = {
    getAll: () => api.get('/projects').then((res) => res.data ?? []),
    
    getById: (id) =>
        api.get(`/project/${id}`)
            .then((res) => res.data?.Project ?? res.data ?? null),
    
    create: (data) => api.post('/projects', data).then((res) => res.data),
    
    update: (id, data) => api.put(`/project/${id}`, data).then((res) => res.data),
    
    delete: (id) => api.delete(`/projects/${id}`).then((res) => res.data),
    
    getProgress: (id) => api.get(`/getProgress/${id}`).then((res) => res.data),
    
    getProjectTeam: (id) => api.get(`/project/team/${id}`).then((res) => res.data),
    
    postProjectDone: (id) => api.post(`/projects/${id}/complete`).then((res) => res.data),
};
