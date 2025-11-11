// hooks/useAuth.js
import { useState, useEffect } from "react";
import axios from "axios";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verify authentication on app load
        verifyAuth();
    }, []);

    const verifyAuth = async () => {
        try {
            // Fetch real user data from backend
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user`,
                {
                    withCredentials: true,
                    headers: {
                        Accept: "application/json",
                    },
                }
            );
            setUser(response.data);
        } catch (error) {
            // Not authenticated or token expired
            setUser(null);
            localStorage.removeItem('isAuthenticated'); // Just a flag, not role
        } finally {
            setLoading(false);
        }
    };

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true'); // Just a flag
    };

    const logout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/logout`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        Accept: "application/json",
                    },
                }
            );
        } catch (error) {
            console.log("Logout error:", error);
        } finally {
            localStorage.removeItem('isAuthenticated');
            setUser(null);
            window.location.href = '/login';
        }
    };

    const role = user?.role || null;
    const isAuthenticated = !!user;

    return { user, role, isAuthenticated, loading, logout, verifyAuth };
}