import React from "react";
import { useCompanyInfo } from "../../hooks/useSettingsAgencyInfoQuery";
import { CompanyBasicsView } from "./CompanyBasicsView";
import { ContactAddressView } from "./ContactAddressView";
import { LegalTaxBankingView } from "./LegalTaxBankingView";
import { CertificationsView } from "./CertificationsView";

export function AgencyInfoView({ section }) {
    const { data: companyInfo, isLoading, error } = useCompanyInfo();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-sm text-gray-500">Loading agency information...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-sm text-red-600">Error loading agency information</div>
            </div>
        );
    }

    const renderSection = () => {
        switch (section) {
            case "company_basics":
                return <CompanyBasicsView data={companyInfo} />;
            case "contact_address":
                return <ContactAddressView data={companyInfo} />;
            case "legal_tax_banking":
                return <LegalTaxBankingView data={companyInfo} />;
            case "certifications":
                return <CertificationsView />;
            default:
                return (
                    <div className="flex items-center justify-center p-8">
                        <div className="text-sm text-gray-500">Section not found</div>
                    </div>
                );
        }
    };

    return renderSection();
}
