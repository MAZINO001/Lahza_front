import { useParams } from "react-router-dom";
import OverviewSection from "./dashboard/OverviewSection";
import SeoSection from "./dashboard/SeoSection";
import SocialSection from "./dashboard/SocialSection";
import WebHostingSection from "./dashboard/WebHostingSection";
import { useSubscription } from "@/features/plans/hooks/useSubscriptions";
import { usePack } from "@/features/plans/hooks/usePacks";

export default function SubscriptionDetail() {
  const { id: subscriptionId, packId } = useParams();

  const {
    data: subscription,
    isLoading,
    error,
  } = useSubscription(subscriptionId);

  // Always call hooks in the same order on every render.
  // We can safely derive the effectivePackId from either the URL or the loaded subscription.
  const { data: pack } = usePack(subscription?.plan?.pack_id || packId);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 min-h-screen">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="space-y-4 p-4 min-h-screen">
        <div className="text-center py-8">
          <p className="text-destructive">
            {error?.message || "Subscription not found"}
          </p>
        </div>
      </div>
    );
  }

  const { client, plan } = subscription;

  const isActive = subscription.status === "active";
  // Treat "cancelled"/"canceled" status as the single source of truth.
  // Do NOT infer cancellation from `cancelled_at`, because some backends
  // keep that date even after a subscription is renewed.
  const isCancelled =
    subscription.status === "cancelled" || subscription.status === "canceled";

  const packName = pack?.name?.toLowerCase() || "";

  // Example: enable sections based on pack name keywords
  const showWebHosting =
    packName.includes("hosting") || packName.includes("web");
  const showSeo = packName.includes("seo");
  const showSocial = packName.includes("social") || packName.includes("media");

  const hostingData = {
    domain: "example.com",
    status: "active",
    plan: "Business Hosting",
    ipAddress: "192.168.1.20",
    createdAt: "2025-01-10",
    expiresAt: "2026-01-10",
    autoRenew: true,

    resources: {
      diskUsed: "5.4GB",
      diskLimit: "20GB",
      bandwidthUsed: "32GB",
      bandwidthLimit: "100GB",
      cpuUsage: "12%",
      ramUsage: "450MB",
      inodeUsage: "12000",
    },

    databases: [{ name: "wordpress_db", size: "120MB" }],

    emails: [{ address: "contact@example.com", storage: "200MB" }],

    ssl: {
      status: "active",
      issuer: "Let's Encrypt",
      expiresAt: "2026-03-01",
    },

    backups: {
      lastBackup: "2026-02-10",
      frequency: "daily",
    },

    uptime: "99.98%",
  };

  return (
    <div className="space-y-4 p-4 min-h-screen">
      <OverviewSection
        subscription={subscription}
        client={client}
        plan={plan}
        isActive={isActive}
        isCancelled={isCancelled}
      />

      {showWebHosting && <WebHostingSection hostingData={hostingData} />}
      {showSeo && <SeoSection />}
      {showSocial && <SocialSection />}
    </div>
  );
}
