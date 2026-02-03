import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { OfferForm } from "@/features/offers/components/OfferForm";

export default function OfferCreatePage() {
  const navigate = useNavigate();
  return <OfferForm onSuccess={() => navigate(-1)} />;
}
