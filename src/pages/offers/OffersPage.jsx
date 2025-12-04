import { OfferTable } from "@/features/offers/components/OfferTable";
import { useOffers } from "@/features/offers/hooks/useOffersQuery";

export default function ServicesPage() {
  const { data: offers = [], isLoading } = useOffers();

  return <OfferTable offers={offers} isLoading={isLoading} />;
}
