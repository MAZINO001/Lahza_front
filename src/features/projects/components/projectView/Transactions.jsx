import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Building2, Copy, CreditCard, Wallet } from "lucide-react";
import { formatId } from "@/lib/utils/formatId";

export default function Transactions({ transactions, role }) {
    const copyRIB = () => {
        const rib = "007640001433200000026029";
        navigator.clipboard
            .writeText(rib)
            .then(() => {
                toast.success("RIB copied to clipboard!");
            })
            .catch(() => {
                toast.error("Failed to copy RIB");
            });
    };

    const handleStripePayment = (paymentUrl) => {
        if (paymentUrl) {
            window.open(paymentUrl, "_blank");
        } else {
            toast.error("Payment URL not available");
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-foreground mb-4">
                Transactions
            </h3>
            <div className="space-y-2">
                {Array.isArray(transactions) && transactions.length > 0 ? (
                    transactions.map((tx) => (
                        <div
                            key={tx?.id}
                            className="flex items-center justify-between p-3 bg-secondary rounded-lg border transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-all hover:scale-105 ${tx?.payment_url
                                        ? "hover:bg-blue-100"
                                        : tx?.payment_method === "bank"
                                            ? "hover:bg-green-100"
                                            : "hover:bg-gray-100"
                                        }`}
                                    title={
                                        tx?.payment_url
                                            ? "Go to payment"
                                            : tx?.payment_method === "bank"
                                                ? "Copy RIB"
                                                : "Payment details"
                                    }
                                >
                                    {tx?.payment_url ? (
                                        <CreditCard className="w-6 h-6 text-primary" />
                                    ) : tx?.payment_method === "bank" ? (
                                        <Building2 className="w-6 h-6 text-primary" />
                                    ) : (
                                        <Wallet className="w-6 h-6 text-primary" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-4">
                                    <p className="text-sm font-medium text-foreground">
                                        <Link
                                            to={`/${role}/invoice/${tx?.invoice_id}`}
                                            className="hover:underline"
                                        >
                                            {formatId(tx?.invoice_id, "INVOICE")} -{" "}
                                        </Link>
                                        {tx?.percentage}% Payment
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {tx?.payment_method?.toUpperCase() || "OTHER"} •
                                        {tx?.payment_method === "bank" && (
                                            <span
                                                className="ml-2 text-blue-600 hover:text-blue-700 cursor-pointer items-center gap-1 inline-flex"
                                                onClick={() => {
                                                    if (tx?.payment_url) {
                                                        handleStripePayment(tx.payment_url);
                                                    } else if (tx?.payment_method === "bank") {
                                                        copyRIB();
                                                    }
                                                }}
                                            >
                                                <Copy className="w-3 h-3" />
                                                Copy RIB
                                            </span>
                                        )}
                                        {tx?.payment_url && (
                                            <span
                                                className="ml-2 text-blue-600 hover:text-blue-700 cursor-pointer inline-flex"
                                                onClick={() =>
                                                    handleStripePayment(tx.payment_url)
                                                }
                                            >
                                                Pay Now
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span
                                    className={`text-sm font-semibold ${tx?.status === "paid" ? "text-green-600" : "text-red-600"}`}
                                >
                                    {tx?.status === "paid" ? "Paid" : "Pending"}
                                </span>
                                <p className="text-sm font-medium text-foreground">
                                    {tx?.currency?.toUpperCase() || "MAD"} {tx?.amount || "0"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    of {tx?.currency?.toUpperCase() || "MAD"} {tx?.total || "0"}
                                </p>
                            </div>
                        </div>
                    ))
                ) : Array.isArray(transactions) ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Wallet />
                            </EmptyMedia>
                            <EmptyTitle>No transactions</EmptyTitle>
                            <EmptyDescription>
                                No payments have been recorded for this project yet.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : null}
            </div>
        </div>
    );
}
