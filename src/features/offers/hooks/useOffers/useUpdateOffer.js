import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiOffers } from '@/lib/api/offers';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useUpdateOffer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => apiOffers.update(id, data),

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.offers });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.offer(id) });

            const previousOffers = queryClient.getQueryData(QUERY_KEYS.offers);
            const previousOffer = queryClient.getQueryData(QUERY_KEYS.offer(id));

            queryClient.setQueryData(QUERY_KEYS.offers, (old) =>
                old?.map(offer =>
                    offer.id === id ? { ...offer, ...data } : offer
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.offer(id), (old) =>
                old ? { ...old, ...data } : old
            );

            return { previousOffers, previousOffer };
        },

        onSuccess: (response, { id }) => {
            queryClient.setQueryData(QUERY_KEYS.offers, (old) =>
                old?.map(offer =>
                    offer.id === id ? response : offer
                ) || []
            );

            queryClient.setQueryData(QUERY_KEYS.offer(id), response);
            toast.success("Offer updated successfully!");
        },

        onError: (error, { id }, context) => {
            if (context?.previousOffers) {
                queryClient.setQueryData(QUERY_KEYS.offers, context.previousOffers);
            }
            if (context?.previousOffer) {
                queryClient.setQueryData(QUERY_KEYS.offer(id), context.previousOffer);
            }
            toast.error(error?.response?.data?.message || "Failed to update offer");
            console.error(error);
        },
    });
}
