// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Check, Edit, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import AlertDialogDestructive from "@/components/alert-dialog-destructive-1";
// import { useDeletePlan, useUpdatePlan } from "@/features/plans/hooks/usePlans";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { toast } from "sonner";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { X } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// export default function Plan({ plan, interval = "monthly" }) {
//   const navigate = useNavigate();
//   const { role } = useAuthContext();
//   const deletePlan = useDeletePlan();

//   if (!plan) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
//         <div className="rounded-full bg-muted p-4 mb-4">
//           <X className="h-12 w-12 text-muted-foreground" />
//         </div>
//         <h2 className="text-2xl font-bold mb-3">No plans available</h2>
//         <p className="text-muted-foreground max-w-md">
//           We couldn't find any active pricing plans at the moment.
//         </p>
//       </div>
//     );
//   }

//   const handleEdit = () => {
//     navigate(
//       `/${role}/settings/plans_management/${plan.pack_id}/plans/${plan.id}/edit`,
//     );
//   };

//   const handleDelete = () => {
//     deletePlan.mutate(plan.id, {
//       onSuccess: () => toast.success("Plan deleted successfully"),
//     });
//   };

//   const formatPrice = (price, currency) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: currency || "USD",
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(parseFloat(price || 0));
//   };

//   const getPriceForInterval = () => {
//     return (
//       plan?.prices?.find((p) => p.interval === interval) ||
//       plan?.prices?.[0] || { price: 0, currency: "USD", interval }
//     );
//   };

//   const currentPrice = getPriceForInterval();
//   const isYearly = interval === "yearly";

//   const renderFeature = (field) => {
//     const value = field.default_value;

//     if (field.type === "boolean") {
//       const isEnabled = value === "true" || value === true;
//       return (
//         <div className="flex items-center gap-3 py-1.5">
//           {isEnabled ? (
//             <Check className="h-5 w-5 text-green-400 shrink-0" />
//           ) : (
//             <X className="h-5 w-5 text-red-500 shrink-0" />
//           )}
//           <span
//             className={isEnabled ? "" : "text-muted-foreground line-through"}
//           >
//             {field.label}
//           </span>
//         </div>
//       );
//     }

//     if (field.type === "number") {
//       return (
//         <div className="flex items-center gap-3 py-1.5">
//           <Check className="h-5 w-5 text-green-400 shrink-0" />
//           <span>
//             {field.label}: <strong>{value}</strong>
//           </span>
//         </div>
//       );
//     }

//     if (field.type === "text") {
//       return (
//         <div className="flex items-start gap-3 py-1.5">
//           <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
//           <span>{value}</span>
//         </div>
//       );
//     }

//     if (field.type === "json") {
//       try {
//         const parsed = JSON.parse(value);
//         return Object.entries(parsed).map(([key, val]) => {
//           const label = key
//             .replace(/_/g, " ")
//             .split(" ")
//             .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//             .join(" ");

//           const displayValue =
//             typeof val === "boolean" ? (val ? "Enabled" : "Disabled") : val;

//           return (
//             <div key={key} className="flex items-center gap-3 py-1.5">
//               <Check className="h-5 w-5 text-green-400 shrink-0" />
//               <span>
//                 {label}: <strong>{displayValue}</strong>
//               </span>
//             </div>
//           );
//         });
//       } catch (e) {
//         return (
//           <div className="text-muted-foreground italic py-1.5">
//             Advanced configuration available
//           </div>
//         );
//       }
//     }

//     return null;
//   };

//   return (
//     <div className="py-4 px-4 sm:px-4 lg:px-8 max-w-7xl mx-auto">
//       <Card
//         className={`relative overflow-hidden transition-all duration-300 hover:border ${
//           isYearly ? "border-primary/40" : "border-border"
//         }`}
//       >
//         <CardHeader className="pb-4">
//           <div className="flex justify-between items-start">
//             <div>
//               <CardTitle className="text-2xl">{plan.name}</CardTitle>
//               <Badge variant="outline" className="mt-2">
//                 {plan.pack?.name || "Plan"}
//               </Badge>
//             </div>
//           </div>
//           <CardDescription className="pt-3 text-base">
//             {plan.description}
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="pb-16">
//           <div className="mb-8">
//             <div className="flex items-baseline gap-1">
//               <span className="text-5xl font-bold tracking-tight">
//                 {formatPrice(currentPrice.price, currentPrice.currency).replace(
//                   /\.00/,
//                   "",
//                 )}
//               </span>
//               <span className="text-xl text-muted-foreground">/mo</span>
//             </div>
//             {isYearly && currentPrice.interval === "yearly" && (
//               <p className="text-sm text-green-400 mt-1">
//                 Billed annually • Save significantly
//               </p>
//             )}
//             {interval === "quarterly" && (
//               <p className="text-sm text-muted-foreground mt-1">
//                 Billed every 3 months
//               </p>
//             )}
//           </div>

//           <Separator className="my-4" />

//           <div className="space-y-2">
//             {plan.custom_fields
//               ?.filter(
//                 (f) => f.default_value !== null && f.default_value !== "",
//               )
//               .map((field) => (
//                 <div key={field.id}>{renderFeature(field)}</div>
//               ))}
//           </div>
//         </CardContent>

//         <CardFooter className="pt-2 pb-4 px-4 absolute bottom-0 w-full flex gap-3">
//           <Button variant="outline" className="flex-1" onClick={handleEdit}>
//             <Edit className="mr-2 h-4 w-4" />
//             Edit Plan
//           </Button>

//           <AlertDialogDestructive
//             onDelete={handleDelete}
//             trigger={
//               <Button
//                 variant="destructive"
//                 className="flex-1"
//                 disabled={deletePlan.isPending}
//               >
//                 <Trash2 className="mr-2 h-4 w-4" />
//                 {deletePlan.isPending ? "Deleting..." : "Delete"}
//               </Button>
//             }
//           />
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AlertDialogDestructive from "@/components/alert-dialog-destructive-1";
import { useDeletePlan } from "@/features/plans/hooks/usePlans";
import { useAuthContext } from "@/hooks/AuthContext";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Plan({ plan, interval = "monthly" }) {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const deletePlan = useDeletePlan();

  if (!plan) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4 text-center ">
        <div className="rounded-full bg-muted p-5">
          <X className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">
            No plan available
          </h2>
          <p className="text-muted-foreground max-w-sm">
            This plan could not be loaded or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(
      `/${role}/settings/plans_management/${plan.pack_id}/plans/${plan.id}/edit`,
    );
  };

  const handleDelete = () => {
    deletePlan.mutate(plan.id, {
      onSuccess: () => toast.success("Plan deleted successfully"),
    });
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(parseFloat(price || 0));
  };

  const getPriceForInterval = () => {
    return (
      plan?.prices?.find((p) => p.interval === interval) ||
      plan?.prices?.[0] || { price: 0, currency: "USD", interval }
    );
  };

  const currentPrice = getPriceForInterval();
  const isYearly = interval === "yearly";

  const renderFeature = (field) => {
    const value = field.default_value;

    if (field.type === "boolean") {
      const isEnabled = value === "true" || value === true;
      return (
        <div className="flex items-center gap-3 py-1.5">
          {isEnabled ? (
            <Check className="h-5 w-5 text-primary shrink-0" />
          ) : (
            <X className="h-5 w-5 text-muted-foreground shrink-0" />
          )}
          <span
            className={cn(
              "text-sm",
              !isEnabled && "text-muted-foreground line-through",
            )}
          >
            {field.label}
          </span>
        </div>
      );
    }

    if (field.type === "number") {
      return (
        <div className="flex items-center gap-3 py-1.5">
          <Check className="h-5 w-5 text-primary shrink-0" />
          <span className="text-sm">
            {field.label}: <strong>{value}</strong>
          </span>
        </div>
      );
    }

    if (field.type === "text") {
      return (
        <div className="flex items-start gap-3 py-1.5">
          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <span className="text-sm">{value}</span>
        </div>
      );
    }

    if (field.type === "json") {
      try {
        const parsed = JSON.parse(value);
        return Object.entries(parsed).map(([key, val]) => {
          const label = key
            .replace(/_/g, " ")
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

          const displayValue =
            typeof val === "boolean" ? (val ? "Enabled" : "Disabled") : val;

          return (
            <div key={key} className="flex items-center gap-3 py-1.5">
              <Check className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm">
                {label}: <strong>{displayValue}</strong>
              </span>
            </div>
          );
        });
      } catch (e) {
        return (
          <div className="text-sm text-muted-foreground italic py-1.5">
            Advanced configuration
          </div>
        );
      }
    }

    return null;
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200",
        isYearly && "border-primary/30 bg-background",
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-semibold leading-tight">
              {plan.name}
            </CardTitle>
            <Badge variant="secondary" className="text-xs font-normal">
              {plan.pack?.name || "Plan"}
            </Badge>
          </div>
        </div>

        {plan.description && (
          <CardDescription className="pt-2 text-sm text-muted-foreground">
            {plan.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pb-20 space-y-4">
        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight">
              {formatPrice(currentPrice.price, currentPrice.currency)}
            </span>
            <span className="text-lg text-muted-foreground font-medium">
              /{isYearly ? "yr" : "mo"}
            </span>
          </div>

          {isYearly && currentPrice.interval === "yearly" && (
            <p className="text-sm text-primary/80 font-medium">
              Billed annually — save significantly
            </p>
          )}

          {interval === "quarterly" && (
            <p className="text-xs text-muted-foreground">
              Billed every 3 months
            </p>
          )}
        </div>

        <Separator />

        <div className="space-y-1.5 min-h-[180px]">
          {plan.custom_fields
            ?.filter((f) => f.default_value !== null && f.default_value !== "")
            .map((field) => (
              <div key={field.id}>{renderFeature(field)}</div>
            ))}

          {(!plan.custom_fields ||
            plan.custom_fields.filter(
              (f) => f.default_value !== null && f.default_value !== "",
            ).length === 0) && (
            <p className="text-sm text-muted-foreground italic py-2">
              No specific features configured
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="absolute bottom-0 left-0 right-0 border-t bg-card/80 backdrop-blur-sm px-4 py-4">
        <div className="flex gap-3 w-full">
          <Button variant="outline" className="flex-1" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <AlertDialogDestructive
            onDelete={handleDelete}
            trigger={
              <Button
                variant="outline"
                className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                disabled={deletePlan.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deletePlan.isPending ? "Deleting..." : "Delete"}
              </Button>
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
}
