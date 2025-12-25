import React, { useState } from "react";
import { Sparkles, X, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/hooks/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import PaymentPercentage from "@/components/Invoice_Quotes/paymentPercentage";

export default function WhatsNextBanner({
  type,
  action,
  content,
  clientId,
  currentSection,
  totalAmount,
  balanceDue,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const { role } = useAuthContext();
  const navigate = useNavigate();
  const { cloneQuoteOrInvoice } = globalFnStore();

  if (!isVisible) return null;

  const handleActionClick = () => {
    if (action === "Generate Payment") {
      setIsPaymentDialogOpen(true);
    } else if (action === "Clone Quote") {
      cloneQuoteOrInvoice(clientId, type, role, currentSection, navigate);
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg px-4 py-4 w-full">
      <div className="flex  gap-4 items-center">
        <div
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-100 "
        >
          <Sparkles className="text-purple-600" size={18} />
        </div>

        <div className="flex items-center gap-4 w-full min-w-0 ">
          <div className="flex gap-2 space-y-1">
            <p className="font-semibold text-sm text-foreground">
              WHAT'S NEXT?
            </p>
            <p className="text-sm text-muted-foreground">{content}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 items-center flex-wrap">
            <Button size="sm" onClick={handleActionClick}>
              <Plus className="h-4 w-4" />
              {action}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 border border-border rounded-md">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setIsVisible(false)}>
                  Don't show again
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Button
          aria-label="Close banner"
          className="size-8 shrink-0 p-0 -mt-1 -mr-1"
          onClick={() => setIsVisible(false)}
          variant="ghost"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* PaymentPercentage Dialog */}
      {action === "Generate Payment" &&
        type === "invoice" &&
        role === "admin" && (
          <PaymentPercentage
            InvoiceId={clientId}
            totalAmount={totalAmount}
            balanceDue={balanceDue}
            isOpen={isPaymentDialogOpen}
            onOpenChange={setIsPaymentDialogOpen}
            icon={false}
          />
        )}
    </div>
  );
}
