import { useMutation } from '@tanstack/react-query';
import api from '@/lib/utils/axios';

const confirmPassword = async (passwordData) => {
    const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/confirm-password`,
        passwordData,
        {
            headers: { Accept: 'application/json' },
        }
    );
    return response.data;
};

export const useConfirmPassword = () => {
    return useMutation({
        mutationFn: confirmPassword,
        onSuccess: (data) => {
            console.log('Password confirmed/updated successfully:', data);
        },
        onError: (error) => {
            console.error('Password confirmation failed:', error);
            throw error;
        },
    });
};
