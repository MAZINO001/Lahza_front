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

  const renderFeature = (feature) => {
    return (
      <div className="flex items-center gap-3 py-1.5">
        <Check className="h-5 w-5 text-primary shrink-0" />
        <span className="text-sm">{feature.feature_name}</span>
      </div>
    );
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
          {plan?.features
            ?.filter((f) => f.feature_name && f.feature_name.trim() !== "")
            .map((feature, index) => (
              <div key={index}>{renderFeature(feature)}</div>
            ))}

          {(!plan?.features ||
            plan?.features.filter(
              (f) => f.feature_name && f.feature_name.trim() !== "",
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
