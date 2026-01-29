import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiPayments } from '@/lib/api/payments';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function usePayments() {
    return useQuery({
        queryKey: QUERY_KEYS.payments,
        queryFn: apiPayments.getAll,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch payments");
            console.error(error);
        },
    });
}

export function usePayment(id) {
    return useQuery({
        queryKey: QUERY_KEYS.payment(id),
        queryFn: () => apiPayments.getById(id),
        enabled: !!id,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch payment");
            console.error(error);
        },
    });
}

export function usePaymentFromCache(id) {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(QUERY_KEYS.payment(id));
}
