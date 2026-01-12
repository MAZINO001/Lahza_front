
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // ❌ REMOVED: window.location.href = "/login";
      // Let the useAuth hook handle this, not the interceptor
      console.warn("Session expired. Please log in again.");
    }

    if (status === 403) {
      console.warn("Access denied. You don't have permission to access this resource.");
      // ❌ REMOVED: window.location.href = "/unauthorized";
      // Let your app router handle redirects
    }

    return Promise.reject(error);
  }
);

export default api;