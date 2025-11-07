import { useState, useEffect } from "react";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) setUser(storedUser);
        setLoading(false);
    }, []);

    const role = user?.role || null;
    const isAuthenticated = !!user;

    return { user, role, isAuthenticated, loading };
}
