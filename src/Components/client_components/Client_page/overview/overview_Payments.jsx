import { Card, CardContent } from "@/components/ui/card";
import { usePayments } from "@/features/payments/hooks/usePayments/usePaymentsData";
import { useAuthContext } from "@/hooks/AuthContext";
import { formatId } from "@/lib/utils/formatId";
import { Link } from "react-router-dom";
export default function Overview_Payments({ formatCurrency, currentId }) {
  const { role } = useAuthContext();

  const { data: Payments = [] } = usePayments();

  const filteredData = Payments.filter(
    (payment) =>
      payment.client_id === Number(currentId) && payment.status === "paid",
  );

  return (
    <Card>
      <CardContent>
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
                <Link
                  to={`/${role}/invoice/${item?.invoice.id}`}
                  className="hover:underline"
                >
                  {formatId(item?.invoice.id, "INVOICE")}
                </Link>
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
