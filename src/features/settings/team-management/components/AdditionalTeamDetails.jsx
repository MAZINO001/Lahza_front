import { useForm, Controller } from "react-hook-form";
import React from "react";
import FormField from "@/components/Form/FormField";
import FileUploader from "@/components/Form/FileUploader";
import SelectField from "@/components/Form/SelectField";
import TextareaField from "@/components/Form/TextareaField";
import AddCertificationComp from "@/components/settings/addCertificationComp";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/AuthContext";
import {
  useCreateTeamAdditionalData,
  useUpdateTeamAdditionalData,
  useTeamAdditionalData,
} from "../../hooks/useTeamAdditionalDataQuery";

export default function AdditionalTeamDetails() {
  const [showAddCert, setShowAddCert] = useState(false);
  const { user } = useAuthContext();
  const { data: existingData, isLoading } = useTeamAdditionalData(user.id || 1);
  const isEditMode = !!existingData && !isLoading;

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      team_user_id: user.id || 1,
      bank_name: "",
      bank_account_number: "",
      iban: "",
      contract_type: "",
      contract_start_date: "",
      contract_end_date: "",
      contract_file: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      job_title: "",
      salary: "",
      certifications: null,
      notes: "",
      portfolio: "",
      github: "",
      linkedin: "",
      cv: "",
    },
  });

  React.useEffect(() => {
    if (existingData && !isLoading) {
      reset({
        bank_name: existingData?.bank_name,
        bank_account_number: existingData?.bank_account_number,
        iban: existingData?.iban,
        contract_type: existingData?.contract_type,
        contract_start_date: existingData?.contract_start_date,
        contract_end_date: existingData?.contract_end_date,
        contract_file: existingData?.contract_file,
        emergency_contact_name: existingData?.emergency_contact_name,
        emergency_contact_phone: existingData?.emergency_contact_phone,
        job_title: existingData?.job_title,
        salary: existingData?.salary,
        notes: existingData?.notes,
        portfolio: existingData?.portfolio, 
        github: existingData?.github, 
        linkedin: existingData?.linkedin, 
        cv: existingData?.cv,
      });
    }
  }, [existingData, isLoading, reset]);

  const createMutation = useCreateTeamAdditionalData();
  const updateMutation = useUpdateTeamAdditionalData();

  const onSubmit = (data) => {
    if (isEditMode) {
      console.log(data);
      updateMutation.mutate({ teamUserId: user.id || 1, data });
    } else {
      console.log(data);
      createMutation.mutate(data);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-semibold text-lg">Team Member Details</h1>
      <div className="space-y-8">
        <div className="">
          <h2 className="text-md font-semibold text-foreground mb-2">
            Banking Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Controller
                name="bank_name"
                control={control}
                rules={{
                  required: "Bank name is required",
                  minLength: {
                    value: 2,
                    message: "Bank name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Bank name cannot exceed 100 characters",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="text"
                    label="Bank Name"
                    id="bank_name"
                    placeholder="Bank name"
                    error={errors.bank_name?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="bank_account_number"
                control={control}
                rules={{
                  required: "Bank account number is required",
                  pattern: {
                    value: /^[0-9-\s]+$/,
                    message:
                      "Bank account number can only contain numbers, spaces, and hyphens",
                  },
                  minLength: {
                    value: 8,
                    message:
                      "Bank account number must be at least 8 characters",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="text"
                    label="Bank Account Number"
                    id="bank_account_number"
                    placeholder="Account number"
                    error={errors.bank_account_number?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Controller
                name="iban"
                control={control}
                rules={{
                  required: "IBAN is required",
                  pattern: {
                    value: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/i,
                    message: "Please enter a valid IBAN format",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="text"
                    label="IBAN"
                    id="iban"
                    placeholder="International Bank Account Number"
                    error={errors.iban?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="">
          <h2 className="text-md font-semibold text-foreground mb-2">
            Contract Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Controller
                name="contract_type"
                control={control}
                rules={{
                  required: "Contract type is required",
                }}
                render={({ field }) => (
                  <SelectField
                    id="contract_type"
                    label="Contract Type"
                    value={field.value || existingData?.existingData}
                    onChange={field.onChange}
                    options={[
                      { value: "CDI", label: "CDI" },
                      { value: "CDD", label: "CDD" },
                      { value: "Freelance", label: "Freelance" },
                      { value: "Intern", label: "Intern" },
                    ]}
                    error={errors.contract_type?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="job_title"
                control={control}
                rules={{
                  required: "Job title is required",
                  minLength: {
                    value: 2,
                    message: "Job title must be at least 2 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Job title cannot exceed 100 characters",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="text"
                    label="Job Title"
                    id="job_title"
                    placeholder="Job title"
                    error={errors.job_title?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="contract_start_date"
                control={control}
                rules={{
                  required: "Start date is required",
                }}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="date"
                    label="Start Date"
                    id="contract_start_date"
                    error={errors.contract_start_date?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="contract_end_date"
                control={control}
                rules={{
                  required: "End date is required",
                }}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="date"
                    label="End Date"
                    id="contract_end_date"
                    onChange={field.onChange}
                    error={errors.contract_end_date?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="salary"
                control={control}
                rules={{
                  required: "Salary is required",
                  min: {
                    value: 0,
                    message: "Salary cannot be negative",
                  },
                  max: {
                    value: 1000000,
                    message: "Salary cannot exceed 1,000,000",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="number"
                    label="Salary"
                    id="salary"
                    placeholder="0.00"
                    step="1"
                    min="0"
                    max="1000000"
                    onChange={field.onChange}
                    error={errors.salary?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="contract_file"
                control={control}
                render={({ field }) => (
                  <FileUploader
                    {...field}
                    label="Contract File"
                    id="contract_file"
                    accept=".pdf,.doc,.docx"
                    onChange={field.onChange}
                    description="Upload your contract document"
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="">
          <h2 className="text-md font-semibold text-foreground mb-2">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Controller
                name="emergency_contact_name"
                control={control}
                rules={{
                  required: "Emergency contact name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Name cannot exceed 100 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z\s\-']+$/,
                    message:
                      "Name can only contain letters, spaces, hyphens, and apostrophes",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="text"
                    label="Emergency Contact Name"
                    id="emergency_contact_name"
                    placeholder="Full name"
                    onChange={field.onChange}
                    error={errors.emergency_contact_name?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="emergency_contact_phone"
                control={control}
                rules={{
                  required: "Emergency contact phone is required",
                  pattern: {
                    value: /^(?=(?:.*\d){10,})[+]?[\d\s\-()]+$/,
                    message: "Please enter a valid phone number",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="tel"
                    label="Emergency Contact Phone"
                    id="emergency_contact_phone"
                    placeholder="Phone number"
                    onChange={field.onChange}
                    error={errors.emergency_contact_phone?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="">
          <h2 className="text-md font-semibold text-foreground mb-2">
            Professional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Controller
                name="portfolio"
                control={control}
                rules={{
                  pattern: {
                    value: /^https?:\/\/.+$/,
                    message:
                      "Please enter a valid URL starting with http:// or https://",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    type="url"
                    label="Portfolio"
                    id="portfolio"
                    placeholder="https://..."
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    error={errors.portfolio?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="github"
                control={control}
                rules={{
                  pattern: {
                    value: /^https?:\/\/(www\.)?github\.com\/.+$/,
                    message: "Please enter a valid GitHub URL",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    type="url"
                    label="GitHub"
                    id="github"
                    placeholder="https://github.com/..."
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    error={errors.github?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="linkedin"
                control={control}
                rules={{
                  pattern: {
                    value: /^https?:\/\/(www\.)?linkedin\.com\/.+$/,
                    message: "Please enter a valid LinkedIn URL",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    type="url"
                    label="LinkedIn"
                    id="linkedin"
                    placeholder="https://linkedin.com/..."
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    error={errors.linkedin?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="cv"
                control={control}
                // rules={{
                //   required: "CV is required",
                // }}
                render={({ field }) => (
                  <FileUploader
                    {...field}
                    label="CV"
                    id="cv"
                    onChange={field.onChange}
                    accept=".pdf,.doc,.docx"
                    error={errors.cv?.message}
                    description="Upload your curriculum vitae"
                  />
                )}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Button
                type="button"
                onClick={() => setShowAddCert((prev) => !prev)}
              >
                Add Certification
              </Button>

              {showAddCert && <AddCertificationComp />}
            </div>
          </div>
        </div>

        <div className="">
          <div className="space-y-2">
            <Controller
              name="notes"
              control={control}
              rules={{
                maxLength: {
                  value: 500,
                  message: "Notes cannot exceed 500 characters",
                },
              }}
              render={({ field }) => (
                <TextareaField
                  {...field}
                  label="Additional Notes"
                  id="notes"
                  onChange={field.onChange}
                  placeholder="Any additional information..."
                  error={errors.notes?.message}
                />
              )}
            />
          </div>
        </div>

        <div className=" flex gap-4">
          <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : isEditMode
                ? "Update Changes"
                : "Create Details"}
          </Button>
          <Button
            variant="outline"
            onClick={() => reset()}
            disabled={isLoading}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
