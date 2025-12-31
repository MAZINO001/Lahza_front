/* eslint-disable no-unused-vars */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { CompanyBasicsSection } from "./agency_info/CompanyBasicsSection";
import { BrandingAssetsSection } from "./agency_info/BrandingAssetsSection";
import { ContactAddressSection } from "./agency_info/ContactAddressSection";
import { LegalTaxBankingSection } from "./agency_info/LegalTaxBankingSection";
import { Button } from "@/components/ui/button";
import {
  useCompanyInfo,
  useUpdateCompanyInfo,
} from "../hooks/useSettingsQuery";
import CertificationsSection from "./agency_info/certifications";

export default function AgencyInfo({ section }) {
  const { data: companyInfo, isLoading, error } = useCompanyInfo();
  const updateCompanyInfo = useUpdateCompanyInfo();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
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
      instagram: "",
      linkedIn: "",
      certification_description: "",
      preview_image: null,
      title: "",
      url: "",
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

  const formValues = watch();

  React.useEffect(() => {
    if (companyInfo && !isLoading) {
      reset(companyInfo);
    }
  }, [companyInfo, isLoading, reset]);

  const onSubmit = (values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== "" && value !== undefined) {
        if (!(value instanceof File) && !(value instanceof FileList)) {
          formData.append(key, value);
        }
      }
    });

    const fileFields = [
      "logo_path",
      "logo_dark_path",
      "signature_path",
      "stamp_path",
      "agency_contract",
      "preview_image",
    ];

    fileFields.forEach((field) => {
      if (values[field] && values[field] instanceof File) {
        formData.append(field, values[field]);
      }
    });

    for (let [key, value] of formData.entries()) {
      console.log(key);
      console.log(value);
    }

    updateCompanyInfo.mutate({
      id: companyInfo?.id || 1,
      data: formData,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading company information</div>;
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
            <CertificationsSection control={control} errors={errors} />
            <div className="flex justify-end">
              <Button type="submit" disabled={updateCompanyInfo.isPending}>
                {updateCompanyInfo.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return renderSection();
}
