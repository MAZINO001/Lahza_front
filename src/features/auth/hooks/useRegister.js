import { useMutation } from '@tanstack/react-query';
import api from '@/lib/utils/axios';

const register = async (registerData) => {
    const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        registerData,
        {
            headers: { 
                Accept: 'application/json',
                ...(registerData instanceof FormData && {
                    'Content-Type': 'multipart/form-data'
                })
            },
        }
    );
    return response.data;
};

export const useRegister = () => {
    return useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            console.log('Registration successful:', data);
        },
        onError: (error) => {
            console.error('Registration failed:', error);
            throw error;
        },
    });
};
