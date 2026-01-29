import { useMutation } from '@tanstack/react-query';
import api from '@/lib/utils/axios';

const verifyOtp = async (otpData) => {
    const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/otp/verify`,
        otpData,
        {
            headers: { Accept: 'application/json' },
        }
    );
    return response.data;
};

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: verifyOtp,
        onSuccess: (data) => {
            console.log('OTP verified successfully:', data);
        },
        onError: (error) => {
            console.error('OTP verification failed:', error);
            throw error;
        },
    });
};