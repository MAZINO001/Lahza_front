import { useForm, Controller } from "react-hook-form";
import FormField from "@/components/Form/FormField";
import FileUploader from "@/components/Form/FileUploader";
import SelectField from "@/components/Form/SelectField";
import TextareaField from "@/components/Form/TextareaField";

export default function TeamUserForm() {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      team_user_id: "",
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
      certifications: "",
      notes: "",
      portfolio: "",
      github: "",
      linkedin: "",
      cv: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-semibold text-lg">Team Member Details</h1>
      <div className="space-y-8">
        <div className="space-y-2">
          <Controller
            name="team_user_id"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                type="text"
                label="Team User"
                id="team_user_id"
                placeholder="Select team user"
                error={errors.team_user_id?.message}
              />
            )}
          />
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Banking Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Controller
                name="bank_name"
                control={control}
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

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Contract Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Controller
                name="contract_type"
                control={control}
                render={({ field }) => (
                  <SelectField
                    id="contract_type"
                    label="Contract Type"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    error={errors.contract_type?.message}
                    options={[
                      { value: "CDI", label: "CDI" },
                      { value: "CDD", label: "CDD" },
                      { value: "Freelance", label: "Freelance" },
                      { value: "Intern", label: "Intern" },
                    ]}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="job_title"
                control={control}
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
                render={({ field }) => (
                  <FormField
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
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="number"
                    label="Salary"
                    id="salary"
                    placeholder="0.00"
                    step="0.01"
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
                    description="Upload your contract document"
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Controller
                name="emergency_contact_name"
                control={control}
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

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Professional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Controller
                name="portfolio"
                control={control}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="url"
                    label="Portfolio"
                    id="portfolio"
                    placeholder="https://..."
                    error={errors.portfolio?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="github"
                control={control}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="url"
                    label="GitHub"
                    id="github"
                    placeholder="https://github.com/..."
                    error={errors.github?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="linkedin"
                control={control}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="url"
                    label="LinkedIn"
                    id="linkedin"
                    placeholder="https://linkedin.com/..."
                    error={errors.linkedin?.message}
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
                    accept=".pdf,.doc,.docx"
                    description="Upload your curriculum vitae"
                  />
                )}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Controller
                name="certifications"
                control={control}
                render={({ field }) => (
                  <TextareaField
                    {...field}
                    label="Certifications"
                    id="certifications"
                    placeholder="List your certifications"
                    error={errors.certifications?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-2">
            <Controller
              name="notes"
              control={control}
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

        <div className="border-t pt-4 flex gap-4">
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-gray-200 text-foreground font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
