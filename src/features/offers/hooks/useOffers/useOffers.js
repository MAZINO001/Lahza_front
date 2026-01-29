import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiOffers } from '@/lib/api/offers';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useOffers() {
    return useQuery({
        queryKey: QUERY_KEYS.offers,
        queryFn: apiOffers.getAll,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch offers");
            console.error(error);
        },
    });
}

export function useOffer(id) {
    return useQuery({
        queryKey: QUERY_KEYS.offer(id),
        queryFn: () => apiOffers.getById(id),
        enabled: !!id,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch offer");
            console.error(error);
        },
    });
}

export function useOfferFromCache(id) {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(QUERY_KEYS.offer(id));
}
