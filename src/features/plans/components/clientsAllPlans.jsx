import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Check,
} from "lucide-react";
import { useAuthContext } from "@/hooks/AuthContext";
import { useClientActiveSubscription } from "../hooks/useSubscriptions";
import { useCancelSubscription, useRenewSubscription } from "../hooks/useSubscriptions";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { formatId } from "@/lib/utils/formatId";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ClientsAllPlans({ onViewChange }) {
  const { user, role } = useAuthContext();
  const queryClient = useQueryClient();
  const { data: subscriptionData, isLoading, refetch } = useClientActiveSubscription(
    user?.id,
  );

  console.log(subscriptionData);

  const navigate = useNavigate();

  const cancelSubscription = useCancelSubscription();
  const renewSubscription = useRenewSubscription();

  const handleCardClick = (planId, subscriptionId) => {
    navigate(`/${role}/plans/${planId}/subscription/${subscriptionId}`);
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      await cancelSubscription.mutateAsync({ subscriptionId });
      // Refetch the subscription data to get updated status
      refetch();
    } catch (error) {
      console.error('Cancel subscription failed:', error);
    }
  };

  const handleRenewSubscription = async (subscriptionId) => {
    try {
      await renewSubscription.mutateAsync(subscriptionId);
      // Refetch the subscription data to get updated status
      refetch();
    } catch (error) {
      console.error('Renew subscription failed:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No end date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "default",
      cancelled: "destructive",
      expired: "secondary",
    };

    const icons = {
      active: <CheckCircle className="h-3.5 w-3.5 mr-1.5" />,
      cancelled: <XCircle className="h-3.5 w-3.5 mr-1.5" />,
      expired: <XCircle className="h-3.5 w-3.5 mr-1.5" />,
    };

    return (
      <Badge
        variant={variants[status] || "outline"}
        className={cn(
          "flex items-center gap-1 px-3 py-1 text-xs font-medium uppercase tracking-wide",
          status === "active" && "bg-green-50 text-green-800 border-green-200",
          status === "cancelled" &&
          "bg-destructive/10 text-destructive border-destructive/30",
        )}
      >
        {icons[status]}
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
      </Badge>
    );
  };

  const renderFeature = (feature) => {
    return (
      <div className="flex items-center gap-3 py-1.5 text-sm">
        <Check className="h-4 w-4 text-primary shrink-0" />
        <span>{feature.name}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">
            Loading your subscriptions...
          </p>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4  text-center">
        <div className="rounded-full bg-muted/60 p-4">
          <CreditCard className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-3 max-w-md">
          <h2 className="text-2xl font-semibold tracking-tight">
            No active subscriptions
          </h2>
          <p className="text-muted-foreground">
            You don't have any active plans right now. Explore available plans
            to get started.
          </p>
        </div>

        {onViewChange && (
          <Button size="lg" onClick={() => onViewChange("cards")}>
            <CreditCard className="mr-2 h-5 w-5" />
            View Available Plans
          </Button>
        )}
      </div>
    );
  }

  const subscription = subscriptionData;

  return (
    <div className="space-y-4 px-4 mb-4 min-h-screen ">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            My Subscriptions
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your active plans and billing details
          </p>
        </div>

        {onViewChange && (
          <Button variant="outline" onClick={() => onViewChange("cards")}>
            <CreditCard className="mr-2 h-4 w-4" />
            Browse Plans
          </Button>
        )}
      </div>

      <Card
        className={cn(
          "group relative overflow-hidden transition-all cursor-pointer max-w-lg",
          "border bg-card",
        )}
        onClick={() => handleCardClick(subscription?.plan_id, subscription?.id)}
      >
        <CardHeader className="pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                {formatId(subscription?.id, "SUB")}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Plan • {formatId(subscription?.plan_id, "PLAN")}
              </p>
            </div>

            {getStatusBadge(subscription?.status)}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-4">
          {/* Main Info - Label Left, Value Right */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Plan ID
              </p>
              <p className="text-base font-medium">
                {formatId(subscription?.plan_id, "PLAN")}
              </p>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Started
              </p>
              <p className="text-base font-medium">
                {formatDate(subscription?.started_at)}
              </p>
            </div>

            <div className="flex justify-between items-center pb-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Next Billing
              </p>
              <p className="text-base font-medium">
                {formatDate(subscription?.next_billing_at)}
              </p>
            </div>
          </div>

          {/* Plan Features */}
          {subscription?.plan?.features_list &&
            subscription.plan.features_list.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Plan Features
                </h4>
                <div className="space-y-2">
                  {subscription.plan.features_list
                    ?.filter((f) => f.name && f.name.trim() !== "")
                    .map((feature, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start gap-4"
                      >
                        <span className="text-sm text-foreground">
                          {feature.name}
                        </span>
                        <span className="text-sm font-medium shrink-0">
                          {renderFeature(feature)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            {subscription?.status === 'active' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelSubscription(subscription?.id);
                }}
                disabled={cancelSubscription.isPending}
              >
                {cancelSubscription.isPending ? 'Cancelling...' : 'Cancel'}
              </Button>
            )}
            
            {(subscription?.status === 'cancelled' || subscription?.status === 'expired') && (
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRenewSubscription(subscription?.id);
                }}
                disabled={renewSubscription.isPending}
              >
                {renewSubscription.isPending ? 'Renewing...' : 'Renew'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
