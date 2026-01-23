import { useMutation } from '@tanstack/react-query';
import api from '@/lib/utils/axios';

const forgotPassword = async (emailData) => {
    const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/forgot-password`,
        emailData,
        {
            headers: { Accept: 'application/json' },
        }
    );
    return response.data;
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            console.log('Password reset link sent successfully:', data);
        },
        onError: (error) => {
            console.error('Failed to send password reset link:', error);
            throw error;
        },
    });
};
