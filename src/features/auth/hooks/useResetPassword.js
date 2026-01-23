import { useMutation } from '@tanstack/react-query';
import api from '@/lib/utils/axios';

const resetPassword = async (resetData) => {
    const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/reset-password`,
        resetData,
        {
            headers: { Accept: 'application/json' },
        }
    );
    return response.data;
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            console.log('Password reset successfully:', data);
        },
        onError: (error) => {
            console.error('Password reset failed:', error);
            throw error;
        },
    });
};
