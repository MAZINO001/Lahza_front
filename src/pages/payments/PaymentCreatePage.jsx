import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import PaymentForm from "@/features/payments/components/PaymentForm";

export default function PaymentCreatePage() {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  return <PaymentForm onSuccess={() => navigate(`/${role}/payments`)} />;
}
