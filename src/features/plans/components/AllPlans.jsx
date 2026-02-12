import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Users } from "lucide-react";
import { usePlans } from "../hooks/usePlans";
import { useAuthContext } from "@/hooks/AuthContext";
import { useCreateSubscription } from "../hooks/useSubscriptions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import SubscriptionForm from "./SubscriptionForm";

export default function AllPlans({ packId, onViewChange }) {
  const { role } = useAuthContext();
  const [interval, setInterval] = useState("monthly");
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
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

  const handleSubscribe = (plan) => {
    if (!packId) {
      toast.error("Pack ID is missing");
      return;
    }

    const priceObj = plan.prices?.find((p) => p.interval === interval);
    if (!priceObj) {
      toast.error(`Price not available for ${interval} interval`);
      return;
    }

    setSelectedPlan(plan);
    setSelectedPrice(priceObj);
    setShowSubscriptionForm(true);
  };

  const handleFormSubmit = async (formData) => {
    console.log("Form data received:", formData);

    if (!selectedPlan || !selectedPrice || !packId) {
      toast.error("Missing required information");
      return;
    }

    const subscriptionData = {
      client_id: user?.id,
      plan_id: selectedPlan.id,
      plan_price_id: selectedPrice.id,
      status: "active",
      custom_field_values: formData.custom_field_values,
    };

    console.log("Sending subscription data:", subscriptionData);

    setLoadingPlanId(selectedPlan.id);

    try {
      await createSubscription.mutateAsync(subscriptionData);

      setShowSubscriptionForm(false);
      setSelectedPlan(null);
      setSelectedPrice(null);
      toast.success("Subscription created successfully!");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error.message || "Failed to create subscription");
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleCloseForm = () => {
    setShowSubscriptionForm(false);
    setSelectedPlan(null);
    setSelectedPrice(null);
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

  const planHasInterval = (plan, intervalType) => {
    return plan.prices?.some((p) => p.interval === intervalType);
  };

  // Group features by category
  const groupedFeatures = useMemo(() => {
    if (!plans.length) return {};

    const categories = {};
    plans.forEach((plan) => {
      plan.features_list?.forEach((feature) => {
        if (feature.name && feature.name.trim()) {
          if (!categories[feature.category]) {
            categories[feature.category] = [];
          }
          if (
            !categories[feature.category].find((f) => f.name === feature.name)
          ) {
            categories[feature.category].push(feature);
          }
        }
      });
    });

    return categories;
  }, [plans]);

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
    <div className="space-y-6 p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Choose Your Plan
          </h1>
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
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1 gap-1">
            {availableIntervals.map((int) => (
              <Button
                key={int}
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium transition-all",
                  interval === int && "bg-foreground text-background shadow-sm",
                )}
                onClick={() => setInterval(int)}
              >
                {int.charAt(0).toUpperCase() + int.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Plans Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const currentPrice = getPriceForInterval(plan, interval);
          const savings = calculateSavings(plan.prices, interval);
          const hasCurrentInterval = planHasInterval(plan, interval);
          const isLoading = loadingPlanId === plan.id;

          return (
            <div key={plan.id} className="flex flex-col">
              <div className="bg-card border border-border rounded-lg p-6 pb-32 relative">
                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    {plan.icon && <span className="text-lg">{plan.icon}</span>}
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                  </div>
                </div>

                {/* Price */}
                {hasCurrentInterval ? (
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        {formatPrice(currentPrice.price, currentPrice.currency)}
                      </span>
                      <span className="text-muted-foreground">
                        /{interval === "yearly" ? "yr" : "mo"}
                      </span>
                    </div>
                    {interval !== "monthly" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {interval === "quarterly" && "Billed every 3 months"}
                        {interval === "yearly" && "Billed annually"}
                      </p>
                    )}
                    {savings > 0 && (
                      <p className="text-sm text-primary font-medium mt-2">
                        Save {savings}% yearly
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-6 p-3 bg-muted/50 rounded-md border border-border text-sm text-muted-foreground">
                    Not available for {interval} billing
                  </div>
                )}

                {/* CTA Button */}
                {role === "client" && (
                  <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-6 rounded-b-lg">
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => handleSubscribe(plan)}
                      disabled={isLoading || !hasCurrentInterval}
                      variant={hasCurrentInterval ? "default" : "outline"}
                    >
                      {isLoading ? "Subscribing..." : "Get started"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Comparison Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground bg-muted/30 w-1/3">
                  Features
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    className="px-6 py-4 text-center text-sm font-semibold text-foreground bg-muted/30"
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedFeatures).map(([category, features]) => (
                <tbody key={category}>
                  {/* Category Header */}
                  <tr className="border-b border-border">
                    <td
                      colSpan={plans.length + 1}
                      className="px-6 py-4 bg-muted/20 font-semibold text-sm"
                    >
                      {category}
                    </td>
                  </tr>

                  {/* Features */}
                  {features.map((feature, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {feature.name}
                      </td>
                      {plans.map((plan) => {
                        const planFeature = plan.features_list?.find(
                          (f) => f.name === feature.name,
                        );
                        const hasFeature = !!planFeature;

                        return (
                          <td
                            key={plan.id}
                            className="px-6 py-4 text-center text-sm"
                          >
                            {hasFeature ? (
                              <div className="flex items-center justify-center">
                                {planFeature.value ? (
                                  <span className="font-medium text-foreground">
                                    {planFeature.value}
                                  </span>
                                ) : (
                                  <Check className="h-5 w-5 text-primary" />
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Form Modal */}
      <SubscriptionForm
        isOpen={showSubscriptionForm}
        onClose={handleCloseForm}
        plan={selectedPlan}
        priceInfo={selectedPrice}
        onSubmit={handleFormSubmit}
        isLoading={loadingPlanId !== null}
      />
    </div>
  );
}
