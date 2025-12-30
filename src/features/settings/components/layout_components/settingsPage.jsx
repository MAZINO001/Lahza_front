"use client";

import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AgencyInfo from "../agency_info";
import Notifications from "../preferences/notifications";
import Preferences from "../preferences/general";
import Security from "../preferences/security";
import User_team_management from "../user_team_management";
import { CompanyBasicsSection } from "../agency_info/CompanyBasicsSection";
import { BrandingAssetsSection } from "../agency_info/BrandingAssetsSection";
import { ContactAddressSection } from "../agency_info/ContactAddressSection";
import { LegalTaxBankingSection } from "../agency_info/LegalTaxBankingSection";
import { Button } from "@/components/ui/button";

export default function SettingsMainContent() {
  const { id } = useParams();

  // Form hook for agency info sections
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_name: "",
      tagline: "",
      description: "",
      terms_conditions: "",
      logo_path: null,
      logo_dark_path: null,
      signature_path: null,
      stamp_path: null,
      agency_contract: null,
      email: "",
      phone: "",
      phone2: "",
      website: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      ma_ice: "",
      ma_if: "",
      ma_cnss: "",
      ma_rc: "",
      ma_vat: "",
      fr_siret: "",
      fr_vat: "",
      bank_name: "",
      rib: "",
      account_name: "",
    },
  });

  const onSubmit = (values) => {
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== "" && value !== undefined) {
        data.append(key, value);
      }
    });
    console.log("READY TO SEND", [...data.entries()]);
  };

  // Render component based on the URL parameter
  const renderContent = () => {
    switch (id) {
      case "company_basics":
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <CompanyBasicsSection control={control} errors={errors} />
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        );
      case "branding_assets":
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <BrandingAssetsSection control={control} />
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        );
      case "contact_address":
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <ContactAddressSection control={control} errors={errors} />
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        );
      case "legal_tax_banking":
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <LegalTaxBankingSection control={control} errors={errors} />
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        );
      case "notifications":
        return <Notifications />;
      case "preferences":
        return <Preferences />;
      case "security":
        return <Security />;
      case "user_team_management":
        return <User_team_management />;
      case "agency_info":
        return <AgencyInfo />;
      default:
        return <Navigate to="/admin/settings/Company Basics" replace />;
    }
  };

  return (
    <main className="flex-1 border border-border rounded-lg p-4">
      {renderContent()}
    </main>
  );
}
