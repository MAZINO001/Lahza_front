// utils/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Add response interceptor to handle 401/403 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            // Unauthorized - clear auth and let route guards handle navigation.
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            // Avoid redirect loops when already on auth pages
            const path = window.location.pathname || '';
            if (!path.startsWith('/auth')) {
                window.location.href = '/auth/login';
            }
        } else if (status === 403) {
            // Forbidden - user doesn't have permission
            console.error('Access denied: You do not have permission to access this resource');
            const path = window.location.pathname || '';
            if (!path.startsWith('/auth')) {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api;