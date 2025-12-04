// PaymentPercentage.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
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


export default function PaymentPercentage({
  totalAmount: initialTotalAmount,
  onGenerateLink,
  isOpen: controlledOpen,
  onOpenChange,
}) {
  const totalAmount = parseFloat(initialTotalAmount) || 0;

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount_to_pay: "50",
      amount_rest: "",
    },
  });

  const amountToPay = watch("amount_to_pay");

  // Recalculate remaining when percentage changes
  useEffect(() => {
    const percentage = parseFloat(amountToPay) || 0;

    if (percentage < 0 || percentage > 100) {
      setValue("amount_rest", "");
      return;
    }

    const paidAmount = (totalAmount * percentage) / 100;
    const remaining = totalAmount - paidAmount;

    setValue("amount_rest", remaining > 0 ? remaining.toFixed(2) : "0.00");
  }, [amountToPay, totalAmount, setValue]);

  // Reset form when dialog opens
  useEffect(() => {
    if (controlledOpen) {
      reset({
        amount_to_pay: "50",
        amount_rest: "",
      });
    }
  }, [controlledOpen, reset]);

  const onSubmit = (data) => {
    const percentage = parseFloat(data.amount_to_pay) || 0;
    if (percentage >= 1 && percentage <= 100) {
      onGenerateLink(percentage);

      if (onOpenChange) {
        onOpenChange(false);
      }
    }
  };

  const isControlled = controlledOpen !== undefined;

  return (
    <Dialog open={isControlled ? controlledOpen : undefined} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Generate Partial Payment Link">
          <LinkIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Generate Partial Payment Link</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogDescription className="space-y-6">
            <div className="flex items-center justify-between gap-6">
              <div className="w-[47%]">
                <FormField
                  label="Amount to Pay (%)"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  placeholder="50"
                  error={errors.amount_to_pay?.message}
                  {...register("amount_to_pay", {
                    required: "Percentage is required",
                    min: { value: 1, message: "Min 1%" },
                    max: { value: 100, message: "Max 100%" },
                  })}
                />
              </div>

              <div className="w-[47%]">
                <FormField
                  label="Remaining Amount"
                  type="text"
                  value={
                    watch("amount_rest")
                      ? `${watch("amount_rest")} DH`
                      : "—"
                  }
                  readOnly
                  disabled
                  className="bg-gray-50 font-medium text-gray-700"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <strong>Total Due:</strong> {totalAmount.toFixed(2)} DH
              <br />
              <strong>Customer will pay:</strong>{" "}
              {amountToPay && !isNaN(parseFloat(amountToPay))
                ? ((totalAmount * parseFloat(amountToPay)) / 100).toFixed(2)
                : "0.00"}{" "}
              DH
            </div>
          </DialogDescription>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button
                type="submit"
                className={"ml-4"}
                disabled={!amountToPay || parseFloat(amountToPay) < 1 || parseFloat(amountToPay) > 100}
              >
                Generate Link
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}