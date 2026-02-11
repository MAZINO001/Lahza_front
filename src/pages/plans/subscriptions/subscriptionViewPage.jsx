// // SubscriptionDetail.jsx
// import { useState } from "react";
// import { format } from "date-fns";
// import { useParams } from "react-router-dom";
// import { toast } from "sonner";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
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
// import {
//   Calendar,
//   DollarSign,
//   Building,
//   User,
//   Clock,
//   ShieldCheck,
//   AlertCircle,
//   Trash2,
//   RefreshCw,
//   Ban,
//   ArrowRightLeft,
// } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// import { useSubscription } from "@/features/plans/hooks/useSubscriptions";
// import {
//   useCancelSubscription,
//   useRenewSubscription,
//   useDeleteSubscription,
// } from "@/features/plans/hooks/useSubscriptions";

// export default function SubscriptionDetail() {
//   const { id } = useParams();
//   const { data: subscription, isLoading, error } = useSubscription(id);

//   const cancelMutation = useCancelSubscription();
//   const renewMutation = useRenewSubscription();
//   const deleteMutation = useDeleteSubscription();

//   const [cancelImmediate, setCancelImmediate] = useState(true);

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading subscription</div>;
//   if (!subscription) return <div>Subscription not found</div>;

//   const {
//     id: subId,
//     status,
//     started_at,
//     next_billing_at,
//     ends_at,
//     cancelled_at,
//     plan,
//     plan_price,
//     client,
//   } = subscription;

//   const isActive = status === "active";
//   const isCancelled = !!cancelled_at || status === "cancelled";
//   const currency = plan_price?.currency || "USD";
//   const price = plan_price?.price
//     ? Number(plan_price.price).toLocaleString("en-US", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })
//     : "—";

//   const formatDate = (dateStr) =>
//     dateStr ? format(new Date(dateStr), "PPP p") : "—";

//   const handleCancel = () => {
//     cancelMutation.mutate(
//       { subscriptionId: subId, immediate: cancelImmediate },
//       {
//         onSuccess: () => { },
//       },
//     );
//   };

//   const handleRenew = () => {
//     if (!confirm("Renew this subscription now?")) return;
//     renewMutation.mutate(subId);
//   };

//   const handleDelete = () => {
//     if (
//       !confirm(
//         "Permanently delete this subscription record? This action cannot be undone.",
//       )
//     )
//       return;
//     deleteMutation.mutate(subId);
//   };

//   return (
//     <div className="p-4 min-h-screen">
//       <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div></div>

//         {/* Quick Actions */}
//         <div className="flex flex-wrap gap-4">
//           {isActive && !isCancelled && (
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="border-rose-200 text-rose-700 hover:bg-rose-50"
//                 >
//                   <Ban className="mr-2 h-4 w-4" />
//                   Cancel
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     This will{" "}
//                     {cancelImmediate
//                       ? "immediately"
//                       : "at the end of the current period"}{" "}
//                     stop future billings. The customer will{" "}
//                     {cancelImmediate
//                       ? "lose access right away"
//                       : "keep access until"}{" "}
//                     the current period ends.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>

//                 <div className="py-4">
//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       id="immediate"
//                       checked={cancelImmediate}
//                       onCheckedChange={setCancelImmediate}
//                     />
//                     <Label htmlFor="immediate">
//                       Cancel immediately (revoke access now)
//                     </Label>
//                   </div>
//                 </div>

//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Back</AlertDialogCancel>
//                   <AlertDialogAction
//                     onClick={handleCancel}
//                     disabled={cancelMutation.isPending}
//                     className="bg-rose-600 hover:bg-rose-700"
//                   >
//                     {cancelMutation.isPending
//                       ? "Cancelling..."
//                       : "Confirm Cancel"}
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           )}

//           {(isCancelled || !isActive) && (
//             <Button
//               variant="outline"
//               onClick={handleRenew}
//               disabled={renewMutation.isPending}
//             >
//               <RefreshCw className="mr-2 h-4 w-4" />
//               {renewMutation.isPending ? "Renewing..." : "Renew"}
//             </Button>
//           )}

//           <Button
//             variant="outline"
//             disabled
//             className="opacity-50 cursor-not-allowed"
//           >
//             <ArrowRightLeft className="mr-2 h-4 w-4" />
//             Change Plan
//           </Button>

//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="text-red-600 hover:text-red-700 hover:bg-red-50"
//               >
//                 <Trash2 className="h-5 w-5" />
//               </Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Delete Subscription Record</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   This action will permanently remove this subscription from the
//                   database.
//                   <br />
//                   <br />
//                   <span className="font-semibold text-red-600">
//                     This cannot be undone.
//                   </span>
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                 <AlertDialogAction
//                   onClick={handleDelete}
//                   disabled={deleteMutation.isPending}
//                   className="bg-red-600 hover:bg-red-700"
//                 >
//                   {deleteMutation.isPending
//                     ? "Deleting..."
//                     : "Delete Permanently"}
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </div>
//       </div>

//       {isCancelled && (
//         <Alert className="mb-4 bg-amber-50 border-amber-200">
//           <AlertCircle className="h-5 w-5 text-amber-600" />
//           <AlertTitle>Cancelled</AlertTitle>
//           <AlertDescription>
//             This subscription has been cancelled{" "}
//             {cancelled_at ? `on ${formatDate(cancelled_at)}` : ""}.
//           </AlertDescription>
//         </Alert>
//       )}

//       <div className="grid gap-4">
//         <Card className="lg:col-span-2 border-slate-200 shadow-sm">
//           <CardHeader className="pb-4">
//             <div className="flex items-center justify-between flex-wrap gap-4">
//               <div>
//                 <CardTitle className="text-2xl font-bold">
//                   {plan?.name || "Unknown Plan"}
//                 </CardTitle>
//                 <CardDescription className="mt-1.5 text-base">
//                   {plan?.description || "No description available"}
//                 </CardDescription>
//               </div>
//               <Badge
//                 className={`px-4 py-1.5 ${isActive
//                   ? "bg-green-100 text-green-800"
//                   : isCancelled
//                     ? "bg-rose-100 text-rose-800"
//                     : "bg-slate-100 text-slate-800"
//                   }`}
//               >
//                 {status.toUpperCase()}
//               </Badge>
//             </div>
//           </CardHeader>

//           <CardContent className="space-y-8 pt-2">
//             <div className=" rounded-xl">
//               <div className="flex items-baseline gap-2">
//                 <DollarSign className="h-8 w-8 text-emerald-600" />
//                 <span className="text-3xl font-extrabold text-emerald-700">
//                   {currency} {price}
//                 </span>
//                 <span className="text-xl text-slate-500">
//                   /{plan_price?.interval || "period"}
//                 </span>
//               </div>
//               <p className="mt-2 text-sm text-slate-600">
//                 Billed {plan_price?.interval || "—"}
//               </p>
//             </div>

//             <Separator />

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//               <div className="space-y-1">
//                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
//                   <Calendar className="h-4 w-4" />
//                   Started
//                 </div>
//                 <p className="text-lg font-medium">{formatDate(started_at)}</p>
//               </div>

//               <div className="space-y-1">
//                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
//                   <Clock className="h-4 w-4" />
//                   Next Billing
//                 </div>
//                 <p className="text-lg font-medium">
//                   {formatDate(next_billing_at)}
//                 </p>
//               </div>

//               <div className="space-y-1">
//                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
//                   <ShieldCheck className="h-4 w-4" />
//                   Ends / Cancelled
//                 </div>
//                 <p className="text-lg font-medium">
//                   {ends_at || cancelled_at
//                     ? formatDate(ends_at || cancelled_at)
//                     : "Active — no end date"}
//                 </p>
//               </div>
//             </div>

//             {subscription?.custom_field_values?.length > 0 ? (
//               <>
//                 <Separator />
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">
//                     Custom Configuration
//                   </h3>
//                 </div>
//               </>
//             ) : null}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// SubscriptionDetail.jsx
import { useState } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  Calendar,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertCircle,
  Trash2,
  RefreshCw,
  Ban,
  ArrowRightLeft,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useSubscription } from "@/features/plans/hooks/useSubscriptions";
import {
  useCancelSubscription,
  useRenewSubscription,
  useDeleteSubscription,
} from "@/features/plans/hooks/useSubscriptions";

import { cn } from "@/lib/utils";

export default function SubscriptionDetail() {
  const { id } = useParams();
  const { data: subscription, isLoading, error } = useSubscription(id);

  const cancelMutation = useCancelSubscription();
  const renewMutation = useRenewSubscription();
  const deleteMutation = useDeleteSubscription();

  const [cancelImmediate, setCancelImmediate] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-sm">
          Loading subscription details...
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center px-4">
        <div className="space-y-3 max-w-md">
          <h2 className="text-xl font-semibold tracking-tight">
            {error ? "Failed to load subscription" : "Subscription not found"}
          </h2>
          <p className="text-muted-foreground">
            {error?.message || "Please check the ID or try again later."}
          </p>
        </div>
      </div>
    );
  }

  const {
    id: subId,
    status,
    started_at,
    next_billing_at,
    ends_at,
    cancelled_at,
    plan,
    plan_price,
    client,
  } = subscription;

  const isActive = status === "active";
  const isCancelled = !!cancelled_at || status === "cancelled";

  const currency = plan_price?.currency || "USD";
  const price = plan_price?.price
    ? Number(plan_price.price).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : "—";

  const formatDate = (dateStr) =>
    dateStr ? format(new Date(dateStr), "PPP p") : "—";

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
        },
      },
    );
  };

  const handleRenew = () => {
    if (!confirm("Renew this subscription now?")) return;
    renewMutation.mutate(subId, {
      onSuccess: () => toast.success("Subscription renewed successfully"),
    });
  };

  const handleDelete = () => {
    if (
      !confirm(
        "Permanently delete this subscription record? This cannot be undone.",
      )
    )
      return;
    deleteMutation.mutate(subId, {
      onSuccess: () => toast.success("Subscription record deleted"),
    });
  };

  return (
    <div className="space-y-4 p-4 min-h-screen">
      {/* Header + Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Subscription Details
          </h1>
          <p className="text-muted-foreground text-sm">
            {plan?.name || "Unknown plan"} • {client?.name || "Client"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {isActive && !isCancelled && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-destructive/40 text-destructive hover:bg-destructive/10"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-4 pt-2">
                    <p>
                      This will stop future billings. The customer will retain
                      access until the end of the current billing period unless
                      immediate cancellation is selected.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="py-5 border-y">
                  <div className="flex items-start gap-3">
                    <Switch
                      id="immediate"
                      checked={cancelImmediate}
                      onCheckedChange={setCancelImmediate}
                      className="mt-0.5"
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="immediate"
                        className="font-medium leading-none"
                      >
                        Cancel immediately
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Revoke access now (customer loses remaining period)
                      </p>
                    </div>
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel>Back</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {cancelMutation.isPending
                      ? "Cancelling..."
                      : "Confirm Cancel"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {(!isActive || isCancelled) && (
            <Button onClick={handleRenew} disabled={renewMutation.isPending}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {renewMutation.isPending ? "Renewing..." : "Renew"}
            </Button>
          )}

          <Button
            variant="outline"
            disabled
            className="opacity-60 cursor-not-allowed"
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Change Plan
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Subscription Record</AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>
                    This will permanently remove this subscription from the
                    database.
                  </p>
                  <p className="font-medium text-destructive">
                    This action cannot be undone.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending
                    ? "Deleting..."
                    : "Delete Permanently"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Cancelled Warning */}
      {isCancelled && (
        <Alert
          variant="destructive"
          className="border-destructive/30 bg-destructive/5"
        >
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Subscription Cancelled</AlertTitle>
          <AlertDescription>
            This subscription was cancelled{" "}
            {cancelled_at
              ? `on ${formatDate(cancelled_at)}`
              : "and is no longer active"}
            .
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Card */}
      <Card>
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl font-bold tracking-tight">
                {plan?.name || "Unknown Plan"}
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {plan?.description || "No description available"}
              </CardDescription>
            </div>

            <Badge
              variant="outline"
              className={cn(
                isActive && "bg-green-50 text-green-800 border-green-200",
                isCancelled &&
                  "bg-destructive/10 text-destructive border-destructive/30",
                !isActive &&
                  !isCancelled &&
                  "bg-amber-50 text-amber-800 border-amber-200",
              )}
            >
              {status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-10">
          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2.5">
              <DollarSign className="h-8 w-8 text-primary" />
              <span className="text-4xl font-bold tracking-tight">
                {currency} {price}
              </span>
              <span className="text-xl text-muted-foreground font-medium">
                /{plan_price?.interval || "period"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Billed {plan_price?.interval || "—"}
            </p>
          </div>

          <Separator />

          {/* Key Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Started
              </div>
              <p className="text-base font-medium">{formatDate(started_at)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Next Billing
              </div>
              <p className="text-base font-medium">
                {formatDate(next_billing_at)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                Ends / Cancelled
              </div>
              <p className="text-base font-medium">
                {ends_at || cancelled_at
                  ? formatDate(ends_at || cancelled_at)
                  : "Active — ongoing"}
              </p>
            </div>
          </div>

          {/* Custom Fields */}
          {subscription?.custom_field_values?.length > 0 && (
            <>
              <Separator />
              <div className="space-y-5">
                <h3 className="text-lg font-semibold tracking-tight">
                  Custom Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscription.custom_field_values.map((field, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        {field.label || field.key || "Field"}
                      </p>
                      <p className="text-base wrap-break-word">
                        {field.value ?? "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
