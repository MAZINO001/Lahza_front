import { usePayments } from "@/features/payments/hooks/usePaymentQuery";
import PaymentTable from "@/features/payments/components/PaymentTable";

export default function PaymentsPage() {
  const { data: payments = [], isLoading } = usePayments();

  return <PaymentTable payments={payments} isLoading={isLoading} />;
};

