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
import { useTeams } from "../../hooks/useTeamsQuery";
import DateField from "@/components/Form/DateField";

export default function AdditionalTeamDetails() {
  const { user } = useAuthContext();
  const { role } = useAuthContext();
  const { data: teamsMembers } = useTeams();

  // Find current user's team member ID
  const currentUserTeamId = teamsMembers?.data?.find(
    (member) => member.user_id === user.id,
  )?.id;

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      team_user_id: currentUserTeamId || 1,
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
  const [showAddCert, setShowAddCert] = useState(false);

  // Watch the selected team member (only for admin)
  const selectedTeamMemberId = watch("team_user_id");
  const teamMemberId =
    role === "admin" ? selectedTeamMemberId : currentUserTeamId;

  const { data: existingData, isLoading } = useTeamAdditionalData(teamMemberId);
  console.log(existingData);

  const isEditMode = Array.isArray(existingData)
    ? existingData.length > 0
    : !!existingData;

  console.log(isEditMode);

  React.useEffect(() => {
    if (existingData && !isLoading) {
      reset({
        team_user_id: teamMemberId,
        bank_name: existingData?.bank_name || "",
        bank_account_number: existingData?.bank_account_number || "",
        iban: existingData?.iban || "",
        contract_type: existingData?.contract_type || "",
        contract_start_date: existingData?.contract_start_date || "",
        contract_end_date: existingData?.contract_end_date || "",
        contract_file: existingData?.contract_file || "",
        emergency_contact_name: existingData?.emergency_contact_name || "",
        emergency_contact_phone: existingData?.emergency_contact_phone || "",
        job_title: existingData?.job_title || "",
        salary: existingData?.salary || "",
        notes: existingData?.notes || "",
        portfolio: existingData?.portfolio || "",
        github: existingData?.github || "",
        linkedin: existingData?.linkedin || "",
        cv: existingData?.cv || "",
      });
    }
  }, [existingData, isLoading, reset, teamMemberId]);

  const createMutation = useCreateTeamAdditionalData();
  const updateMutation = useUpdateTeamAdditionalData();

  const onSubmit = (data) => {
    const submitData = {
      ...data,
      team_user_id: teamMemberId,
    };

    if (isEditMode) {
      updateMutation.mutate({ teamUserId: teamMemberId, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-8">
        {role === "admin" && (
          <div className="">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">
              Select Team Member
            </h3>
            <div className="space-y-2">
              <Controller
                name="team_user_id"
                control={control}
                rules={{
                  required: "Team member is required",
                }}
                render={({ field }) => (
                  <SelectField
                    label="Choose a team member"
                    id="team_user_id"
                    options={
                      teamsMembers?.data?.map((member) => ({
                        value: member.id,
                        label: member.user.name,
                      })) || []
                    }
                    placeholder="Select team member"
                    error={errors.team_user_id?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        )}

        <div className="">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            Bank Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            Contract Information
          </h3>
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
                    value={field.value}
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
                  // <FormField
                  <DateField
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
                  // <FormField
                  <DateField
                    {...field}
                    type="date"
                    label="End Date"
                    id="contract_end_date"
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
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            Emergency Contact Information
          </h3>
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
                    error={errors.emergency_contact_phone?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            Professional Information
          </h3>

          <div className="grid grid-cols-1 items-end md:grid-cols-2 gap-4">
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
                    error={errors.portfolio?.message}
                    {...field}
                  />
                )}
              />
            </div>

            <div className="space-y-2 ">
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
                    error={errors.github?.message}
                    {...field}
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
                    error={errors.linkedin?.message}
                    {...field}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="cv"
                control={control}
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
                  placeholder="Any additional information..."
                  error={errors.notes?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="flex gap-4">
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
