// import React from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { CompanyBasicsSection } from "./agency_info/CompanyBasicsSection";
// import { BrandingAssetsSection } from "./agency_info/BrandingAssetsSection";
// import { ContactAddressSection } from "./agency_info/ContactAddressSection";
// import { LegalTaxBankingSection } from "./agency_info/LegalTaxBankingSection";

// export default function AgencyInfo() {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       company_name: "",
//       tagline: "",
//       description: "",
//       terms_conditions: "",
//       logo_path: null,
//       logo_dark_path: null,
//       signature_path: null,
//       stamp_path: null,
//       email: "",
//       phone: "",
//       phone2: "",
//       website: "",
//       address_line1: "",
//       address_line2: "",
//       city: "",
//       state: "",
//       country: "",
//       postal_code: "",
//       ma_ice: "",
//       ma_if: "",
//       ma_cnss: "",
//       ma_rc: "",
//       ma_vat: "",
//       fr_siret: "",
//       fr_vat: "",
//       bank_name: "",
//       rib: "",
//       account_name: "",
//     },
//   });

//   const onSubmit = (values) => {
//     const data = new FormData();
//     Object.entries(values).forEach(([key, value]) => {
//       if (value !== null && value !== "" && value !== undefined) {
//         data.append(key, value);
//       }
//     });
//     console.log("READY TO SEND", [...data.entries()]);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//       <CompanyBasicsSection control={control} errors={errors} />
//       <BrandingAssetsSection control={control} />
//       <ContactAddressSection control={control} errors={errors} />
//       <LegalTaxBankingSection control={control} errors={errors} />
//     </form>
//   );
// }

import React from "react";

export default function agency_info() {
  return <div>agency_info</div>;
}
