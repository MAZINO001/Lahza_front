/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import api from "@/lib/utils/axios";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized) {
            verifyAuth();
            setInitialized(true);
        }
    }, [initialized]);

    const verifyAuth = async () => {
        let isMounted = true;
        try {
            // Fetch real user data from backend
            const response = await api.get(
                `${import.meta.env.VITE_BACKEND_URL}/user`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );
            if (isMounted) {
                setUser(response.data);
            }
        } catch (error) {
            // Not authenticated or token expired
            if (isMounted) {
                setUser(null);
                localStorage.removeItem('isAuthenticated'); // Just a flag, not role
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
        return () => { isMounted = false; };
    };

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true'); // Just a flag
    };

    const logout = async () => {
        try {
            await api.post(
                `${import.meta.env.VITE_BACKEND_URL}/logout`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );
        } catch (error) {
            alert("Logout error:", error);
        } finally {
            localStorage.removeItem('isAuthenticated');
            setUser(null);
            window.location.href = '/auth/login';
        }
    };

    const role = user?.role || null;
    const isAuthenticated = !!user;
    return { user, role, isAuthenticated, loading, logout, verifyAuth };
}