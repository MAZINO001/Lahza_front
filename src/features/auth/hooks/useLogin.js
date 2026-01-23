import { useMutation } from '@tanstack/react-query';
import api from '@/lib/utils/axios';

const login = async (loginData) => {
    const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        loginData,
        {
            headers: { Accept: 'application/json' },
        }
    );
    return response.data;
};

export const useLogin = () => {
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log('Login successful:', data);
        },
        onError: (error) => {
            console.error('Login failed:', error);
            throw error;
        },
    });
};
