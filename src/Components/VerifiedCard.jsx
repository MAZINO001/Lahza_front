"use client";

import { Shield, Crown, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useAuthContext } from "@/hooks/AuthContext";

const VerifyCard = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  const statusConfig = {
    awaiting_confirmation: {
      label: "Guest",
      variant: "outline",
      icon: Clock,
      badgeBg: "bg-neutral-100 dark:bg-neutral-900/50",
      iconColor: "text-neutral-500 dark:text-neutral-400",
      title: "Prospect",
      description:
        "Welcome. Your application is under review. Finalize verification to gain entry into our curated community.",
    },

    confirmed: {
      label: "Member",
      variant: "secondary",
      icon: ShieldCheck,
      badgeBg: "bg-teal-50 dark:bg-teal-950/40",
      iconColor: "text-teal-700 dark:text-teal-400",
      title: "Charter Member",
      description:
        "Verified and established. Full standard privileges with dependable access and our promise of trust & security.",
    },

    gold: {
      label: "Signature",
      variant: "default",
      icon: Crown,
      badgeBg: "bg-amber-50 dark:bg-amber-950/50",
      iconColor: "text-amber-700 dark:text-amber-400",
      title: "Signature Member",
      description:
        "Reserved for committed members. Unlock priority lanes, exclusive tools, elevated limits, and dedicated attention.",
    },
  };
  const config =
    statusConfig[user.status] || statusConfig.awaiting_confirmation;
  const IconComponent = config.icon;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge className="cursor-pointer gap-1" variant={config.variant}>
          <IconComponent className="h-3 w-3" />
          {config.label}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.badgeBg}`}
          >
            <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{config.title}</h4>
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default VerifyCard;
