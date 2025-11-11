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
        if (error.response?.status === 401) {
            // Unauthorized - clear auth and redirect to login
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
        } else if (error.response?.status === 403) {
            // Forbidden - user doesn't have permission
            console.error('Access denied: You do not have permission to access this resource');
            // Optionally redirect to unauthorized page
            window.location.href = '/unauthorized';
        }
        return Promise.reject(error);
    }
);

export default api;