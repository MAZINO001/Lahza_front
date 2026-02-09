import React, { Suspense, lazy } from "react";
import { useParams, Navigate, useLocation } from "react-router-dom";

const AgencyInfo = lazy(() => import("../agency-info/AgencyInfo"));
const PreferencesSection = lazy(
  () => import("../preferences/PreferencesPanel")
);
const ManagementSection = lazy(() => import("../management/ManagementSection"));

export default function SettingsMainContent() {
  const { id } = useParams();
  const location = useLocation();

  // Extract the section name from the full path
  const pathSegments = location.pathname.split("/");
  const settingsIndex = pathSegments.indexOf("settings");
  const section = settingsIndex !== -1 && settingsIndex + 1 < pathSegments.length
    ? pathSegments[settingsIndex + 1]
    : "company_basics";

  const renderContent = () => {
    // Handle plans_management with potential pack ID
    if (section === "plans_management" || section?.startsWith("plans_management/")) {
      return <ManagementSection section="plans_management" />;
    }

    if (
      [
        "company_basics",
        "branding_assets",
        "contact_address",
        "legal_tax_banking",
        "certifications",
      ].includes(section)
    ) {
      return <AgencyInfo section={section} />;
    }

    if (["notifications", "preferences", "security"].includes(section)) {
      return <PreferencesSection section={section} />;
    }

    if (
      [
        "team_management",
        "projects_management",
        "users_management",
      ].includes(section)
    ) {
      return <ManagementSection section={section} />;
    }

    return <Navigate to="/admin/settings/company_basics" replace />;
  };

  return (
    <main className="flex-1 border border-border rounded-lg p-4 bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-4 ">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading settings...</span>
          </div>
        }
      >
        {renderContent()}
      </Suspense>
    </main>
  );
}
