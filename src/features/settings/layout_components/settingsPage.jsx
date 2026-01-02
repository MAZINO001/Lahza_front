import React from "react";
import { useParams, Navigate } from "react-router-dom";
import AgencyInfo from "../AgencyInfo/agency_info";
import PreferencesSection from "../preferences/preferences";
import ManagementSection from "../management/management";

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
