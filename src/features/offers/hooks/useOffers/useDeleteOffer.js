import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiOffers } from '@/lib/api/offers';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useDeleteOffer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => {
            console.log('Delete mutation called with id:', id);
            return apiOffers.delete(id);
        },

        onMutate: async (id) => {
            console.log('onMutate triggered for id:', id);
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.offers });
            const previousOffers = queryClient.getQueryData(QUERY_KEYS.offers);
            console.log('Previous offers:', previousOffers);

            // Optimistically remove from cache
            queryClient.setQueryData(QUERY_KEYS.offers, (old) => {
                const filtered = old?.filter(offer => offer.id !== id) || [];
                console.log('Filtered offers after optimistic delete:', filtered);
                return filtered;
            });

            return { previousOffers };
        },

        onSuccess: (_, id) => {
            console.log('onSuccess triggered for id:', id);
            // Remove individual offer query
            queryClient.removeQueries({ queryKey: QUERY_KEYS.offer(id) });

            // The optimistic update in onMutate already removed it from the list
            // No need to invalidate since we have fresh data from optimistic update

            toast.success("Offer deleted");
        },

        onError: (error, id, context) => {
            console.log('onError triggered for id:', id, 'Error:', error);
            // Rollback on error
            if (context?.previousOffers) {
                queryClient.setQueryData(QUERY_KEYS.offers, context.previousOffers);
            }
            toast.error(error?.response?.data?.message || "Failed to delete offer");
            console.error(error);
        },
        onSettled: (_, error, id, context) => {
            console.log('onSettled triggered for id:', id, 'Error:', error);
        },
    });
}
