import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { OfferForm } from "@/features/offers/components/OfferForm";

export default function OfferCreatePage() {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  return <OfferForm onSuccess={() => navigate(`/${role}/offers`)} />;
}
