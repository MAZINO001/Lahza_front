// import React, { useState } from "react";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import {
//   User,
//   Package,
//   Calendar,
//   TrendingUp,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Ban,
//   RefreshCw,
//   ArrowRightLeft,
//   AlertCircle,
//   Trash2,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import {
//   useCancelSubscription,
//   useRenewSubscription,
//   useDeleteSubscription,
// } from "@/features/plans/hooks/useSubscriptions";
// import { useQueryClient } from "@tanstack/react-query";

// export default function OverviewSection({
//   subscription,
//   client,
//   plan,
//   isActive,
//   isCancelled,
// }) {
//   const [cancelImmediate, setCancelImmediate] = useState(false);

//   console.log("subscription", subscription);

//   const cancelMutation = useCancelSubscription();
//   const renewMutation = useRenewSubscription();
//   const deleteMutation = useDeleteSubscription();
//   const queryClient = useQueryClient();

//   if (!subscription) return null;

//   const {
//     id: subId,
//     started_at,
//     next_billing_at,
//     plan_price,
//     status,
//     cancelled_at,
//     ends_at,
//   } = subscription;

//   const currency = plan_price?.currency || "USD";
//   const price = plan_price?.price
//     ? Number(plan_price.price).toLocaleString("en-US", {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 2,
//       })
//     : "—";

//   const formatDate = (dateStr) =>
//     dateStr ? format(new Date(dateStr), "PPP") : "—";

//   const getStatusIcon = () => {
//     if (isActive && !isCancelled)
//       return <CheckCircle className="h-5 w-5 text-green-600" />;
//     if (isCancelled) return <XCircle className="h-5 w-5 text-destructive" />;
//     return <Clock className="h-5 w-5 text-amber-600" />;
//   };

//   // Real cancel handler from old code
//   const handleCancel = () => {
//     cancelMutation.mutate(
//       { subscriptionId: subId, immediate: cancelImmediate },
//       {
//         onSuccess: () => {
//           toast.success(
//             cancelImmediate
//               ? "Subscription cancelled immediately"
//               : "Subscription cancellation scheduled",
//           );
//         },
//       },
//     );
//   };

//   // Real renew handler from old code
//   const handleRenew = () => {
//     renewMutation.mutate(subId, {
//       onSuccess: (data) => {
//         toast.success("Subscription renewed successfully");
//         // Force a re-render by invalidating the subscription query
//         queryClient.invalidateQueries({ queryKey: ["subscription", subId] });
//         queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
//       },
//       onError: (error) => {
//         const msg =
//           error?.response?.data?.message || "Could not renew subscription";
//         toast.error(msg);
//       },
//     });
//   };

//   return (
//     <Card className="bg-linear-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800">
//       <CardHeader className="pb-4">
//         <div className="flex items-start justify-between">
//           <div>
//             <CardTitle className="text-lg">Subscription Overview</CardTitle>
//             <CardDescription>Key details at a glance</CardDescription>
//           </div>
//           <Badge
//             variant="outline"
//             className={cn(
//               "flex items-center gap-1.5 px-3 py-1.5",
//               isActive &&
//                 !isCancelled &&
//                 "bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800",
//               isCancelled &&
//                 "bg-destructive/10 text-destructive border-destructive/30 dark:bg-destructive/20",
//               !isActive &&
//                 !isCancelled &&
//                 "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
//             )}
//           >
//             {getStatusIcon()}
//             <span className="capitalize font-medium">{status}</span>
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Plan */}
//           <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
//             <div className="flex items-center gap-2">
//               <Package className="h-4 w-4 text-muted-foreground" />
//               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                 Plan
//               </span>
//             </div>
//             <p className="text-sm font-semibold">{plan?.name || "Unknown"}</p>
//             {plan?.description && (
//               <p className="text-xs text-muted-foreground truncate">
//                 {plan.description}
//               </p>
//             )}
//           </div>

//           {/* Price */}
//           <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
//             <div className="flex items-center gap-2">
//               <TrendingUp className="h-4 w-4 text-muted-foreground" />
//               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                 Amount
//               </span>
//             </div>
//             <div className="flex items-baseline gap-1">
//               <p className="text-2xl font-bold">
//                 {currency} {price}
//               </p>
//               <span className="text-xs text-muted-foreground">
//                 / {plan_price?.interval || "period"}
//               </span>
//             </div>
//           </div>

//           {/* Next Billing */}
//           <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
//             <div className="flex items-center gap-2">
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                 {isActive && !isCancelled ? "Next Billing" : "Started"}
//               </span>
//             </div>
//             <p className="text-sm font-semibold">
//               {isActive && !isCancelled
//                 ? formatDate(next_billing_at)
//                 : formatDate(started_at)}
//             </p>
//           </div>
//         </div>

//         {/* Cancelled Warning */}
//         {isCancelled && (
//           <Alert className="mt-4 border-destructive/30 bg-destructive/5">
//             <AlertCircle className="h-5 w-5" />
//             <AlertTitle>Subscription Cancelled</AlertTitle>
//             <AlertDescription>
//               This subscription was cancelled{" "}
//               {cancelled_at
//                 ? `on ${formatDate(cancelled_at)}`
//                 : "and is no longer active"}
//               .
//             </AlertDescription>
//           </Alert>
//         )}

//         <div className="flex flex-wrap gap-3 mt-6">
//           {isActive && !isCancelled && (
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="border-destructive/40 text-destructive hover:bg-destructive/10"
//                 >
//                   <Ban className="mr-2 h-4 w-4" />
//                   Cancel
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent className="sm:max-w-[425px]">
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
//                   <AlertDialogDescription className="space-y-4 pt-2">
//                     <p>
//                       This will stop future billings. The customer will retain
//                       access until the end of the current billing period unless
//                       immediate cancellation is selected.
//                     </p>
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>

//                 <div className="py-5 border-y">
//                   <div className="flex items-start gap-3">
//                     <Switch
//                       id="immediate"
//                       checked={cancelImmediate}
//                       onCheckedChange={setCancelImmediate}
//                       className="mt-0.5"
//                     />
//                     <div className="space-y-1">
//                       <Label
//                         htmlFor="immediate"
//                         className="font-medium leading-none"
//                       >
//                         Cancel immediately
//                       </Label>
//                       <p className="text-sm text-muted-foreground">
//                         Revoke access now (customer loses remaining period)
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Back</AlertDialogCancel>
//                   <AlertDialogAction
//                     onClick={handleCancel}
//                     disabled={cancelMutation.isPending}
//                     className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                   >
//                     {cancelMutation.isPending
//                       ? "Cancelling..."
//                       : "Confirm Cancel"}
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           )}

//           {(!isActive || isCancelled) && (
//             <Button onClick={handleRenew} disabled={renewMutation.isPending}>
//               <RefreshCw className="mr-2 h-4 w-4" />
//               {renewMutation.isPending ? "Renewing..." : "Renew"}
//             </Button>
//           )}

//           <Button
//             variant="outline"
//             disabled
//             className="opacity-60 cursor-not-allowed"
//           >
//             <ArrowRightLeft className="mr-2 h-4 w-4" />
//             Change Plan
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  Ban,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCancelSubscription,
  useRenewSubscription,
} from "@/features/plans/hooks/useSubscriptions";
import { useQueryClient } from "@tanstack/react-query";

export default function SubscriptionOverviewPremium({
  subscription,
  plan,
  isActive,
  isCancelled,
}) {
  const [cancelImmediate, setCancelImmediate] = useState(false);
  const cancelMutation = useCancelSubscription();
  const renewMutation = useRenewSubscription();
  const queryClient = useQueryClient();

  console.log(subscription);

  if (!subscription) return null;

  const {
    id: subId,
    started_at,
    next_billing_at,
    plan_price,
    status,
    cancelled_at,
    ends_at,
  } = subscription;

  const currency = plan_price?.currency || "USD";
  const price = plan_price?.price
    ? Number(plan_price.price).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : "—";

  const formatDate = (dateStr) =>
    dateStr ? format(new Date(dateStr), "PPP") : "—";

  const getStatusConfig = () => {
    if (isActive && !isCancelled) {
      return {
        icon: <CheckCircle className="h-6 w-6" />,
        label: "Active Subscription",
        bgGradient: "from-emerald-600 to-emerald-700",
        iconColor: "text-emerald-600",
        dotColor: "bg-emerald-500",
      };
    }
    if (isCancelled) {
      return {
        icon: <XCircle className="h-6 w-6" />,
        label: "Cancelled",
        bgGradient: "from-red-600 to-red-700",
        iconColor: "text-red-600",
        dotColor: "bg-red-500",
      };
    }
    return {
      icon: <Clock className="h-6 w-6" />,
      label: "Pending",
      bgGradient: "from-amber-600 to-amber-700",
      iconColor: "text-amber-600",
      dotColor: "bg-amber-500",
    };
  };

  const statusConfig = getStatusConfig();

  const handleCancel = () => {
    cancelMutation.mutate(
      { subscriptionId: subId, immediate: cancelImmediate },
      {
        onSuccess: () => {
          toast.success(
            cancelImmediate
              ? "Subscription cancelled immediately"
              : "Subscription cancellation scheduled",
          );
          queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        },
      },
    );
  };

  const handleRenew = () => {
    renewMutation.mutate(subId, {
      onSuccess: () => {
        toast.success("Subscription renewed successfully");
        queryClient.invalidateQueries({ queryKey: ["subscription", subId] });
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      },
      onError: (error) => {
        const msg =
          error?.response?.data?.message || "Could not renew subscription";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-linear-to-br",
          statusConfig.bgGradient,
        )}
      >
        <div className="absolute top-1 right-1 w-20 h-20 bg-green-400/30 rounded-full blur-xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/3 rounded-full -ml-8 -mb-8 blur-xl" />

        <div className="relative p-2.5 text-white">
          <div className="flex items-center justify-between gap-4 ">
            <div className="flex items-center gap-2 min-w-fit w-[25%]">
              <div className="p-1.5 bg-white/15 rounded-md backdrop-blur-sm border border-white/20">
                {React.cloneElement(statusConfig.icon, {
                  className: "h-3.5 w-3.5 text-white",
                })}
              </div>
              <div>
                <p className="text-xs font-medium text-white/70 uppercase tracking-tight">
                  Status
                </p>
                <p className="text-sm font-semibold leading-none">
                  {statusConfig.label}
                </p>
              </div>
            </div>

            {isActive && !isCancelled && (
              <div className="flex-1 min-w-fit w-[25%]">
                <p className="text-white/60 text-xs mb-0.5">Started</p>
                <p className="text-xs font-medium">{formatDate(started_at)}</p>
              </div>
            )}

            {isActive && !isCancelled && (
              <div className="flex-1 min-w-fit w-[25%]">
                <p className="text-white/60 text-xs mb-0.5">Next billing</p>
                <p className="text-xs font-medium">
                  {formatDate(next_billing_at)}
                </p>
              </div>
            )}

            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm capitalize font-medium px-2 py-0.5 text-xs whitespace-nowrap ">
              {status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Cancelled Alert */}
      {isCancelled && (
        <Alert className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-900 dark:text-red-100 text-lg font-semibold">
            Subscription Cancelled
          </AlertTitle>
          <AlertDescription className="text-red-800 dark:text-red-200 mt-2">
            {cancelled_at
              ? `Cancelled on ${formatDate(cancelled_at)}`
              : "This subscription is no longer active"}
            {ends_at && (
              <div className="mt-2">
                Access ends on <strong>{formatDate(ends_at)}</strong>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Details Grid - 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Plan Card */}
        <Card className="border-slate-200 dark:border-slate-800 ">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Plan
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {plan?.name || "Unknown"}
            </p>
            {plan?.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {plan.description}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Price Card */}
        <Card className="border-slate-200 dark:border-slate-800  bg-linear-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Billing Amount
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                {currency}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {price}
              </p>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              per {plan_price?.interval || "period"}
            </p>
          </CardContent>
        </Card>

        {/* Started Date Card */}
        <Card className="border-slate-200 dark:border-slate-800 ">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Subscription Started
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              {formatDate(started_at)}
            </p>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
              <span
                className={cn("h-2 w-2 rounded-full", statusConfig.dotColor)}
              />
              Your journey began here
            </p>
          </CardContent>
        </Card>

        {/* End/Renewal Date Card */}
        <Card className="border-slate-200 dark:border-slate-800 ">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {isActive && !isCancelled ? "Next Billing" : "Ends On"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              {isActive && !isCancelled
                ? formatDate(next_billing_at)
                : formatDate(ends_at || cancelled_at)}
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              {isActive && !isCancelled
                ? "Next charge date"
                : "Your access expires"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {isActive && !isCancelled && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 font-semibold"
              >
                <Ban className="mr-2 h-4 w-4" />
                Cancel Subscription
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Your Subscription</AlertDialogTitle>
                <AlertDialogDescription>
                  This will stop future billings. You will keep access until the
                  end of your current billing period, unless you cancel
                  immediately.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4 py-4 border-y">
                <div className="flex items-start gap-3">
                  <Switch
                    id="immediate"
                    checked={cancelImmediate}
                    onCheckedChange={setCancelImmediate}
                    className="mt-1"
                  />
                  <div className="space-y-2">
                    <Label
                      htmlFor="immediate"
                      className="text-sm font-semibold cursor-pointer"
                    >
                      Cancel immediately
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Remove access right now (you lose the rest of your billing
                      period)
                    </p>
                  </div>
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {cancelMutation.isPending ? "Cancelling..." : "Cancel"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {(!isActive || isCancelled) && (
          <Button
            onClick={handleRenew}
            disabled={renewMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {renewMutation.isPending ? "Renewing..." : "Renew Subscription"}
          </Button>
        )}
      </div>
    </div>
  );
}
