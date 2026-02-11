// import { useState, useMemo } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Check, X, Users } from "lucide-react";
// import { usePlans } from "../hooks/usePlans";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { useCreateSubscription } from "../hooks/useSubscriptions";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// export default function AllPlans({ packId, onViewChange }) {
//   const { role } = useAuthContext();
//   const [interval, setInterval] = useState("monthly");
//   const { data: plansData, isLoading: plansLoading } = usePlans(packId);

//   const plans = useMemo(() => plansData?.data || [], [plansData]);

//   const getPriceForInterval = (plan, selectedInterval) => {
//     const priceObj = plan.prices?.find((p) => p.interval === selectedInterval);
//     if (!priceObj)
//       return { price: "—", currency: "USD", interval: selectedInterval };
//     return {
//       price: priceObj.price,
//       currency: priceObj.currency,
//       interval: priceObj.interval,
//     };
//   };

//   const { user } = useAuthContext();
//   const createSubscription = useCreateSubscription();

//   const handleSubscribe = (plan) => {
//     if (!packId) {
//       toast.error("Pack ID is missing");
//       return;
//     }

//     const priceObj = plan.prices?.find((p) => p.interval === interval);
//     if (!priceObj) {
//       toast.error("Price not available for selected interval");
//       return;
//     }

//     createSubscription.mutate({
//       client_id: user?.id,
//       plan_id: plan.id,
//       plan_price_id: priceObj.id,
//       status: "active",
//       custom_field_values: {},
//     });
//   };

//   const formatPrice = (price, currency) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: currency || "USD",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
//     }).format(parseFloat(price || 0));
//   };

//   const calculateSavings = (prices, targetInterval) => {
//     if (targetInterval === "monthly") return null;

//     const monthly = prices?.find((p) => p.interval === "monthly");
//     const target = prices?.find((p) => p.interval === targetInterval);

//     if (!monthly || !target) return null;

//     const monthlyPrice = parseFloat(monthly.price);
//     const monthsMap = { quarterly: 3, yearly: 12 };
//     const monthlyTotal = monthlyPrice * monthsMap[targetInterval];
//     const targetPrice = parseFloat(target.price);

//     const savings = ((monthlyTotal - targetPrice) / monthlyTotal) * 100;
//     return Math.round(savings);
//   };

//   const availableIntervals = useMemo(() => {
//     if (!plans?.length) return [];
//     const intervals = new Set();
//     plans.forEach((plan) =>
//       plan.prices?.forEach((price) => intervals.add(price.interval)),
//     );
//     return Array.from(intervals).sort((a, b) => {
//       const order = ["monthly", "quarterly", "yearly"];
//       return order.indexOf(a) - order.indexOf(b);
//     });
//   }, [plans]);

//   const renderFeature = (field) => {
//     const value = field.default_value;

//     if (field.type === "boolean") {
//       const isEnabled = value === "true" || value === true;
//       return (
//         <div className="flex items-center gap-3 py-1.5 text-sm">
//           {isEnabled ? (
//             <Check className="h-5 w-5 text-primary shrink-0" />
//           ) : (
//             <X className="h-5 w-5 text-muted-foreground shrink-0" />
//           )}
//           <span
//             className={cn(!isEnabled && "text-muted-foreground line-through")}
//           >
//             {field.label}
//           </span>
//         </div>
//       );
//     }

//     if (field.type === "number") {
//       return (
//         <div className="flex items-center gap-3 py-1.5 text-sm">
//           <Check className="h-5 w-5 text-primary shrink-0" />
//           <span>
//             {field.label}: <strong>{value}</strong>
//           </span>
//         </div>
//       );
//     }

//     if (field.type === "text") {
//       return (
//         <div className="flex items-start gap-3 py-1.5 text-sm">
//           <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
//             <div key={key} className="flex items-center gap-3 py-1.5 text-sm">
//               <Check className="h-5 w-5 text-primary shrink-0" />
//               <span>
//                 {label}: <strong>{displayValue}</strong>
//               </span>
//             </div>
//           );
//         });
//       } catch {
//         return (
//           <div className="text-sm text-muted-foreground italic py-1.5">
//             Advanced configuration
//           </div>
//         );
//       }
//     }

//     return null;
//   };

//   if (plansLoading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <div className="text-center space-y-3">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//           <p className="text-sm text-muted-foreground">Loading plans...</p>
//         </div>
//       </div>
//     );
//   }

//   if (plans.length === 0) {
//     return (
//       <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
//         <div className="rounded-full bg-muted/60 p-6">
//           <X className="h-12 w-12 text-muted-foreground" />
//         </div>
//         <div className="space-y-3 max-w-md">
//           <h2 className="text-2xl font-semibold tracking-tight">
//             No plans available
//           </h2>
//           <p className="text-muted-foreground">
//             There are currently no pricing plans in this pack. Please check back
//             later.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 p-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div className="space-y-1.5">
//           <h1 className="text-2xl font-bold tracking-tight">
//             Choose Your Plan
//           </h1>
//           <p className="text-muted-foreground">
//             Simple, transparent pricing. Upgrade or downgrade anytime.
//           </p>
//         </div>

//         {role === "client" && onViewChange && (
//           <Button
//             variant="outline"
//             onClick={() => onViewChange("clientSubscriptions")}
//           >
//             <Users className="mr-2 h-4 w-4" />
//             My Subscriptions
//           </Button>
//         )}
//       </div>

//       {/* Billing Toggle */}
//       {availableIntervals.length > 1 && (
//         <div className="flex justify-center">
//           <div className="inline-flex rounded-full border bg-muted/40 p-1">
//             {availableIntervals.map((int) => (
//               <Button
//                 key={int}
//                 variant="ghost"
//                 size="sm"
//                 className={cn(
//                   "rounded-full px-5 text-sm font-medium transition-all",
//                   interval === int &&
//                     "bg-background shadow-sm text-foreground border",
//                 )}
//                 onClick={() => setInterval(int)}
//               >
//                 {int.charAt(0).toUpperCase() + int.slice(1)}
//               </Button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Plans Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {plans.map((plan) => {
//           const currentPrice = getPriceForInterval(plan, interval);
//           const isYearly = interval === "yearly";
//           const savings = calculateSavings(plan.prices, interval);

//           return (
//             <Card
//               key={plan.id}
//               className={cn(
//                 "group relative overflow-hidden transition-all duration-200",
//                 "hover:shadow-lg hover:border-accent/60",
//                 isYearly &&
//                   "border-primary/30 bg-linear-to-b from-background to-background/80",
//               )}
//             >
//               <CardHeader className="pb-4">
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="space-y-2">
//                     <CardTitle className="text-xl font-semibold leading-tight">
//                       {plan.name}
//                     </CardTitle>
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <Badge
//                         variant="secondary"
//                         className="text-xs font-normal"
//                       >
//                         {plan.pack?.name || "Plan"}
//                       </Badge>
//                       {savings > 0 && (
//                         <Badge
//                           variant="outline"
//                           className="text-xs border-primary/40 text-primary"
//                         >
//                           Save {savings}%
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {plan.description && (
//                   <CardDescription className="pt-3 text-sm leading-relaxed">
//                     {plan.description}
//                   </CardDescription>
//                 )}
//               </CardHeader>

//               <CardContent className="pb-4 space-y-4">
//                 {/* Price */}
//                 <div className="space-y-1.5">
//                   <div className="flex items-baseline gap-1.5">
//                     <span className="text-3xl font-bold tracking-tight">
//                       {formatPrice(currentPrice.price, currentPrice.currency)}
//                     </span>
//                     <span className="text-lg text-muted-foreground font-medium">
//                       /{interval === "yearly" ? "yr" : "mo"}
//                     </span>
//                   </div>

//                   {isYearly && currentPrice.interval === "yearly" && (
//                     <p className="text-sm text-primary/80 font-medium">
//                       Billed annually — save significantly
//                     </p>
//                   )}

//                   {interval === "quarterly" && (
//                     <p className="text-xs text-muted-foreground">
//                       Billed every 3 months
//                     </p>
//                   )}
//                 </div>

//                 <Separator />

//                 {/* Features */}
//                 <div className="space-y-1 min-h-40">
//                   {plan.custom_fields
//                     ?.filter(
//                       (f) => f.default_value != null && f.default_value !== "",
//                     )
//                     .map((field) => (
//                       <div key={field.id}>{renderFeature(field)}</div>
//                     ))}

//                   {(!plan.custom_fields?.length ||
//                     !plan.custom_fields.some(
//                       (f) => f.default_value != null && f.default_value !== "",
//                     )) && (
//                     <p className="text-sm text-muted-foreground italic py-2">
//                       No specific features listed
//                     </p>
//                   )}
//                 </div>
//               </CardContent>

//               {role === "client" && (
//                 <CardFooter className="absolute bottom-0 inset-x-0 border-t bg-card/90 backdrop-blur-sm px-6 py-4">
//                   <Button
//                     size="lg"
//                     className="w-full"
//                     onClick={() => handleSubscribe(plan)}
//                     disabled={
//                       !currentPrice.price ||
//                       currentPrice.price === "—" ||
//                       createSubscription.isPending
//                     }
//                   >
//                     {createSubscription.isPending
//                       ? "Subscribing..."
//                       : "Subscribe"}
//                   </Button>
//                 </CardFooter>
//               )}
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, Users } from "lucide-react";
import { usePlans } from "../hooks/usePlans";
import { useAuthContext } from "@/hooks/AuthContext";
import { useCreateSubscription } from "../hooks/useSubscriptions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AllPlans({ packId, onViewChange }) {
  const { role } = useAuthContext();
  const [interval, setInterval] = useState("monthly");
  const [loadingPlanId, setLoadingPlanId] = useState(null); // Track which plan is loading
  const { data: plansData, isLoading: plansLoading } = usePlans(packId);

  const plans = useMemo(() => plansData?.data || [], [plansData]);

  const getPriceForInterval = (plan, selectedInterval) => {
    const priceObj = plan.prices?.find((p) => p.interval === selectedInterval);
    if (!priceObj)
      return { price: "—", currency: "USD", interval: selectedInterval };
    return {
      price: priceObj.price,
      currency: priceObj.currency,
      interval: priceObj.interval,
    };
  };

  const { user } = useAuthContext();
  const createSubscription = useCreateSubscription();

  const handleSubscribe = async (plan) => {
    if (!packId) {
      toast.error("Pack ID is missing");
      return;
    }

    const priceObj = plan.prices?.find((p) => p.interval === interval);
    if (!priceObj) {
      toast.error(`Price not available for ${interval} interval`);
      return;
    }

    setLoadingPlanId(plan.id);

    try {
      await createSubscription.mutateAsync({
        client_id: user?.id,
        plan_id: plan.id,
        plan_price_id: priceObj.id,
        status: "active",
        custom_field_values: {},
      });
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoadingPlanId(null);
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

  const calculateSavings = (prices, targetInterval) => {
    if (targetInterval === "monthly") return null;

    const monthly = prices?.find((p) => p.interval === "monthly");
    const target = prices?.find((p) => p.interval === targetInterval);

    if (!monthly || !target) return null;

    const monthlyPrice = parseFloat(monthly.price);
    const monthsMap = { quarterly: 3, yearly: 12 };
    const monthlyTotal = monthlyPrice * monthsMap[targetInterval];
    const targetPrice = parseFloat(target.price);

    const savings = ((monthlyTotal - targetPrice) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  // Only show intervals that all plans have OR that the user can select to see available prices
  const availableIntervals = useMemo(() => {
    if (!plans?.length) return [];
    const intervals = new Set();
    plans.forEach((plan) =>
      plan.prices?.forEach((price) => intervals.add(price.interval)),
    );
    return Array.from(intervals).sort((a, b) => {
      const order = ["monthly", "quarterly", "yearly"];
      return order.indexOf(a) - order.indexOf(b);
    });
  }, [plans]);

  // Check if a plan has a specific interval
  const planHasInterval = (plan, intervalType) => {
    return plan.prices?.some((p) => p.interval === intervalType);
  };

  const renderFeature = (field) => {
    const value = field.default_value;

    if (field.type === "boolean") {
      const isEnabled = value === "true" || value === true;
      return (
        <div className="flex items-center gap-3 py-1.5 text-sm">
          {isEnabled ? (
            <Check className="h-5 w-5 text-primary shrink-0" />
          ) : (
            <X className="h-5 w-5 text-muted-foreground shrink-0" />
          )}
          <span
            className={cn(!isEnabled && "text-muted-foreground line-through")}
          >
            {field.label}
          </span>
        </div>
      );
    }

    if (field.type === "number") {
      return (
        <div className="flex items-center gap-3 py-1.5 text-sm">
          <Check className="h-5 w-5 text-primary shrink-0" />
          <span>
            {field.label}: <strong>{value}</strong>
          </span>
        </div>
      );
    }

    if (field.type === "text") {
      return (
        <div className="flex items-start gap-3 py-1.5 text-sm">
          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <span>{value}</span>
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
            <div key={key} className="flex items-center gap-3 py-1.5 text-sm">
              <Check className="h-5 w-5 text-primary shrink-0" />
              <span>
                {label}: <strong>{displayValue}</strong>
              </span>
            </div>
          );
        });
      } catch {
        return (
          <div className="text-sm text-muted-foreground italic py-1.5">
            Advanced configuration
          </div>
        );
      }
    }

    return null;
  };

  if (plansLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="rounded-full bg-muted/60 p-6">
          <X className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-3 max-w-md">
          <h2 className="text-2xl font-semibold tracking-tight">
            No plans available
          </h2>
          <p className="text-muted-foreground">
            There are currently no pricing plans in this pack. Please check back
            later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground">
            Simple, transparent pricing. Upgrade or downgrade anytime.
          </p>
        </div>

        {role === "client" && onViewChange && (
          <Button
            variant="outline"
            onClick={() => onViewChange("clientSubscriptions")}
          >
            <Users className="mr-2 h-4 w-4" />
            My Subscriptions
          </Button>
        )}
      </div>

      {/* Billing Toggle */}
      {availableIntervals.length > 1 && (
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border bg-muted/40 p-1">
            {availableIntervals.map((int) => (
              <Button
                key={int}
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-full px-5 text-sm font-medium transition-all",
                  interval === int &&
                    "bg-background shadow-sm text-foreground border",
                )}
                onClick={() => setInterval(int)}
              >
                {int.charAt(0).toUpperCase() + int.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const currentPrice = getPriceForInterval(plan, interval);
          const isYearly = interval === "yearly";
          const savings = calculateSavings(plan.prices, interval);
          const hasCurrentInterval = planHasInterval(plan, interval);
          const isLoading = loadingPlanId === plan.id;

          return (
            <Card
              key={plan.id}
              className={cn(
                "group relative overflow-hidden transition-all duration-200",
                "hover:shadow-lg hover:border-accent/60",
                isYearly &&
                  "border-primary/30 bg-linear-to-b from-background to-background/80",
              )}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-semibold leading-tight">
                      {plan.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {plan.pack?.name || "Plan"}
                      </Badge>
                      {savings > 0 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-primary/40 text-primary"
                        >
                          Save {savings}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {plan.description && (
                  <CardDescription className="pt-3 text-sm leading-relaxed">
                    {plan.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="pb-4 space-y-4">
                {/* Price */}
                {hasCurrentInterval ? (
                  <div className="space-y-1.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold tracking-tight">
                        {formatPrice(currentPrice.price, currentPrice.currency)}
                      </span>
                      <span className="text-lg text-muted-foreground font-medium">
                        /{interval === "yearly" ? "yr" : "mo"}
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
                ) : (
                  <div className="space-y-1.5 p-3 bg-muted/50 rounded-md border border-dashed">
                    <p className="text-sm text-muted-foreground">
                      Not available for {interval} billing
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Available:{" "}
                      {plan.prices
                        ?.map(
                          (p) =>
                            p.interval.charAt(0).toUpperCase() +
                            p.interval.slice(1),
                        )
                        .join(", ")}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Features */}
                <div className="space-y-1 min-h-40">
                  {plan.custom_fields
                    ?.filter(
                      (f) => f.default_value != null && f.default_value !== "",
                    )
                    .map((field) => (
                      <div key={field.id}>{renderFeature(field)}</div>
                    ))}

                  {(!plan.custom_fields?.length ||
                    !plan.custom_fields.some(
                      (f) => f.default_value != null && f.default_value !== "",
                    )) && (
                    <p className="text-sm text-muted-foreground italic py-2">
                      No specific features listed
                    </p>
                  )}
                </div>
              </CardContent>

              {role === "client" && hasCurrentInterval && (
                <CardFooter className="absolute bottom-0 inset-x-0 border-t bg-card/90 backdrop-blur-sm px-6 py-4">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => handleSubscribe(plan)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Subscribing..." : "Subscribe"}
                  </Button>
                </CardFooter>
              )}

              {role === "client" && !hasCurrentInterval && (
                <CardFooter className="absolute bottom-0 inset-x-0 border-t bg-card/90 backdrop-blur-sm px-6 py-4">
                  <Button
                    size="lg"
                    className="w-full"
                    disabled
                    variant="outline"
                  >
                    Unavailable
                  </Button>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
