import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  useCompanyInfo,
  useUpdateCompanyInfo,
} from "../hooks/useSettingsAgencyInfoQuery";
import { CompanyBasicsSection } from "./components/CompanyBasicsSection";
import { BrandingAssetsSection } from "./components/BrandingAssetsSection";
import { ContactAddressSection } from "./components/ContactAddressSection";
import { LegalTaxBankingSection } from "./components/LegalTaxBankingSection";
import CertificationsSection from "./components/CertificationsSection";

export default function AgencyInfo({ section }) {
  const { data: companyInfo, isLoading, error } = useCompanyInfo();
  const updateCompanyInfo = useUpdateCompanyInfo();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      company_name: "",
      tagline: "",
      description: "",
      terms_and_conditions: "",
      logo_path: null,
      logo_dark_path: null,
      signature_path: null,
      stamp_path: null,
      email: "",
      phone: "",
      phone2: "",
      website: "",
      address_line1: "",
      address_line2: "",
      instagram: "",
      linkedIn: "",
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

  React.useEffect(() => {
    if (companyInfo && !isLoading) {
      reset(companyInfo);
    }
  }, [companyInfo, isLoading, reset]);

  const onSubmit = (values) => {
    console.log(values);
    updateCompanyInfo.mutate({
      id: companyInfo?.id || 1,
      data: values,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        Error loading company information
      </div>
    );
  }

  const renderSection = () => {
    switch (section) {
      case "company_basics":
        return (
          <form
            key="company_basics"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <CompanyBasicsSection control={control} errors={errors} />
            <div className="flex justify-end">
              <Button type="submit" disabled={updateCompanyInfo.isPending}>
                {updateCompanyInfo.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        );
      case "branding_assets":
        return (
          <form
            key="branding_assets"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <BrandingAssetsSection control={control} />
            <div className="flex justify-end">
              <Button type="submit" disabled={updateCompanyInfo.isPending}>
                {updateCompanyInfo.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        );
      case "contact_address":
        return (
          <form
            key="contact_address"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <ContactAddressSection control={control} errors={errors} />
            <div className="flex justify-end">
              <Button type="submit" disabled={updateCompanyInfo.isPending}>
                {updateCompanyInfo.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        );
      case "legal_tax_banking":
        return (
          <form
            key="legal_tax_banking"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <LegalTaxBankingSection control={control} errors={errors} />
            <div className="flex justify-end">
              <Button type="submit" disabled={updateCompanyInfo.isPending}>
                {updateCompanyInfo.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        );
      case "certifications":
        return (
          <form
            key="certifications"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <CertificationsSection />
          </form>
        );

      default:
        return null;
    }
  };

  return renderSection();
}
