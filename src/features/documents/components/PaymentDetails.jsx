/* eslint-disable no-unused-vars */
import { useState } from "react";
import { format } from "date-fns";
import { useDocumentPayments } from "../hooks/useDocumentPayments";

export default function PaymentDetails({ invoiceId }) {
  const [error, setError] = useState(null);

  const { data: payments = [], isLoading } = useDocumentPayments(invoiceId);
  console.log(payments)
  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading payment details...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!payments || payments.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No payment records found</div>;
  }

  return (
    <div>
      <h5 className="font-medium mb-2 text-sm">Payment History</h5>
      <div className="space-y-3">
        {payments.map((payment, index) => (
          <div
            key={payment.id || index}
            className="p-4 bg-muted/20 rounded-lg border border-border/50"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: payment.currency || "USD",
                  }).format(payment.amount)}
                </p>
                {payment.payment_date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(payment.payment_date), "MMM dd, yyyy HH:mm")}
                  </p>
                )}
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {payment.status || "Completed"}
              </span>
            </div>
            {payment.payment_method && (
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Method: </span>
                <span className="font-medium">
                  {payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1)}
                </span>
              </div>
            )}
            {payment.transaction_id && (
              <div className="mt-1 text-sm">
                <span className="text-muted-foreground">Transaction ID: </span>
                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                  {payment.transaction_id}
                </span>
              </div>
            )}
            {payment.notes && (
              <div className="mt-2 text-sm">
                <p className="text-muted-foreground">Notes:</p>
                <p className="text-sm">{payment.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
