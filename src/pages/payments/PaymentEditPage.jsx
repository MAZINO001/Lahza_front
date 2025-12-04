import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { usePayment } from "@/features/payments/hooks/usePaymentQuery";
import PaymentForm from "@/features/payments/components/PaymentForm";
const PaymentEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const { data: payment, isLoading } = usePayment(id);

  if (!offer) return <div>payment not found</div>;

  return (
    <PaymentForm payment={payment} onSuccess={() => navigate(`/${role}/payments`)} />
  );
};

export default PaymentEditPage;
