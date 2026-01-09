// src/features/receipts/components/ReceiptForm.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import TextareaField from "@/Components/Form/TextareaField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, User, CreditCard, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const paymentMethods = [
    {
        id: "credit-card",
        title: "Credit Card",
        description: "Visa, Mastercard, American Express",
        icon: "💳",
        color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
        id: "paypal",
        title: "PayPal",
        description: "PayPal payment processing",
        icon: "🅿️",
        color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
        id: "bank-transfer",
        title: "Bank Transfer",
        description: "Direct bank transfer",
        icon: "🏦",
        color: "text-green-600 bg-green-50 border-green-200",
    },
    {
        id: "cash",
        title: "Cash",
        description: "Cash payment",
        icon: "💵",
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    },
];

export function ReceiptForm({ receipt, onSuccess }) {
    const navigate = useNavigate();
    const { role } = useAuthContext();
    const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
    const isEditMode = !!receipt?.id;

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: receipt || {
            clientName: "",
            clientEmail: "",
            clientPhone: "",
            clientAddress: "",
            amount: "",
            taxAmount: "",
            paymentMethod: "",
            receiptDate: new Date().toISOString().split('T')[0],
            description: "",
            notes: "",
            status: "paid",
            referenceNumber: "",
            items: [
                {
                    id: Date.now(),
                    description: "",
                    quantity: 1,
                    unitPrice: "",
                    total: 0
                }
            ],
            sendEmail: false,
        },
    });

    const watchedItems = watch("items");
    const watchedAmount = watch("amount");
    const watchedTaxAmount = watch("taxAmount");
    const selectedPaymentMethod = watch("paymentMethod");

    // Calculate totals
    React.useEffect(() => {
        const subtotal = watchedItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        const tax = parseFloat(watchedTaxAmount) || 0;
        const total = subtotal + tax;

        if (!isEditMode && !watchedAmount) {
            setValue("amount", subtotal.toFixed(2));
        }
    }, [watchedItems, watchedTaxAmount, setValue, isEditMode, watchedAmount]);

    const generateReferenceNumber = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const ref = `RCP-${timestamp}-${random}`;
        setValue("referenceNumber", ref);
    };

    const addItem = () => {
        const newItems = [
            ...watchedItems,
            {
                id: Date.now(),
                description: "",
                quantity: 1,
                unitPrice: "",
                total: 0
            }
        ];
        setValue("items", newItems);
    };

    const removeItem = (index) => {
        const newItems = watchedItems.filter((_, i) => i !== index);
        setValue("items", newItems);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...watchedItems];
        newItems[index][field] = value;

        // Calculate total when quantity or unit price changes
        if (field === "quantity" || field === "unitPrice") {
            const quantity = parseFloat(newItems[index].quantity) || 0;
            const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
            newItems[index].total = quantity * unitPrice;
        }

        setValue("items", newItems);
    };

    const calculateTotal = () => {
        const subtotal = watchedItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        const tax = parseFloat(watchedTaxAmount) || 0;
        return subtotal + tax;
    };

    const onSubmit = (data) => {
        if (isSubmitting || !startSubmit()) return;

        const submissionData = {
            ...data,
            totalAmount: calculateTotal(),
            items: data.items.filter(item => item.description && item.unitPrice),
        };

        // TODO: Implement API call
        console.log("Receipt data:", submissionData);

        // Simulate API call
        setTimeout(() => {
            onSuccess?.();
            if (!isEditMode) reset();
            endSubmit();
            toast.success(isEditMode ? "Receipt updated successfully!" : "Receipt created successfully!");
        }, 1000);
    };

    return (
        <div className="space-y-4 p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Client Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                Client Information
                            </CardTitle>
                            <CardDescription>
                                Enter client details for the receipt
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                label="Client Name"
                                placeholder="Enter client name"
                                value={watch("clientName")}
                                onChange={(e) => setValue("clientName", e.target.value)}
                            />

                            <FormField
                                label="Client Email"
                                type="email"
                                placeholder="client@example.com"
                                value={watch("clientEmail")}
                                onChange={(e) => setValue("clientEmail", e.target.value)}
                            />

                            <FormField
                                label="Phone Number"
                                placeholder="+1 (555) 123-4567"
                                value={watch("clientPhone")}
                                onChange={(e) => setValue("clientPhone", e.target.value)}
                            />

                            <FormField
                                label="Address"
                                placeholder="123 Main St, City, State 12345"
                                value={watch("clientAddress")}
                                onChange={(e) => setValue("clientAddress", e.target.value)}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    label="Receipt Date"
                                    type="date"
                                    value={watch("receiptDate")}
                                    onChange={(e) => setValue("receiptDate", e.target.value)}
                                />

                                <div className="flex space-x-2">
                                    <FormField
                                        label="Reference Number"
                                        placeholder="Auto-generated"
                                        value={watch("referenceNumber")}
                                        onChange={(e) => setValue("referenceNumber", e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={generateReferenceNumber}
                                        className="mt-6"
                                    >
                                        Generate
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CreditCard className="mr-2 h-5 w-5" />
                                Payment Information
                            </CardTitle>
                            <CardDescription>
                                Select payment method and status
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SelectField
                                label="Payment Method"
                                options={paymentMethods.map((method) => ({
                                    value: method.id,
                                    label: method.title,
                                    description: method.description,
                                }))}
                                value={selectedPaymentMethod}
                                onChange={(value) => setValue("paymentMethod", value)}
                            />

                            <SelectField
                                label="Payment Status"
                                options={[
                                    { value: "paid", label: "Paid" },
                                    { value: "pending", label: "Pending" },
                                    { value: "failed", label: "Failed" },
                                ]}
                                value={watch("status")}
                                onChange={(value) => setValue("status", value)}
                            />

                            {selectedPaymentMethod && (
                                <div className="p-4 border rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">
                                            {paymentMethods.find(m => m.id === selectedPaymentMethod)?.icon}
                                        </span>
                                        <div>
                                            <p className="font-medium">
                                                {paymentMethods.find(m => m.id === selectedPaymentMethod)?.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {paymentMethods.find(m => m.id === selectedPaymentMethod)?.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Controller
                                name="sendEmail"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-row items-start space-x-3 space-y-0">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="space-y-1 leading-none">
                                            <label className="text-sm font-medium">
                                                Send receipt to client email
                                            </label>
                                            <p className="text-sm text-muted-foreground">
                                                Automatically email this receipt to the client
                                            </p>
                                        </div>
                                    </div>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Receipt Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileText className="mr-2 h-5 w-5" />
                                Receipt Items
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Item
                            </Button>
                        </CardTitle>
                        <CardDescription>
                            Add items and services for this receipt
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {watchedItems.map((item, index) => (
                                <div key={item.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Item description"
                                            value={item.description}
                                            onChange={(e) => updateItem(index, "description", e.target.value)}
                                        />
                                    </div>
                                    <div className="w-20">
                                        <Input
                                            type="number"
                                            placeholder="Qty"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                            min="1"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <Input
                                            type="number"
                                            placeholder="Price"
                                            value={item.unitPrice}
                                            onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    <div className="w-24 text-right font-medium">
                                        ${item.total.toFixed(2)}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeItem(index)}
                                        disabled={watchedItems.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            {/* Tax and Total */}
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">
                                        ${watchedItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium">Tax:</label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={watch("taxAmount")}
                                        onChange={(e) => setValue("taxAmount", e.target.value)}
                                        className="w-32 text-right"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Receipt Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileText className="mr-2 h-5 w-5" />
                            Additional Information
                        </CardTitle>
                        <CardDescription>
                            Add description and notes for the receipt
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TextareaField
                            label="Description"
                            placeholder="Describe what this payment is for..."
                            value={watch("description")}
                            onChange={(e) => setValue("description", e.target.value)}
                            rows={3}
                        />

                        <TextareaField
                            label="Additional Notes"
                            placeholder="Any additional information or terms..."
                            value={watch("notes")}
                            onChange={(e) => setValue("notes", e.target.value)}
                            rows={3}
                        />
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(`/${role}/receipts`)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {isSubmitting
                            ? "Saving..."
                            : isEditMode
                                ? "Update Receipt"
                                : "Create Receipt"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
