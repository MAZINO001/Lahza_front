import React from "react";
import { useParams, Navigate } from "react-router-dom";
import AgencyInfo from "../agency_info";
import PreferencesSection from "../preferences";
import ManagementSection from "../management";

export default function SettingsMainContent() {
  const { id } = useParams();

  const renderContent = () => {
    if (
      [
        "company_basics",
        "branding_assets",
        "contact_address",
        "legal_tax_banking",
      ].includes(id)
    ) {
      return <AgencyInfo section={id} />;
    }

    if (["notifications", "preferences", "security", "certifications"].includes(id)) {
      return <PreferencesSection section={id} />;
    }

    if (
      ["team_management", "projects_management", "users_management"].includes(
        id
      )
    ) {
      return <ManagementSection section={id} />;
    }

    return <Navigate to="/admin/settings/company_basics" replace />;
  };

  return (
    <main className="flex-1 border border-border rounded-lg p-4">
      {renderContent()}
    </main>
  );
}
