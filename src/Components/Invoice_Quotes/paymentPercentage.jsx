// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import InputLabel from "../InputLabel";
// import InputError from "../InputError";
// import FormField from "../Form/FormField";
// import SelectField from "../Form/SelectField";

// export default function PaymentPercentage({ data }) {
//   const totalAmount = parseFloat(data) || 0;

//   const {
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       amount_to_pay: "50", // default 50%
//       amount_rest: "",
//     },
//   });

//   const amountToPayInput = watch("amount_to_pay") || "";

//   useEffect(() => {
//     if (!amountToPayInput) {
//       setValue("amount_rest", "");
//       return;
//     }

//     // Clean input: remove % and extra spaces
//     const cleaned = amountToPayInput.toString().replace("%", "").trim();
//     const percentage = parseFloat(cleaned);

//     if (isNaN(percentage) || percentage < 0) {
//       setValue("amount_rest", "");
//       return;
//     }

//     const paidAmount = (totalAmount * percentage) / 100;
//     const remaining = totalAmount - paidAmount;

//     setValue("amount_rest", remaining > 0 ? remaining.toFixed(2) : "0.00");
//   }, [amountToPayInput, totalAmount, setValue]);

//   // Format input to always show % sign
//   const formatPercentageInput = (value) => {
//     if (!value) return "";
//     const cleaned = value.replace(/[^\d.]/g, "");
//     return cleaned ? `${cleaned}%` : "";
//   };

//   return (
//     <div className="grid grid-cols-2 gap-6">
//       <div>
//         <InputLabel htmlFor="amount_to_pay" value="Amount to Pay (%)" />
//         <SelectField
//           id="amount_to_pay"
//           placeholder="50%"
//           value={formatPercentageInput(amountToPayInput)}
//           onChange={(value) => setValue("amount_to_pay", value)}
//           options={[
//             { value: "30", label: "30%" },
//             { value: "50", label: "50%" },
//             { value: "70", label: "70%" },
//             { value: "100", label: "100%" },
//           ]}
//           className="mt-1 block w-full font-medium"
//         />
//         <InputError message={errors.amount_to_pay?.message} />
//       </div>

//       <div>
//         <InputLabel htmlFor="amount_rest" value="Remaining Amount" />
//         <FormField
//           id="amount_rest"
//           type="text"
//           value={watch("amount_rest") ? `${watch("amount_rest")} DH` : ""}
//           readOnly
//           disabled
//           className="mt-1 block w-full bg-muted/50 font-medium"
//         />
//       </div>
//     </div>
//   );
// }

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputLabel from "../InputLabel";
import InputError from "../InputError";
import SelectField from "../comp-192";
import FormField from "../Form/FormField";
export default function PaymentPercentage({ data = 0 }) {
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

  const amountToPayInput = watch("amount_to_pay") || "";

  useEffect(() => {
    if (!amountToPayInput) {
      setValue("amount_rest", "");
      return;
    }

    const cleaned = amountToPayInput.toString().replace("%", "").trim();
    const percentage = parseFloat(cleaned);

    if (isNaN(percentage) || percentage < 0) {
      setValue("amount_rest", "");
      return;
    }

    const paidAmount = (totalAmount * percentage) / 100;
    const remaining = totalAmount - paidAmount;

    setValue("amount_rest", remaining > 0 ? remaining.toFixed(2) : "0.00");
  }, [amountToPayInput, totalAmount, setValue]);

  return (
    <div className="flex items-center justify-between">
      <div>
        <InputLabel htmlFor="amount_to_pay" value="Amount to Pay (%)" />
        <SelectField
          id="amount_to_pay"
          placeholder="Select percentage"
          value={amountToPayInput}
          onChange={(value) => setValue("amount_to_pay", value)}
          options={[
            { value: "30", label: "30%" },
            { value: "50", label: "50%" },
            { value: "70", label: "70%" },
            { value: "100", label: "100%" },
          ]}
          className="mt-1 block w-full font-medium"
          portal={false}
          disablePortal
        />
        <InputError message={errors.amount_to_pay?.message} />
      </div>

      <div>
        <InputLabel htmlFor="amount_rest" value="Remaining Amount" />
        <FormField
          id="amount_rest"
          type="text"
          value={watch("amount_rest") ? `${watch("amount_rest")} DH` : ""}
          readOnly
          disabled
          className="mt-1 block w-full bg-gray-100 font-medium"
        />
      </div>
    </div>
  );
}
