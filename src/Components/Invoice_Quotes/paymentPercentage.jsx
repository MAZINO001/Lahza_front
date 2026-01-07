import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import FormField from "../Form/FormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { LinkIcon } from "lucide-react";
import {
  useAddAdditionalPayment,
  useDocumentPayments,
} from "@/features/documents/hooks/useDocumentPayments";
import SelectField from "../Form/SelectField";

export default function PaymentPercentage({
  totalAmount,
  balanceDue,
  isOpen: controlledOpen,
  onOpenChange,
  InvoiceId,
  icon,
}) {
  const { data: payments = [] } = useDocumentPayments(InvoiceId);
  const lastPayment = payments.at(-1)?.payment_type || "stripe";

  const totalPercentageAmount = (balanceDue / totalAmount) * 100;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment_percentage: "0",
      amount_rest: Number(balanceDue).toFixed(2),
      payment_type: lastPayment,
    },
  });
  const amountToPay = watch("payment_percentage");
  const addPaymentMutation = useAddAdditionalPayment();

  const onGenerateLink = (percentage) => {
    addPaymentMutation.mutate(
      { invoiceId: InvoiceId, percentage },
      {
        onSuccess: () => {
          onOpenChange?.(false);
        },
      }
    );
  };

  useEffect(() => {
    const percentage = parseFloat(amountToPay) || 0;

    if (percentage < 0 || percentage > totalPercentageAmount) {
      setValue("amount_rest", Number(balanceDue).toFixed(2));
      return;
    }

    const payingNow = (balanceDue * percentage) / totalPercentageAmount;
    const remaining = balanceDue - payingNow;

    setValue("amount_rest", remaining.toFixed(2));
  }, [amountToPay, balanceDue, totalPercentageAmount, setValue]);

  useEffect(() => {
    if (controlledOpen) {
      reset({
        payment_percentage: "0",
        amount_rest: Number(balanceDue).toFixed(2),
        payment_type: lastPayment,
      });
    }
  }, [controlledOpen, reset, balanceDue, lastPayment]);

  const onSubmit = (data) => {
    const percentage = parseFloat(data.payment_percentage) || 0;
    if (percentage >= 0 && percentage <= totalPercentageAmount) {
      onGenerateLink(percentage);
    }
  };

  return (
    <Dialog open={controlledOpen} onOpenChange={onOpenChange}>
      {icon && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            title="Generate Partial Payment Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Partial Payment Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogDescription className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="w-[33%]">
                <Controller
                  name="payment_percentage"
                  control={control}
                  rules={{
                    min: { value: 0, message: "Min is 0%" },
                    max: {
                      value: totalPercentageAmount,
                      message: `Max allowed is ${totalPercentageAmount.toFixed(2)}%`,
                    },
                  }}
                  render={({ field }) => (
                    <FormField
                      {...field}
                      label="Amount to Pay (%)"
                      type="number"
                      min="0"
                      max={totalPercentageAmount}
                      step="1"
                      placeholder="0"
                      error={errors.payment_percentage?.message}
                    />
                  )}
                />
              </div>

              <div className="w-[33%]">
                <Controller
                  name="amount_rest"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      {...field}
                      label="Remaining Amount"
                      type="text"
                      value={`${field.value} DH`}
                      readOnly
                      disabled
                      className="bg-background font-medium text-foreground"
                    />
                  )}
                />
              </div>

              <div className="w-[33%]">
                <Controller
                  name="payment_type"
                  control={control}
                  rules={{ required: "Payment method is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <SelectField
                      id="payment_type"
                      label="Payment Method"
                      type="select"
                      value={field.value || lastPayment}
                      options={[
                        { value: "bank", label: "Bank" },
                        { value: "cash", label: "Cash" },
                        { value: "cheque", label: "Cheque" },
                        { value: "stripe", label: "Stripe" },
                      ]}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={error?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <strong>Total Amount:</strong> {totalAmount} DH <br />
              <strong>Balance Due:</strong> {balanceDue} DH <br />
              <strong>Max Payable (%):</strong>{" "}
              {totalPercentageAmount.toFixed(2)}%
            </div>
          </DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={
                parseFloat(amountToPay) < 0 ||
                parseFloat(amountToPay) > totalPercentageAmount ||
                addPaymentMutation.isLoading
              }
            >
              {addPaymentMutation.isLoading ? "Generating..." : "Generate Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
