import React from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SelectField from "@/components/Form/SelectField";
import FormField from "@/components/Form/FormField";

export default function SendPopUp({
  id,
  email,
  type,
  open,
  onOpenChange,
  invoiceId,
}) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      payment_type: "",
      payment_percentage: "",
      payment_status: "",
    },
  });


  const onSubmit = async (data) => {
    try {
      const payload = {
        payment_type: data.payment_type,
        payment_percentage: data.payment_percentage,
        payment_status: data.payment_status,
      };

      await api.put(
        `${import.meta.env.VITE_BACKEND_URL}/invoices/${invoiceId}/send`,
        payload,
      );
      toast.success(`${type} is sent`);

      // Invalidate invoices cache to refresh the data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices });

      reset();
      onOpenChange(false);
    } catch (error) {
      console.log(error);
      toast.error(`Failed to send ${type}`);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            Enter your payment information before sending the {type}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-full">
            <div className="flex md:flex-row flex-col gap-4 items-end justify-between rounded-lg">
              <div className="w-full flex gap-4 items-center justify-between ">
                {/* Payment Type */}
                <div className="w-[33%]">
                  <Controller
                    name="payment_type"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <SelectField
                        id="payment_type"
                        label="Type"
                        type="select"
                        value={field.value || ""}
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

                {/* Payment Percentage */}
                <div className="w-[33%]">
                  <Controller
                    name="payment_percentage"
                    control={control}
                    rules={{ required: "Amount is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <FormField
                        id="payment_percentage"
                        label="Percentage"
                        min="1"
                        max="100"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                        error={error?.message}
                      />
                    )}
                  />
                </div>

                {/* Payment Status */}
                <div className="w-[33%]">
                  <Controller
                    name="payment_status"
                    control={control}
                    rules={{ required: "Status is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <SelectField
                        id="payment_status"
                        label="Status"
                        type="select"
                        value={field.value || ""}
                        options={[
                          { value: "pending", label: "Pending" },
                          { value: "paid", label: "Paid" },
                        ]}
                        onChange={(e) => field.onChange(e)}
                        onBlur={field.onBlur}
                        error={error?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Payment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
