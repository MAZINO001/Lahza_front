// import React, { useEffect, useRef } from "react";
// import { useForm, Controller } from "react-hook-form";
// import FormField from "../Form/FormField";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { LinkIcon } from "lucide-react";
// import { useAddAdditionalPayment } from "@/features/documents/hooks/useDocumentPayments";
// import { useDocumentPayments } from "@/features/documents/hooks/useDocumentPayments";

// export default function PaymentPercentage({
//   totalAmount,
//   balanceDue,
//   isOpen: controlledOpen,
//   onOpenChange,
//   InvoiceId,
// }) {
//   const autoPaymentGeneratedRef = useRef(false);
//   const totalPercentageAmount = (balanceDue / totalAmount) * 100;
//   const {
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       amount_to_pay: "",
//       amount_rest: Number(balanceDue).toFixed(2),
//     },
//   });

//   const amountToPay = watch("amount_to_pay");

//   const addPaymentMutation = useAddAdditionalPayment();

//   const onGenerateLink = (percentage) => {
//     addPaymentMutation.mutate(
//       { invoiceId: InvoiceId, percentage },
//       {
//         onSuccess: () => {
//           onOpenChange?.(false);
//         },
//       }
//     );
//   };

//   useEffect(() => {
//     const percentage = parseFloat(amountToPay) || 0;

//     if (percentage < 0 || percentage > totalPercentageAmount) {
//       setValue("amount_rest", Number(balanceDue).toFixed(2));
//       return;
//     }

//     // amount being paid NOW
//     const payingNow = (balanceDue * percentage) / totalPercentageAmount;

//     // new remaining
//     const remaining = balanceDue - payingNow;

//     setValue("amount_rest", remaining.toFixed(2));
//   }, [amountToPay, balanceDue, totalPercentageAmount, setValue]);

//   useEffect(() => {
//     if (controlledOpen) {
//       reset({
//         amount_to_pay: "0",
//         amount_rest: Number(balanceDue).toFixed(2),
//       });
//     }
//   }, [controlledOpen, reset, balanceDue]);

//   const onSubmit = (data) => {
//     const percentage = parseFloat(data.amount_to_pay) || 0;
//     if (percentage >= 0 && percentage <= totalPercentageAmount) {
//       onGenerateLink(percentage);
//     }
//   };

//   const { data: Payments } = useDocumentPayments(InvoiceId);
//   const filteredPayments = Payments?.filter((p) => p.status === "paid");
//   console.log(filteredPayments);

//   useEffect(() => {
//     if (
//       totalPercentageAmount < 50 &&
//       totalPercentageAmount > 0 &&
//       !autoPaymentGeneratedRef.current
//     ) {
//       console.log(
//         "Generating additional payment link for invoice with less than 50% payment"
//       );
//       const additionalPercentage = Math.min(
//         50 - totalPercentageAmount,
//         totalPercentageAmount
//       );
//       console.log(
//         `Generating payment link for ${additionalPercentage.toFixed(2)}% additional payment`
//       );
//       autoPaymentGeneratedRef.current = true;
//       onGenerateLink(additionalPercentage);
//     }
//   }, [totalPercentageAmount]);

//   return (
//     <Dialog open={controlledOpen} onOpenChange={onOpenChange}>
//       <DialogTrigger asChild>
//         <Button
//           variant="outline"
//           size="icon"
//           title="Generate Partial Payment Link"
//         >
//           <LinkIcon className="h-4 w-4" />
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Generate Partial Payment Link</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <DialogDescription className="space-y-6">
//             <div className="flex items-center justify-between gap-6">
//               <div className="w-[47%]">
//                 <Controller
//                   name="amount_to_pay"
//                   control={control}
//                   rules={{
//                     min: { value: 0, message: "Min is 0%" },
//                     max: {
//                       value: totalPercentageAmount,
//                       message: `Max allowed is ${totalPercentageAmount.toFixed(2)}%`,
//                     },
//                   }}
//                   render={({ field }) => (
//                     <FormField
//                       {...field}
//                       label={`Amount to Pay (%)`}
//                       type="number"
//                       min="0"
//                       max={totalPercentageAmount}
//                       step="1"
//                       placeholder="0"
//                       error={errors.amount_to_pay?.message}
//                     />
//                   )}
//                 />
//               </div>

//               <div className="w-[47%]">
//                 <Controller
//                   name="amount_rest"
//                   control={control}
//                   render={({ field }) => (
//                     <FormField
//                       {...field}
//                       label="Remaining Amount"
//                       type="text"
//                       value={`${field.value} DH`}
//                       readOnly
//                       disabled
//                       className="bg-gray-50 font-medium text-gray-700"
//                     />
//                   )}
//                 />
//               </div>
//             </div>

//             <div className="text-sm text-gray-600">
//               <strong>Total Amount:</strong> {totalAmount} DH <br />
//               <strong>Balance Due:</strong> {balanceDue} DH <br />
//               <strong>Max Payable (%):</strong>{" "}
//               {totalPercentageAmount.toFixed(2)}%
//             </div>
//           </DialogDescription>

//           <DialogFooter>
//             <DialogClose asChild>
//               <Button type="button" variant="outline">
//                 Cancel
//               </Button>
//             </DialogClose>

//             <Button
//               type="submit"
//               disabled={
//                 parseFloat(amountToPay) < 0 ||
//                 parseFloat(amountToPay) > totalPercentageAmount ||
//                 addPaymentMutation.isLoading
//               }
//             >
//               {addPaymentMutation.isLoading ? "Generating..." : "Generate Link"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
import { useAddAdditionalPayment } from "@/features/documents/hooks/useDocumentPayments";
import { useDocumentPayments } from "@/features/documents/hooks/useDocumentPayments";

export default function PaymentPercentage({
  totalAmount,
  balanceDue,
  isOpen: controlledOpen,
  onOpenChange,
  InvoiceId,
}) {
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
      amount_to_pay: "",
      amount_rest: Number(balanceDue).toFixed(2),
    },
  });

  const amountToPay = watch("amount_to_pay");

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

    // amount being paid NOW
    const payingNow = (balanceDue * percentage) / totalPercentageAmount;

    // new remaining
    const remaining = balanceDue - payingNow;

    setValue("amount_rest", remaining.toFixed(2));
  }, [amountToPay, balanceDue, totalPercentageAmount, setValue]);

  useEffect(() => {
    if (controlledOpen) {
      reset({
        amount_to_pay: "0",
        amount_rest: Number(balanceDue).toFixed(2),
      });
    }
  }, [controlledOpen, reset, balanceDue]);

  const onSubmit = (data) => {
    const percentage = parseFloat(data.amount_to_pay) || 0;
    if (percentage >= 0 && percentage <= totalPercentageAmount) {
      onGenerateLink(percentage);
    }
  };

  const { data: Payments } = useDocumentPayments(InvoiceId);
  const filteredPayments = Payments?.filter((p) => p.status === "paid");
  console.log(filteredPayments);

  // REMOVED THE PROBLEMATIC useEffect THAT WAS CAUSING THE INFINITE LOOP

  return (
    <Dialog open={controlledOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Generate Partial Payment Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Partial Payment Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogDescription className="space-y-6">
            <div className="flex items-center justify-between gap-6">
              <div className="w-[47%]">
                <Controller
                  name="amount_to_pay"
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
                      label={`Amount to Pay (%)`}
                      type="number"
                      min="0"
                      max={totalPercentageAmount}
                      step="1"
                      placeholder="0"
                      error={errors.amount_to_pay?.message}
                    />
                  )}
                />
              </div>

              <div className="w-[47%]">
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
                      className="bg-gray-50 font-medium text-gray-700"
                    />
                  )}
                />
              </div>
            </div>

            <div className="text-sm text-gray-600">
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
