// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// import { useState, useEffect } from "react";
// import { Button } from "@/Components/ui/button";

// import TheStepper from "@/Components/comp-517";
// import FormSection from "@/Components/Form/FormSection";
// import FormField from "@/Components/Form/FormField";
// import CountrySelect from "@/Components/Form/CountrySelect";
// import CurrencySelect from "@/Components/Form/CurrencySelect";
// import ClientTypeRadio from "@/Components/Form/ClientTypeRadio";
// import { Controller, useForm } from "react-hook-form";
// import { useRegisterStore } from "@/hooks/registerStore";
// import { useNavigate } from "react-router-dom";
// import api from "@/lib/utils/axios";
// import { useAuthContext } from "@/hooks/AuthContext";

// export function ClientForm({ onClientCreated, handleClientCreatedByAdmin }) {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const { role } = useAuthContext();
//   const registerStore = useRegisterStore();

//   const {
//     handleSubmit,
//     watch,
//     setValue,
//     control,
//     trigger,
//     formState: { errors },
//   } = useForm({
//     defaultValues: registerStore,
//   });

//   const typeClientValue = watch("client_type");
//   const paysValue = watch("country");

//   const handleChange = (field, value) => setValue(field, value);
//   useEffect(() => {
//     if (paysValue === "Maroc") {
//       registerStore.setField("currency", "MAD");
//       registerStore.setField("vat", "20%");
//       registerStore.setField("ice", "");
//       registerStore.setField("siren", "");

//       setValue("siren", "");
//       setValue("ice", "");
//     } else {
//       registerStore.setField("currency", "");
//       registerStore.setField("vat", "");
//       registerStore.setField("ice", "");

//       setValue("vat", "");
//       setValue("ice", "");
//     }
//   }, [paysValue]);

//   const steps = [1, 2];
//   const onSubmit = async (data) => {
//     setSubmitting(true);

//     if (handleClientCreatedByAdmin) {
//       registerStore.generateTempPassword(registerStore.name);
//     }

//     const filledData = Object.fromEntries(
//       Object.entries(registerStore).filter(
//         ([key, value]) => value !== "" && value != null
//       )
//     );

//     try {
//       const response = await api.post(
//         `${import.meta.env.VITE_BACKEND_URL}/register`,
//         filledData
//       );

//       if (role === "admin") {
//         const tempPass = registerStore.tempPassword;
//         console.log("Temp password for email:", tempPass);

//         onClientCreated?.();
//         handleClientCreatedByAdmin?.(1);
//       } else {
//         navigate("/auth/login");
//       }
//     } catch (error) {
//       console.error("Registration failed:", error.response?.data);
//     } finally {
//       setSubmitting(false);
//     }
//   };
//   const handleNextStep = async () => {
//     if (currentStep === steps.length) return;

//     // Trigger validation for the fields that belong to the current step
//     const fieldsToValidate =
//       currentStep === 1
//         ? [
//             "client_type",
//             "name",
//             "email",
//             "password",
//             "password_confirmation",
//             "phone",
//             "company",
//           ]
//         : ["address", "zip", "city", "country"];

//     const isStepValid = await trigger(fieldsToValidate);

//     if (!isStepValid) {
//       return;
//     }

//     setCurrentStep((prev) => prev + 1);
//   };

//   const handlePrevStep = () => {
//     if (currentStep === 1) return;
//     setCurrentStep((prev) => prev - 1);
//   };
//   useEffect(() => {
//     registerStore.setField("user_type", "client");
//   }, []);

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-6 max-w-3xl mx-auto p-4 text-foreground"
//     >
//       {/* Stepper Header */}
//       <div className="mx-auto max-w-xl space-y-8 text-center">
//         <TheStepper
//           currentStep={currentStep}
//           setCurrentStep={setCurrentStep}
//           isLoading={isLoading}
//         />
//       </div>

//       {/* STEP 1 */}
//       {currentStep === 1 && (
//         <>
//           <FormSection title="Informations du client">
//             <Controller
//               name="client_type"
//               control={control}
//               rules={{
//                 required: "Le type de client est requise",
//               }}
//               render={({ field }) => (
//                 <ClientTypeRadio
//                   value={field.value}
//                   onChange={(value) => {
//                     field.onChange(value);
//                     registerStore.setField("client_type", value);
//                   }}
//                   error={errors.client_type?.message}
//                 />
//               )}
//             />

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Controller
//                 name="name"
//                 control={control}
//                 rules={{ required: "Le nom est requis" }}
//                 render={({ field }) => (
//                   <FormField
//                     id="name"
//                     label="Nom complet"
//                     value={field.value}
//                     onChange={(e) => {
//                       field.onChange(e.target.value);
//                       registerStore.setField("name", e.target.value);
//                     }}
//                     error={errors.name?.message}
//                   />
//                 )}
//               />

//               <Controller
//                 name="company"
//                 control={control}
//                 rules={{ required: "Le nom est requis" }}
//                 render={({ field }) => (
//                   <FormField
//                     id="company"
//                     label="Nom de l'entreprise"
//                     value={field.value}
//                     onChange={(e) => {
//                       field.onChange(e.target.value);
//                       registerStore.setField("company", e.target.value);
//                     }}
//                     error={errors.company?.message}
//                   />
//                 )}
//               />
//             </div>

//             {/* Email + Téléphone */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Controller
//                 name="email"
//                 control={control}
//                 rules={{
//                   required: "L'email est requis",
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: "Adresse email invalide",
//                   },
//                 }}
//                 render={({ field }) => (
//                   <FormField
//                     id="email"
//                     type="email"
//                     label="Adresse email"
//                     value={field.value}
//                     onChange={(e) => {
//                       field.onChange(e.target.value);
//                       registerStore.setField("email", e.target.value);
//                     }}
//                     error={errors.email?.message}
//                   />
//                 )}
//               />

//               <Controller
//                 name="phone"
//                 control={control}
//                 rules={{ required: "Téléphone est requis" }}
//                 render={({ field }) => (
//                   <FormField
//                     id="phone"
//                     label="Téléphone"
//                     value={field.value}
//                     onChange={(e) => {
//                       field.onChange(e.target.value);
//                       registerStore.setField("phone", e.target.value);
//                     }}
//                     error={errors.phone?.message}
//                   />
//                 )}
//               />
//             </div>
//             {!handleClientCreatedByAdmin && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Controller
//                   name="password"
//                   control={control}
//                   rules={{
//                     required: "Le mot de passe est requis",
//                     minLength: { value: 6, message: "Minimum 6 caractères" },
//                   }}
//                   render={({ field }) => (
//                     <FormField
//                       id="password"
//                       type="password"
//                       label="Mot de passe"
//                       value={field.value}
//                       onChange={(e) => {
//                         field.onChange(e.target.value);
//                         registerStore.setField("password", e.target.value);
//                       }}
//                       error={errors.password?.message}
//                     />
//                   )}
//                 />

//                 <Controller
//                   name="password_confirmation"
//                   control={control}
//                   rules={{
//                     required: "La confirmation est requise",
//                     validate: (val) =>
//                       val === watch("password") ||
//                       "Les mots de passe ne correspondent pas",
//                   }}
//                   render={({ field }) => (
//                     <FormField
//                       id="password_confirmation"
//                       type="password"
//                       label="Confirmer le mot de passe"
//                       value={field.value}
//                       onChange={(e) => {
//                         field.onChange(e.target.value);
//                         registerStore.setField(
//                           "password_confirmation",
//                           e.target.value
//                         );
//                       }}
//                       error={errors.password_confirmation?.message}
//                     />
//                   )}
//                 />
//               </div>
//             )}
//           </FormSection>

//           <div className="flex justify-end">
//             <Button
//               type="button"
//               onClick={handleNextStep}
//               className="w-full md:w-auto bg-primary hover:bg-[color-mix(in oklch,var(--primary)80%,black)] text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors mt-8"
//             >
//               Suivant
//             </Button>
//           </div>
//         </>
//       )}

//       {/* STEP 2 */}
//       {currentStep === 2 && (
//         <>
//           <FormSection title="Adresse et Informations">
//             {/* Adresse + Zip */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Controller
//                 name="address"
//                 control={control}
//                 rules={{
//                   required: "La confirmation est requise",
//                 }}
//                 render={({ field, fieldState: { error } }) => (
//                   <FormField
//                     id="address"
//                     label="Adresse"
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       registerStore.setField("address", e.target.value);
//                     }}
//                     error={error?.message}
//                   />
//                 )}
//               />

//               <Controller
//                 name="zip"
//                 control={control}
//                 rules={{
//                   required: "La confirmation est requise",
//                 }}
//                 render={({ field, fieldState: { error } }) => (
//                   <FormField
//                     id="zip"
//                     label="Code postal"
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       registerStore.setField("zip", e.target.value);
//                     }}
//                     error={error?.message}
//                   />
//                 )}
//               />
//             </div>

//             {/* Ville + Pays */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Controller
//                 name="city"
//                 control={control}
//                 rules={{
//                   required: "La confirmation est requise",
//                 }}
//                 render={({ field, fieldState: { error } }) => (
//                   <FormField
//                     id="city"
//                     label="Ville"
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       registerStore.setField("city", e.target.value);
//                     }}
//                     error={error?.message}
//                   />
//                 )}
//               />

//               <Controller
//                 name="country"
//                 control={control}
//                 rules={{
//                   required: "La confirmation est requise",
//                 }}
//                 render={({ field, fieldState: { error } }) => (
//                   <CountrySelect
//                     id="country"
//                     {...field}
//                     onChange={(value) => {
//                       field.onChange(value);
//                       registerStore.setField("country", value);
//                     }}
//                     error={errors.country?.message}
//                   />
//                 )}
//               />
//             </div>

//             {/* Conditional fields for company */}
//             {typeClientValue === "company" && (
//               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {paysValue === "Maroc" ? (
//                   <>
//                     <Controller
//                       name="ice"
//                       control={control}
//                       rules={{
//                         required: "La confirmation est requise",
//                       }}
//                       render={({ field, fieldState: { error } }) => (
//                         <FormField
//                           id="ice"
//                           label="ICE"
//                           {...field}
//                           onChange={(e) => {
//                             field.onChange(e);
//                             registerStore.setField("ice", e.target.value);
//                           }}
//                           error={error?.message}
//                         />
//                       )}
//                     />

//                     {/* VAT - read only */}
//                     <FormField
//                       id="vat"
//                       label="TVA"
//                       value={registerStore.vat}
//                       disabled
//                       readOnly
//                     />

//                     {/* Currency - disabled */}
//                     <CurrencySelect value="MAD" disabled readOnly />
//                   </>
//                 ) : (
//                   <>
//                     <Controller
//                       name="siren"
//                       control={control}
//                       rules={{
//                         required: "La confirmation est requise",
//                       }}
//                       render={({ field, fieldState: { error } }) => (
//                         <FormField
//                           id="siren"
//                           label="SIREN"
//                           {...field}
//                           onChange={(e) => {
//                             field.onChange(e);
//                             registerStore.setField("siren", e.target.value);
//                           }}
//                           error={error?.message}
//                         />
//                       )}
//                     />

//                     <Controller
//                       name="currency"
//                       control={control}
//                       rules={{
//                         required: "La confirmation est requise",
//                       }}
//                       render={({ field }) => (
//                         <CurrencySelect
//                           {...field}
//                           value={field.value}
//                           onChange={field.onChange}
//                           error={errors.currency?.message}
//                         />
//                       )}
//                     />
//                   </>
//                 )}
//               </div>
//             )}
//           </FormSection>
//           <div className="flex justify-between mt-8">
//             <Button
//               type="button"
//               onClick={handlePrevStep}
//               variant="outline"
//               className="w-full md:w-auto"
//             >
//               Précédent
//             </Button>
//             <Button
//               type="submit"
//               disabled={submitting}
//               className="w-full md:w-auto bg-primary hover:bg-[color-mix(in oklch,var(--primary)80%,black)] text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors"
//             >
//               {submitting ? "Inscription en cours..." : "S'inscrire"}
//             </Button>
//           </div>
//         </>
//       )}
//     </form>
//   );
// }
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";

import TheStepper from "@/Components/comp-517";
import FormSection from "@/Components/Form/FormSection";
import FormField from "@/Components/Form/FormField";
import CountrySelect from "@/Components/Form/CountrySelect";
import CurrencySelect from "@/Components/Form/CurrencySelect";
import ClientTypeRadio from "@/Components/Form/ClientTypeRadio";
import { Controller, useForm } from "react-hook-form";
import { useRegisterStore } from "@/hooks/registerStore";
import { useNavigate } from "react-router-dom";
import api from "@/lib/utils/axios";
import { useAuthContext } from "@/hooks/AuthContext";

export function ClientForm({ onClientCreated, handleClientCreatedByAdmin }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { role } = useAuthContext();
  const registerStore = useRegisterStore();

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: registerStore,
  });

  const typeClientValue = watch("client_type");
  const paysValue = watch("country");

  const handleChange = (field, value) => setValue(field, value);

  useEffect(() => {
    if (paysValue === "Maroc") {
      registerStore.setField("currency", "MAD");
      registerStore.setField("vat", "20%");
      registerStore.setField("ice", "");
      registerStore.setField("siren", "");

      setValue("siren", "");
      setValue("ice", "");
    } else {
      registerStore.setField("currency", "");
      registerStore.setField("vat", "");
      registerStore.setField("ice", "");

      setValue("vat", "");
      setValue("ice", "");
    }
  }, [paysValue]);

  const steps = [1, 2];

  const onSubmit = async (data) => {
    setSubmitting(true);

    let tempPassword = "";

    // Generate temp password only if admin is creating the client
    if (handleClientCreatedByAdmin) {
      const year = new Date().getFullYear();
      tempPassword = registerStore.name
        ? `${registerStore.name.trim().toLowerCase().replace(/\s+/g, "")}${year}`
        : "";

      console.log("🔐 Temp password generated:", tempPassword);
    }

    // Define all valid data fields (exclude methods and internal fields)
    const validFields = [
      "user_type",
      "name",
      "email",
      "password",
      "password_confirmation",
      "position",
      "department",
      "specialty",
      "linkedin",
      "portfolio",
      "github",
      "start_date",
      "end_date",
      "description",
      "tags",
      "resume",
      "company",
      "address",
      "zip",
      "phone",
      "city",
      "country",
      "client_type",
      "vat",
      "siren",
      "ice",
      "currency",
    ];

    const filledData = validFields.reduce((acc, field) => {
      const value = registerStore[field];
      if (value !== "" && value != null) {
        acc[field] = value;
      }
      return acc;
    }, {});

    if (handleClientCreatedByAdmin && tempPassword) {
      filledData.password = tempPassword;
      filledData.password_confirmation = tempPassword;
    }

    console.log("📤 Data being sent to backend:", filledData);

    try {
      const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        filledData
      );

      if (role === "admin") {
        onClientCreated?.();
        handleClientCreatedByAdmin?.(response?.data?.client_id);
        registerStore.reset();
      } else {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === steps.length) return;

    // Fields to validate based on whether admin is creating or normal signup
    const step1Fields = handleClientCreatedByAdmin
      ? ["client_type", "name", "email", "phone", "company"]
      : [
          "client_type",
          "name",
          "email",
          "password",
          "password_confirmation",
          "phone",
          "company",
        ];

    const fieldsToValidate =
      currentStep === 1 ? step1Fields : ["address", "zip", "city", "country"];

    const isStepValid = await trigger(fieldsToValidate);

    if (!isStepValid) {
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep === 1) return;
    setCurrentStep((prev) => prev - 1);
  };

  useEffect(() => {
    registerStore.setField("user_type", "client");
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-3xl mx-auto p-4 text-foreground"
    >
      {/* Stepper Header */}
      <div className="mx-auto max-w-xl space-y-8 text-center">
        <TheStepper
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isLoading={isLoading}
        />
      </div>

      {/* STEP 1 */}
      {currentStep === 1 && (
        <>
          <FormSection title="Informations du client">
            <Controller
              name="client_type"
              control={control}
              rules={{
                required: "Le type de client est requise",
              }}
              render={({ field }) => (
                <ClientTypeRadio
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    registerStore.setField("client_type", value);
                  }}
                  error={errors.client_type?.message}
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Le nom est requis" }}
                render={({ field }) => (
                  <FormField
                    id="name"
                    label="Nom complet"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      registerStore.setField("name", e.target.value);
                    }}
                    error={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="company"
                control={control}
                rules={{ required: "Le nom est requis" }}
                render={({ field }) => (
                  <FormField
                    id="company"
                    label="Nom de l'entreprise"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      registerStore.setField("company", e.target.value);
                    }}
                    error={errors.company?.message}
                  />
                )}
              />
            </div>

            {/* Email + Téléphone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "L'email est requis",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Adresse email invalide",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    id="email"
                    type="email"
                    label="Adresse email"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      registerStore.setField("email", e.target.value);
                    }}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                rules={{ required: "Téléphone est requis" }}
                render={({ field }) => (
                  <FormField
                    id="phone"
                    label="Téléphone"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      registerStore.setField("phone", e.target.value);
                    }}
                    error={errors.phone?.message}
                  />
                )}
              />
            </div>

            {/* Password fields - only show for normal client signup */}
            {!handleClientCreatedByAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Le mot de passe est requis",
                    minLength: { value: 6, message: "Minimum 6 caractères" },
                  }}
                  render={({ field }) => (
                    <FormField
                      id="password"
                      type="password"
                      label="Mot de passe"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        registerStore.setField("password", e.target.value);
                      }}
                      error={errors.password?.message}
                    />
                  )}
                />

                <Controller
                  name="password_confirmation"
                  control={control}
                  rules={{
                    required: "La confirmation est requise",
                    validate: (val) =>
                      val === watch("password") ||
                      "Les mots de passe ne correspondent pas",
                  }}
                  render={({ field }) => (
                    <FormField
                      id="password_confirmation"
                      type="password"
                      label="Confirmer le mot de passe"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        registerStore.setField(
                          "password_confirmation",
                          e.target.value
                        );
                      }}
                      error={errors.password_confirmation?.message}
                    />
                  )}
                />
              </div>
            )}
          </FormSection>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full md:w-auto bg-primary hover:bg-[color-mix(in oklch,var(--primary)80%,black)] text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors mt-8"
            >
              Suivant
            </Button>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <>
          <FormSection title="Adresse et Informations">
            {/* Adresse + Zip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="address"
                control={control}
                rules={{
                  required: "L'adresse est requise",
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormField
                    id="address"
                    label="Adresse"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      registerStore.setField("address", e.target.value);
                    }}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                name="zip"
                control={control}
                rules={{
                  required: "Le code postal est requis",
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormField
                    id="zip"
                    label="Code postal"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      registerStore.setField("zip", e.target.value);
                    }}
                    error={error?.message}
                  />
                )}
              />
            </div>

            {/* Ville + Pays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="city"
                control={control}
                rules={{
                  required: "La ville est requise",
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormField
                    id="city"
                    label="Ville"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      registerStore.setField("city", e.target.value);
                    }}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                name="country"
                control={control}
                rules={{
                  required: "Le pays est requis",
                }}
                render={({ field, fieldState: { error } }) => (
                  <CountrySelect
                    id="country"
                    {...field}
                    onChange={(value) => {
                      field.onChange(value);
                      registerStore.setField("country", value);
                    }}
                    error={errors.country?.message}
                  />
                )}
              />
            </div>

            {/* Conditional fields for company */}
            {typeClientValue === "company" && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {paysValue === "Maroc" ? (
                  <>
                    <Controller
                      name="ice"
                      control={control}
                      rules={{
                        required: "L'ICE est requis",
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <FormField
                          id="ice"
                          label="ICE"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            registerStore.setField("ice", e.target.value);
                          }}
                          error={error?.message}
                        />
                      )}
                    />

                    {/* VAT - read only */}
                    <FormField
                      id="vat"
                      label="TVA"
                      value={registerStore.vat}
                      disabled
                      readOnly
                    />

                    {/* Currency - disabled */}
                    <CurrencySelect value="MAD" disabled readOnly />
                  </>
                ) : (
                  <>
                    <Controller
                      name="siren"
                      control={control}
                      rules={{
                        required: "Le SIREN est requis",
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <FormField
                          id="siren"
                          label="SIREN"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            registerStore.setField("siren", e.target.value);
                          }}
                          error={error?.message}
                        />
                      )}
                    />

                    <Controller
                      name="currency"
                      control={control}
                      rules={{
                        required: "La devise est requise",
                      }}
                      render={({ field }) => (
                        <CurrencySelect
                          {...field}
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.currency?.message}
                        />
                      )}
                    />
                  </>
                )}
              </div>
            )}
          </FormSection>
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={handlePrevStep}
              variant="outline"
              className="w-full md:w-auto"
            >
              Précédent
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto bg-primary hover:bg-[color-mix(in oklch,var(--primary)80%,black)] text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {submitting ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
