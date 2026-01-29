// 
// import { useState, useEffect } from "react";
// import api from "@/lib/utils/axios";

// export function useAuth() {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [initialized, setInitialized] = useState(false);

//     useEffect(() => {
//         const controller = new AbortController();

//         const checkAuth = async () => {
//             await verifyAuth(controller);
//         };

//         checkAuth();

//         return () => {
//             controller.abort();
//         };
//     }, []);

//     const verifyAuth = async (controller) => {
//         try {
//             const response = await api.get(
//                 `${import.meta.env.VITE_BACKEND_URL}/user`,
//                 {
//                     headers: {
//                         Accept: "application/json",
//                     },
//                     signal: controller.signal,
//                 }
//             );
//             if (!controller.signal.aborted) {
//                 setUser(response.data);
//             }
//         } catch (error) {
//             if (error.name === "AbortError") {
//                 return;
//             }
//             if (!controller.signal.aborted) {
//                 setUser(null);
//                 localStorage.removeItem('isAuthenticated');
//             }
//         } finally {
//             if (!controller.signal.aborted) {
//                 setLoading(false);
//             }
//         }
//     };

//     const login = (userData) => {
//         setUser(userData);
//         localStorage.setItem('isAuthenticated', 'true');
//     };

//     const logout = async () => {
//         try {
//             await api.post(
//                 `${import.meta.env.VITE_BACKEND_URL}/logout`,
//                 {
//                     headers: {
//                         Accept: "application/json",
//                     },
//                 }
//             );
//         } catch (error) {
//             alert("Logout error:", error);
//         } finally {
//             localStorage.removeItem('isAuthenticated');
//             setUser(null);
//             window.location.href = '/auth/login';
//         }
//     };

//     const role = user?.role || null;
//     const isAuthenticated = !!user;
//     return { user, role, isAuthenticated, loading, logout, verifyAuth };
// }

import { useState, useEffect } from "react";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        if (isLoggingOut) return; // Skip auth check during logout

        const controller = new AbortController();

        const checkAuth = async () => {
            await verifyAuth(controller);
        };

        checkAuth();

        // Cleanup function - properly returned from useEffect
        return () => {
            controller.abort();
        };
    }, [isLoggingOut]);

    const verifyAuth = async (controller) => {
        try {
            // Fetch real user data from backend
            const response = await api.get(
                `${import.meta.env.VITE_BACKEND_URL}/user`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                    signal: controller.signal,
                }
            );
            if (!controller.signal.aborted) {
                setUser(response.data);
            }
        } catch (error) {
            // Don't update state if request was aborted
            if (error.name === "AbortError") {
                return;
            }
            // Not authenticated or token expired
            if (!controller.signal.aborted) {
                setUser(null);
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    };

    const login = async (userData) => {
        setUser(userData);

        // Re-verify auth after login to get fresh user data
        const controller = new AbortController();
        await verifyAuth(controller);
    };

    const logout = async () => {
        setIsLoggingOut(true); // Prevent further auth checks
        try {
            await api.post(`${import.meta.env.VITE_BACKEND_URL}/logout`);
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            setLoading(false);
            // Force redirect to login page
            window.location.replace('/auth/login');
        }
    };

    const role = user?.role || null;
    const isAuthenticated = !!user;
    return { user, role, isAuthenticated, loading, logout, login };
}