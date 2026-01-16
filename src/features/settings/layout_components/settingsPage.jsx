import React, { Suspense, lazy } from "react";
import { useParams, Navigate } from "react-router-dom";

const AgencyInfo = lazy(() => import("../agency-info/AgencyInfo"));
const PreferencesSection = lazy(
  () => import("../preferences/PreferencesPanel")
);
const ManagementSection = lazy(() => import("../management/ManagementSection"));

export default function SettingsMainContent() {
  const { id } = useParams();

  const renderContent = () => {
    if (
      [
        "company_basics",
        "branding_assets",
        "contact_address",
        "legal_tax_banking",
        "certifications",
      ].includes(id)
    ) {
      return <AgencyInfo section={id} />;
    }

    if (["notifications", "preferences", "security"].includes(id)) {
      return <PreferencesSection section={id} />;
    }

    if (
      [
        "team_management",
        "projects_management",
        "users_management",
        "agency_objectives",
        "tickets_management",
      ].includes(id)
    ) {
      return <ManagementSection section={id} />;
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
