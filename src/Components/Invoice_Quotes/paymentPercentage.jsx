import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputLabel from "../InputLabel";
import InputError from "../InputError";
import FormField from "../Form/FormField";

export default function PaymentPercentage({ data }) {
  const totalAmount = parseFloat(data) || 0;

  const {
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount_to_pay: "50",
      amount_rest: "",
    },
  });

  const amountToPayInput = watch("amount_to_pay");

  useEffect(() => {
    const percentage = parseFloat(amountToPayInput);

    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      setValue("amount_rest", "");
      return;
    }

    const paidAmount = (totalAmount * percentage) / 100;
    const remaining = totalAmount - paidAmount;

    setValue("amount_rest", remaining > 0 ? remaining.toFixed(2) : "0.00");
  }, [amountToPayInput, totalAmount, setValue]);

  return (
    <div
      className="flex items-center justify-between gap-6"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="w-[47%]">
        <InputLabel htmlFor="amount_to_pay" value="Amount to Pay (%)" />

        <FormField
          type="number"
          min="0"
          max="100"
          step="1"
          placeholder="50"
          className="mt-1"
          value={watch("amount_to_pay") || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || (!isNaN(val) && val >= 0 && val <= 100)) {
              setValue("amount_to_pay", val);
            }
          }}
        />
        <InputError message={errors.amount_to_pay?.message} />
      </div>

      <div className="w-[47%]">
        <InputLabel htmlFor="amount_rest" value="Remaining Amount" />

        <FormField
          type="text"
          placeholder="0.00"
          value={
            watch("amount_rest") !== undefined && watch("amount_rest") !== ""
              ? `${watch("amount_rest")} DH`
              : ""
          }
          readOnly
          disabled
          className="mt-1 block w-full bg-gray-100 font-medium text-gray-700"
        />
      </div>
    </div>
  );
}
