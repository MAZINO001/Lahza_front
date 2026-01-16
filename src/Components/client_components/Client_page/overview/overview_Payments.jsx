import { Card, CardContent } from "@/components/ui/card";
import { usePayments } from "@/features/payments/hooks/usePaymentQuery";
import { formatId } from "@/lib/utils/formatId";
export default function Overview_Payments({ formatCurrency, currentId }) {
  const receivablesData = [
    {
      currency: "USD",
      fullName: "United States Dollar",
      outstanding: 0.0,
      unusedCredits: 0.0,
    },
    {
      currency: "EUR",
      fullName: "Euro",
      outstanding: 0.0,
      unusedCredits: 0.0,
    },
  ];

  const { data: Payments = [] } = usePayments();

  const filteredData = Payments.filter(
    (payment) =>
      payment.client_id === Number(currentId) && payment.status === "paid"
  );

  const paymentDuePeriod = "Due on Receipt";
  const receivables = receivablesData;
  return (
    <Card className="p-0">
      <CardContent className="p-4">
        <div>
          <h3 className="text-base font-semibold text-foreground mb-2">
            Receivables
          </h3>

          <div className="grid grid-cols-3 gap-4 py-2 border-b border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              invoice id
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
              Balance Due
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
              Total Income
            </div>
          </div>

          {filteredData?.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 py-3 border-b border-border last:border-0"
            >
              <div className="text-sm text-foreground">
                {formatId(item?.invoice.id, "INVOICE")}
              </div>
              <div className="text-sm text-foreground text-right font-medium">
                {formatCurrency(item?.invoice.balance_due)}
              </div>
              <div className="text-sm text-foreground text-right font-medium">
                {formatCurrency(item?.invoice.total_amount)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
