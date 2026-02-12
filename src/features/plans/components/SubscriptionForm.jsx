// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// export default function SubscriptionForm({
//   isOpen,
//   onClose,
//   plan,
//   priceInfo,
//   onSubmit,
//   isLoading,
// }) {
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});

//   console.log("plan", plan);

//   React.useEffect(() => {
//     if (plan?.custom_fields) {
//       const initialData = {};
//       plan.custom_fields.forEach((field) => {
//         initialData[field.key] = field.default_value || "";
//       });
//       setFormData(initialData);
//     }
//   }, [plan]);

//   const handleInputChange = (key, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [key]: value,
//     }));

//     if (errors[key]) {
//       setErrors((prev) => ({
//         ...prev,
//         [key]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!plan?.custom_fields) return true;

//     plan.custom_fields.forEach((field) => {
//       const value = formData[field.key];

//       // Check if field is required and empty
//       if (field.required && (!value || value.toString().trim() === "")) {
//         newErrors[field.key] = `${field.label} is required`;
//       }

//       // Type-specific validation
//       if (value && value.toString().trim() !== "") {
//         if (field.type === "number" && isNaN(Number(value))) {
//           newErrors[field.key] = `${field.label} must be a valid number`;
//         }

//         if (
//           field.type === "email" &&
//           !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
//         ) {
//           newErrors[field.key] = `${field.label} must be a valid email address`;
//         }
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error("Please fill in all required fields correctly");
//       return;
//     }

//     // Prepare custom field values in the expected format
//     const customFieldValues = {};

//     if (plan?.custom_fields) {
//       plan.custom_fields.forEach((field) => {
//         const fieldValue = formData[field.key];
//         if (fieldValue !== undefined && fieldValue !== "") {
//           customFieldValues[field.key] = fieldValue;
//         }
//       });

//       // Add the key property that backend expects
//       if (plan.custom_fields.length > 0) {
//         customFieldValues.key = plan.custom_fields[0].key;
//       }
//     }

//     onSubmit({
//       custom_field_values: customFieldValues,
//     });
//   };

//   const renderField = (field) => {
//     const value = formData[field.key] || "";
//     const error = errors[field.key];

//     switch (field.type) {
//       case "text":
//         return (
//           <div key={field.id} className="space-y-2">
//             <Label htmlFor={field.key} className="text-sm font-medium">
//               {field.label}{" "}
//               {field.required && <span className="text-destructive">*</span>}
//             </Label>
//             <Input
//               id={field.key}
//               value={value}
//               onChange={(e) => handleInputChange(field.key, e.target.value)}
//               placeholder={`Enter ${field.label.toLowerCase()}`}
//               className={error ? "border-destructive" : ""}
//             />
//             {error && <p className="text-xs text-destructive">{error}</p>}
//           </div>
//         );

//       case "number":
//         return (
//           <div key={field.id} className="space-y-2">
//             <Label htmlFor={field.key} className="text-sm font-medium">
//               {field.label}{" "}
//               {field.required && <span className="text-destructive">*</span>}
//             </Label>
//             <Input
//               id={field.key}
//               type="number"
//               value={value}
//               onChange={(e) => handleInputChange(field.key, e.target.value)}
//               placeholder={`Enter ${field.label.toLowerCase()}`}
//               className={error ? "border-destructive" : ""}
//             />
//             {error && <p className="text-xs text-destructive">{error}</p>}
//           </div>
//         );

//       case "email":
//         return (
//           <div key={field.id} className="space-y-2">
//             <Label htmlFor={field.key} className="text-sm font-medium">
//               {field.label}{" "}
//               {field.required && <span className="text-destructive">*</span>}
//             </Label>
//             <Input
//               id={field.key}
//               type="email"
//               value={value}
//               onChange={(e) => handleInputChange(field.key, e.target.value)}
//               placeholder={`Enter ${field.label.toLowerCase()}`}
//               className={error ? "border-destructive" : ""}
//             />
//             {error && <p className="text-xs text-destructive">{error}</p>}
//           </div>
//         );

//       case "textarea":
//         return (
//           <div key={field.id} className="space-y-2">
//             <Label htmlFor={field.key} className="text-sm font-medium">
//               {field.label}{" "}
//               {field.required && <span className="text-destructive">*</span>}
//             </Label>
//             <Textarea
//               id={field.key}
//               value={value}
//               onChange={(e) => handleInputChange(field.key, e.target.value)}
//               placeholder={`Enter ${field.label.toLowerCase()}`}
//               rows={3}
//               className={error ? "border-destructive" : ""}
//             />
//             {error && <p className="text-xs text-destructive">{error}</p>}
//           </div>
//         );

//       case "boolean":
//         return (
//           <div key={field.id} className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id={field.key}
//                 checked={value === "true" || value === true}
//                 onCheckedChange={(checked) =>
//                   handleInputChange(field.key, checked)
//                 }
//               />
//               <Label htmlFor={field.key} className="text-sm font-medium">
//                 {field.label}{" "}
//                 {field.required && <span className="text-destructive">*</span>}
//               </Label>
//             </div>
//             {error && <p className="text-xs text-destructive">{error}</p>}
//           </div>
//         );

//       case "select":
//         // For select type, you might need to define options somewhere
//         // For now, I'll create a simple text input
//         return (
//           <div key={field.id} className="space-y-2">
//             <Label htmlFor={field.key} className="text-sm font-medium">
//               {field.label}{" "}
//               {field.required && <span className="text-destructive">*</span>}
//             </Label>
//             <Input
//               id={field.key}
//               value={value}
//               onChange={(e) => handleInputChange(field.key, e.target.value)}
//               placeholder={`Enter ${field.label.toLowerCase()}`}
//               className={error ? "border-destructive" : ""}
//             />
//             {error && <p className="text-xs text-destructive">{error}</p>}
//           </div>
//         );

//       default:
//         return (
//           <div key={field.id} className="space-y-2">
//             <Label htmlFor={field.key} className="text-sm font-medium">
//               {field.label}{" "}
//               {field.required && <span className="text-destructive">*</span>}
//             </Label>
//             <Input
//               id={field.key}
//               value={value}
//               onChange={(e) => handleInputChange(field.key, e.target.value)}
//               placeholder={`Enter ${field.label.toLowerCase()}`}
//               className={error ? "border-destructive" : ""}
//             />
//             {error && <p className="text-xs text-destructive">{error}</p>}
//           </div>
//         );
//     }
//   };

//   const formatPrice = (price, currency) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: currency || "USD",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
//     }).format(parseFloat(price || 0));
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Subscribe to {plan?.name}</DialogTitle>
//           <DialogDescription>
//             Please fill in the required information to complete your
//             subscription.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Plan Summary */}
//           <div className="bg-muted/50 rounded-lg p-4 space-y-2">
//             <div className="flex justify-between items-center">
//               <span className="font-medium">{plan?.name}</span>
//               <span className="font-bold text-lg">
//                 {formatPrice(priceInfo?.price, priceInfo?.currency)}/
//                 {priceInfo?.interval === "yearly" ? "yr" : "mo"}
//               </span>
//             </div>
//             {plan?.description && (
//               <p className="text-sm text-muted-foreground">
//                 {plan.description}
//               </p>
//             )}
//           </div>

//           {/* Custom Fields */}
//           {plan?.custom_fields && plan.custom_fields.length > 0 ? (
//             <div className="space-y-4">
//               <h3 className="text-sm font-medium text-foreground">
//                 Additional Information
//               </h3>
//               {plan.custom_fields.map(renderField)}
//             </div>
//           ) : (
//             <div className="text-center py-4">
//               <p className="text-sm text-muted-foreground">
//                 No additional information required
//               </p>
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex gap-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//               className="flex-1"
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" className="flex-1" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 "Complete Subscription"
//               )}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SubscriptionForm({
  isOpen,
  onClose,
  plan,
  priceInfo,
  onSubmit,
  isLoading,
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedPrice, setSelectedPrice] = useState(null);

  // Initialize form data with unique field IDs
  React.useEffect(() => {
    if (plan?.custom_fields) {
      const initialData = {};
      plan.custom_fields.forEach((field) => {
        initialData[field.id] = field.default_value || "";
      });
      setFormData(initialData);
    }
  }, [plan]);

  // Set selected price - use priceInfo prop or default to first price
  React.useEffect(() => {
    if (priceInfo) {
      setSelectedPrice(priceInfo);
    } else if (plan?.prices && plan.prices.length > 0) {
      setSelectedPrice(plan.prices[0]);
    }
  }, [plan, priceInfo]);

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    if (errors[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!plan?.custom_fields) return true;

    plan.custom_fields.forEach((field) => {
      const value = formData[field.id];

      // Check if field is required and empty
      if (field.required && (!value || value.toString().trim() === "")) {
        newErrors[field.id] = `${field.label} is required`;
      }

      // Type-specific validation
      if (value && value.toString().trim() !== "") {
        if (field.type === "number" && isNaN(Number(value))) {
          newErrors[field.id] = `${field.label} must be a valid number`;
        }

        if (
          field.type === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          newErrors[field.id] = `${field.label} must be a valid email address`;
        }

        if (field.type === "json") {
          try {
            JSON.parse(value);
          } catch (e) {
            newErrors[field.id] = `${field.label} must be valid JSON`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    // Build custom field values using field IDs and keys
    const customFieldValues = {};

    if (plan?.custom_fields) {
      plan.custom_fields.forEach((field) => {
        const fieldValue = formData[field.id];
        if (fieldValue !== undefined && fieldValue !== "") {
          customFieldValues[field.key] = fieldValue;
        }
      });
    }

    onSubmit({
      custom_field_values: customFieldValues,
      price_id: selectedPrice?.id,
    });
  };

  const renderField = (field) => {
    const value = formData[field.id] || "";
    const error = errors[field.id];

    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-2">
            <Label
              htmlFor={`field-${field.id}`}
              className="text-sm font-medium"
            >
              {field.label}{" "}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label
              htmlFor={`field-${field.id}`}
              className="text-sm font-medium"
            >
              {field.label}{" "}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              type="number"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case "email":
        return (
          <div key={field.id} className="space-y-2">
            <Label
              htmlFor={`field-${field.id}`}
              className="text-sm font-medium"
            >
              {field.label}{" "}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              type="email"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label
              htmlFor={`field-${field.id}`}
              className="text-sm font-medium"
            >
              {field.label}{" "}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={`field-${field.id}`}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              rows={3}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case "json":
        return (
          <div key={field.id} className="space-y-2">
            <Label
              htmlFor={`field-${field.id}`}
              className="text-sm font-medium"
            >
              {field.label}{" "}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={`field-${field.id}`}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={`Enter valid JSON for ${field.label.toLowerCase()}`}
              rows={4}
              className={`font-mono text-xs ${error ? "border-destructive" : ""}`}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case "boolean":
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`field-${field.id}`}
                checked={value === "true" || value === true}
                onCheckedChange={(checked) =>
                  handleInputChange(field.id, checked)
                }
              />
              <Label
                htmlFor={`field-${field.id}`}
                className="text-sm font-medium"
              >
                {field.label}{" "}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label
              htmlFor={`field-${field.id}`}
              className="text-sm font-medium"
            >
              {field.label}{" "}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label
              htmlFor={`field-${field.id}`}
              className="text-sm font-medium"
            >
              {field.label}{" "}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        );
    }
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(parseFloat(price || 0));
  };

  const getIntervalLabel = (interval) => {
    const labels = {
      monthly: "mo",
      quarterly: "quarter",
      yearly: "yr",
      annual: "yr",
    };
    return labels[interval] || interval;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subscribe to {plan?.name}</DialogTitle>
          <DialogDescription>
            Please fill in the required information to complete your
            subscription.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <p className="font-medium">{plan?.name}</p>
              {plan?.description && (
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              )}
            </div>

            {/* Price Selection */}
            {plan?.prices && plan.prices.length > 0 && (
              <div className="border-t pt-3">
                {plan.prices.length > 1 ? (
                  <div className="space-y-2">
                    <Label htmlFor="price-select" className="text-sm">
                      Billing Interval
                    </Label>
                    <Select
                      value={selectedPrice?.id?.toString()}
                      onValueChange={(priceId) => {
                        const price = plan.prices.find(
                          (p) => p.id === parseInt(priceId),
                        );
                        setSelectedPrice(price);
                      }}
                    >
                      <SelectTrigger id="price-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {plan.prices.map((price) => (
                          <SelectItem
                            key={price.id}
                            value={price.id.toString()}
                          >
                            {formatPrice(price.price, price.currency)} /{" "}
                            {getIntervalLabel(price.interval)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Price</span>
                    <span className="font-bold">
                      {formatPrice(
                        selectedPrice?.price,
                        selectedPrice?.currency,
                      )}{" "}
                      / {getIntervalLabel(selectedPrice?.interval)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Custom Fields */}
          {plan?.custom_fields && plan.custom_fields.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">
                Additional Information
              </h3>
              {plan.custom_fields.map(renderField)}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                No additional information required
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Subscription"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
