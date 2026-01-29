import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useUpdatePaymentDate } from "../hooks/usePayments/usePaymentsData";
import DateField from "@/components/Form/DateField";

export default function EditPayment({ PaymentId, date, onClose }) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      paid_at: date?.slice(0, 10) || "",
    },
  });

  const updatePaymentDate = useUpdatePaymentDate();
  const onSubmit = (data) => {
    updatePaymentDate.mutate(
      { id: PaymentId, paid_at: data.paid_at },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="paid_at"
        control={control}
        render={({ field }) => (
          // <FormField
          <DateField label="Paid At" type="date" {...field} />
        )}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
}
