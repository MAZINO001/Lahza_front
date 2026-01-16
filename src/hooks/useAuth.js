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

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const checkAuth = async () => {
            await verifyAuth(controller);
        };

        checkAuth();

        // Cleanup function - properly returned from useEffect
        return () => {
            controller.abort();
        };
    }, []);

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
                localStorage.removeItem('isAuthenticated');
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    };

    const login = async (userData) => {
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');

        // Re-verify auth after login
        const controller = new AbortController();
        await verifyAuth(controller);
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
            setLoading(false);
            window.location.href = '/auth/login';
        }
    };

    const role = user?.role || null;
    const isAuthenticated = !!user;
    return { user, role, isAuthenticated, loading, logout, login };
}