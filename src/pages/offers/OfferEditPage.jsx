import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { OfferForm } from "@/features/offers/components/OfferForm";
import { useOffer } from "@/features/offers/hooks/useOffersQuery";

export default function ServiceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const { data: offer, isLoading } = useOffer(id);

  if (!offer) return <div>offer not found</div>;

  return (
    <OfferForm offer={offer} onSuccess={() => navigate(`/${role}/offers`)} />
  );
}
