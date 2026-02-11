// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { CreditCard, Calendar, CheckCircle, XCircle } from "lucide-react";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { useClientActiveSubscription } from "../hooks/useSubscriptions";
// import { useCancelSubscription } from "../hooks/useSubscriptions";
// import { useNavigate } from "react-router-dom";
// import { formatId } from "@/lib/utils/formatId";
// import { toast } from "sonner";

// export default function ClientsAllPlans({ onViewChange }) {
//   const { user, role } = useAuthContext();
//   const { data: subscriptionData, isLoading } = useClientActiveSubscription(
//     user?.id,
//   );
//   const navigate = useNavigate();

//   console.log(subscriptionData);

//   const cancelSubscription = useCancelSubscription();

//   const handleCardClick = (planId, subscriptionId) => {
//     navigate(`/${role}/plans/${planId}/subscription/${subscriptionId}`);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "No end date";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getStatusBadge = (status) => {
//     const variants = {
//       active: "default",
//       cancelled: "destructive",
//       expired: "secondary",
//     };

//     const icons = {
//       active: <CheckCircle className="h-3 w-3 mr-1" />,
//       cancelled: <XCircle className="h-3 w-3 mr-1" />,
//       expired: <XCircle className="h-3 w-3 mr-1" />,
//     };

//     return (
//       <Badge
//         variant={variants[status] || "secondary"}
//         className="flex items-center"
//       >
//         {icons[status]}
//         {status?.charAt(0).toUpperCase() + status?.slice(1)}
//       </Badge>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading your subscriptions...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!subscriptionData) {
//     return (
//       <div className="py-4 px-4 sm:px-4 lg:px-4 min-h-screen">
//         <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
//           <div className="rounded-full bg-muted p-4 mb-4">
//             <CreditCard className="h-12 w-12 text-muted-foreground" />
//           </div>
//           <h2 className="text-2xl font-bold mb-3">No active subscriptions</h2>
//           <p className="text-muted-foreground max-w-md mb-4">
//             You don't have any active subscriptions. Choose a plan that best
//             fits your needs.
//           </p>
//           {onViewChange && (
//             <Button
//               onClick={() => onViewChange("cards")}
//               className="flex items-center gap-2"
//             >
//               <CreditCard className="h-4 w-4" />
//               View Available Plans
//             </Button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   const subscription = subscriptionData;

//   return (
//     <div className="py-4 px-4 sm:px-4 lg:px-4 min-h-screen">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight mb-2">
//             My Subscriptions
//           </h1>
//           <p className="text-muted-foreground">
//             View and manage your subscription details
//           </p>
//         </div>
//         {onViewChange && (
//           <Button
//             variant="outline"
//             onClick={() => onViewChange("cards")}
//             className="flex items-center gap-2"
//           >
//             <CreditCard className="h-4 w-4" />
//             View All Plans
//           </Button>
//         )}
//       </div>

//       <div className="p-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <Card
//             className="relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
//             onClick={() =>
//               handleCardClick(subscription?.plan_id, subscription?.id)
//             }
//           >
//             <CardHeader className="pb-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle className="text-lg mb-1">
//                     {formatId(subscription?.id, "SUB")}
//                   </CardTitle>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {getStatusBadge(subscription?.status)}
//                 </div>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-3">
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-muted-foreground">Plan ID</span>
//                   <span className="text-sm font-medium">
//                     {formatId(subscription?.plan_id, "PLAN")}
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-muted-foreground">Started</span>
//                   <span className="text-xs font-medium">
//                     {formatDate(subscription?.started_at)}
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-muted-foreground">
//                     Next Billing
//                   </span>
//                   <span className="text-xs font-medium">
//                     {formatDate(subscription?.next_billing_at)}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

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
import { CreditCard, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useAuthContext } from "@/hooks/AuthContext";
import { useClientActiveSubscription } from "../hooks/useSubscriptions";
import { useCancelSubscription } from "../hooks/useSubscriptions";
import { useNavigate } from "react-router-dom";
import { formatId } from "@/lib/utils/formatId";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ClientsAllPlans({ onViewChange }) {
  const { user, role } = useAuthContext();
  const { data: subscriptionData, isLoading } = useClientActiveSubscription(
    user?.id,
  );
  const navigate = useNavigate();

  const cancelSubscription = useCancelSubscription();

  const handleCardClick = (planId, subscriptionId) => {
    navigate(`/${role}/plans/${planId}/subscription/${subscriptionId}`);
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
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4  text-center">
        <div className="rounded-full bg-muted/60 p-6">
          <CreditCard className="h-12 w-12 text-muted-foreground" />
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

      {/* Subscription Card */}
      <Card
        className={cn(
          "group relative overflow-hidden transition-all cursor-pointer",
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

        <CardContent className="space-y-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Plan ID
              </p>
              <p className="text-base font-medium">
                {formatId(subscription?.plan_id, "PLAN")}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Started
              </p>
              <p className="text-base font-medium">
                {formatDate(subscription?.started_at)}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Next Billing
              </p>
              <p className="text-base font-medium">
                {formatDate(subscription?.next_billing_at)}
              </p>
            </div>
          </div>

          {/* Optional: could add Cancel button here if needed */}
          {/* 
          {subscription?.status === "active" && (
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  // cancel logic if you want to add it here
                }}
              >
                Cancel Subscription
              </Button>
            </div>
          )}
          */}
        </CardContent>
      </Card>
    </div>
  );
}
