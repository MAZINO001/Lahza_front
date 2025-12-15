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
import { usePayment, useUpdatePayment } from "../hooks/usePaymentQuery";
import SelectField from "@/components/Form/SelectField";

export default function EditPayment({ payment, onClose }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      percentage: payment?.percentage || 50,
      payment_type: payment?.payment_method,
    },
  });
  const { mutate: updatePayment } = useUpdatePayment();

  const onValidSubmit = (data) => {
    updatePayment({
      id: payment?.id,
      data: {
        percentage: data.percentage,
        payment_method: data.payment_type,
      },
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Edit Payment</DialogTitle>
      </DialogHeader>

      <div className="flex gap-4 w-full">
        <div className="w-[50%]">
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
        <div className="w-[50%]">
          <Controller
            name="payment_type"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <SelectField
                id="payment_type"
                label="Payment Type"
                type="select"
                value={field.value || ""}
                options={[
                  { value: "bank", label: "Bank" },
                  { value: "cash", label: "Cash" },
                  { value: "espace", label: "Espace" },
                  { value: "stripe", label: "Stripe" },
                ]}
                onChange={(e) => field.onChange(e)}
                onBlur={field.onBlur}
                error={error?.message}
              />
            )}
          />
        </div>
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
