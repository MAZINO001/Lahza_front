import { useState } from "react";
import { format } from "date-fns";
import { useDocumentPayments } from "../hooks/useDocumentPayments";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export default function PaymentDetails({ invoiceId }) {
  const [error, setError] = useState(null);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, {
      duration: 3000,
    });
  };

  const { data: payments = [], isLoading } = useDocumentPayments(invoiceId);
  console.log(payments);
  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading payment details...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No payment records found
      </div>
    );
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
                  {new Intl.NumberFormat("fr-MA", {
                    style: "currency",
                    currency: "MAD",
                  }).format(payment.amount)}
                </p>

                {payment.updated_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(payment.updated_at), "MMM dd, yyyy HH:mm")}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <span>
                  <StatusBadge status={payment.status} />
                </span>
                {payment.status === "pending" &&
                  (payment.payment_method === "stripe" ||
                    payment.payment_method === "bank") && (
                    <div className="mt-1 text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (payment.payment_method === "stripe") {
                            copyToClipboard(payment.payment_url, "Payment Url");
                          }

                          if (payment.payment_method === "bank") {
                            copyToClipboard(
                              "007 640 0014332000000260 29",
                              "Payment Url"
                            );
                          }
                        }}
                      >
                        <Copy className="mr-1 h-4 w-4" />
                        Copy Rib
                      </Button>
                    </div>
                  )}
              </div>
            </div>
            {payment.payment_method && (
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Method: </span>
                <span className="font-medium">
                  {payment.payment_method.charAt(0).toUpperCase() +
                    payment.payment_method.slice(1)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
