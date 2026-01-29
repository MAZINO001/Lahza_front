import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true, // Enable HttpOnly cookies
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Session expired. Please log in again.");
      // Let the useAuth hook handle auth state, not localStorage
    }

    if (status === 403) {
      console.warn("Access denied. You don't have permission to access this resource.");
      // Let your app router handle redirects
    }

    return Promise.reject(error);
  }
);

export default api;