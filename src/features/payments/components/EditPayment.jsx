// EditPayment.tsx
import SelectField from "@/components/Form/SelectField";
import FormField from "@/components/Form/FormField";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";


export default function EditPayment({ payment, onSubmit, onClose }) {
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            percentage: payment.percentage?.toString() || "50",
            status: payment.status || "partially_paid",
        },
    });

    const onValidSubmit = (data) => {
        onSubmit({
            percentage: data.percentage,
            status: data.status,
        });
    };

    return (
        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6">
            <DialogHeader>
                <DialogTitle>Edit Payment</DialogTitle>
            </DialogHeader>

            <div className="flex items-center justify-between gap-6">
                <div className="w-[47%]">
                    <FormField
                        label="Payment percentage (%)"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        placeholder="50"
                        error={errors.percentage?.message}
                        {...register("percentage", {
                            required: "Percentage is required",
                            min: { value: 0, message: "Minimum 0%" },
                            max: { value: 100, message: "Maximum 100%" },
                            valueAsNumber: true,
                        })}
                    />
                </div>

                <div className="w-[47%]">
                    <Controller
                        control={control}
                        name="status"
                        rules={{ required: "Please select a status" }}
                        render={({ field }) => (
                            <SelectField
                                label="Payment Status"
                                placeholder="Select status..."
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                                options={[
                                    { value: "unpaid", label: "Unpaid" },
                                    { value: "partially_paid", label: "Partially Paid" },
                                    { value: "paid", label: "Paid" },
                                    { value: "overpaid", label: "Overpaid" },
                                    { value: "pending", label: "Pending" },
                                ]}
                                error={errors.status?.message}
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