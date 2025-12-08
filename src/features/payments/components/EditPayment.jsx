/* eslint-disable no-unused-vars */
// EditPayment.tsx
import FormField from "@/components/Form/FormField";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useUpdatePayment } from "../hooks/usePaymentQuery";

export default function EditPayment({ payment, onClose }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      percentage: payment.percentage || 50,
    },
  });

  const { mutate: updatePayment } = useUpdatePayment();

  const onValidSubmit = (data) => {
    console.log("Form submitted with data:", data);
    console.log("Payment ID:", payment.id);
    console.log("Current payment.percentage:", payment.percentage);

    updatePayment({
      id: payment?.id,
      data: {
        percentage: data.percentage,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Edit Payment</DialogTitle>
      </DialogHeader>

      <div className="w-full">
        <Controller
          name="percentage"
          control={control}
          rules={{
            required: "Percentage is required",
            min: { value: 0, message: "Minimum 0%" },
            max: { value: 100, message: "Maximum 100%" },
          }}
          render={({ field, fieldState: { error } }) => (
            <FormField
              id="percentage"
              label="Payment percentage (%)"
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="50"
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
              error={error?.message}
            />
          )}
        />
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogClose>

        <Button type="submit" className={"ml-4"}>
          Update Payment
        </Button>
      </DialogFooter>
    </form>
  );
}
