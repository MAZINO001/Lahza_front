import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiPayments } from '@/lib/api/payments';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useTransActions(id) {
    return useQuery({
        queryKey: ['transactions', id],
        queryFn: () => apiPayments.getTransactionByProject(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnMount: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch transactions");
            console.error(error);
        },
    });
}
