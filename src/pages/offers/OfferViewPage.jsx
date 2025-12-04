// src/pages/services/ServiceViewPage.jsx
import ServicesSidebar from "@/components/services_offers/service_sidebar";
import ServicePage from "@/components/services_offers/service_offers_page";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOffer, useOffers } from "@/features/offers/hooks/useOffersQuery";

export default function ServiceViewPage() {
  const { id } = useParams();

  const {
    data: offers = [],
    isLoading: offersLoading,
    isError: offersError,
  } = useOffers();

  // Current service for main view
  const {
    data: offer,
    isLoading: offerLoading,
    isError: offerError,
  } = useOffer(id);

  // Loading state
  if (offersLoading || offerLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-80 border-r bg-white p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-10">
          <Skeleton className="h-12 w-96 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (offersError || offerError || !offer) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {offersError || offerError
              ? "Failed to load service. Please try again."
              : "Service not found."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ServicesSidebar type="offer" data={offers} currentId={id} />
      <ServicePage type="offer" data={offer} />
    </div>
  );
}
