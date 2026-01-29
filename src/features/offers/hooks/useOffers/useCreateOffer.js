import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiOffers } from '@/lib/api/offers';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useCreateOffer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: apiOffers.create,

        // Optimistic update before server response
        onMutate: async (newOfferData) => {
            // Cancel in-flight queries
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.offers });

            // Snapshot previous state
            const previousOffers = queryClient.getQueryData(QUERY_KEYS.offers);

            // Add optimistic item with temp ID
            const tempId = `temp-${Date.now()}`;
            queryClient.setQueryData(QUERY_KEYS.offers, (old) => [
                ...(old || []),
                { ...newOfferData, id: tempId }
            ]);

            return { previousOffers, tempId };
        },

        // Update with server response (replace temp ID with real ID)
        onSuccess: (response, variables, context) => {
            queryClient.setQueryData(QUERY_KEYS.offers, (old) =>
                old?.map(offer =>
                    offer.id === context?.tempId ? response : offer
                ) || []
            );
            
            toast.success("Offer created successfully!");
        },

        // Rollback on error
        onError: (error, variables, context) => {
            if (context?.previousOffers) {
                queryClient.setQueryData(QUERY_KEYS.offers, context.previousOffers);
            }
            toast.error(error?.response?.data?.message || "Failed to create offer");
            console.error(error);
        },
    });
}
