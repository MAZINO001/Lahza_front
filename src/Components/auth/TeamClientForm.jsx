import { Tabs, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import FormSection from "../Form/FormSection";
import FormField from "../Form/FormField";
import SelectField from "../Form/SelectField";
import TextareaField from "../Form/TextareaField";
import RoleTabs from "../Form/RoleTabs";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import CVUploader from "../Form/CVUploader";
import TagsField from "../Form/TagsField";
import { useRegisterStore } from "@/hooks/registerStore";
import { useNavigate } from "react-router-dom";
import DateField from "../Form/DateField";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { toast } from "sonner";

export function TeamClientForm() {
  const navigate = useNavigate();
  const registerStore = useRegisterStore();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: registerStore,
  });
  const theRole = watch("user_type");

  const onSubmit = async (data) => {
    const filledData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != null && v !== ""),
    );

    try {
      const formData = new FormData();
      Object.entries(filledData).forEach(([key, value]) => {
        if (key === "cv" && value instanceof FileList && value.length > 0) {
          formData.append("cv", value[0]);
        } else if (key === "tags" && Array.isArray(value)) {
          value.forEach((tag, i) => formData.append(`tags[${i}]`, tag));
        } else {
          formData.append(key, value);
        }
      });

      await registerMutation.mutateAsync(formData);

      navigate("/auth/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-3xl mx-auto p-4 text-foreground"
    >
      <Tabs
        value={theRole}
        onValueChange={(val) => {
          registerStore.reset();
          reset({ ...useRegisterStore.getState(), user_type: val });
          registerStore.setField("user_type", val);
        }}
        className="w-full"
      >
        <RoleTabs />

        {/* ==================== ACCOUNT INFO ==================== */}
        <FormSection title="Account Information">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <FormField
                id="name"
                label="Full Name"
                placeholder="Enter your name"
                error={errors.name?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <FormField
                id="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...field}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              }}
              render={({ field }) => (
                <FormField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="password_confirmation"
              control={control}
              rules={{
                required: "Password confirmation is required",
                validate: (val) =>
                  val === watch("password") ||
                  "Passwords do not match",
              }}
              render={({ field }) => (
                <FormField
                  id="password_confirmation"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  error={errors.password_confirmation?.message}
                  {...field}
                />
              )}
            />
          </div>
        </FormSection>
        {/* ==================== TEAM TAB ==================== */}
        <TabsContent value="team">
          <FormSection title="Team Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="poste"
                control={control}
                rules={{ required: "Position is required" }}
                render={({ field }) => (
                  <SelectField
                    id="poste"
                    label="Role / Position"
                    value={field.value || ""}
                    onChange={(val) => {
                      field.onChange(val);
                      registerStore.setField("poste", val);
                    }}
                    error={errors.poste?.message}
                    options={[
                      {
                        value: "Informatique",
                        label: "Informatique / Technique",
                      },
                      { value: "Marketing", label: "Marketing" },
                      { value: "RH", label: "Ressources Humaines" },
                      { value: "Ventes", label: "Ventes" },
                      { value: "Support", label: "Support" },
                    ]}
                  />
                )}
              />

              <Controller
                name="department"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <SelectField
                    id="department"
                    label="Department"
                    value={field.value || ""}
                    onChange={(val) => {
                      field.onChange(val);
                      registerStore.setField("department", val);
                    }}
                    error={errors.department?.message}
                    options={[
                      {
                        value: "Informatique",
                        label: "Informatique / Technique",
                      },
                      { value: "Marketing", label: "Marketing" },
                      { value: "RH", label: "Ressources Humaines" },
                      { value: "Ventes", label: "Ventes" },
                      { value: "Support", label: "Support" },
                    ]}
                  />
                )}
              />
            </div>
          </FormSection>
        </TabsContent>

        {/* ==================== INTERN TAB ==================== */}
        <TabsContent value="intern">
          <FormSection title="Internship Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="start_date"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  // <FormField
                  <DateField
                    id="start_date"
                    label="Start Date"
                    type="date"
                    error={errors.start_date?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="end_date"
                control={control}
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  // <FormField
                  <DateField
                    id="end_date"
                    label="End Date"
                    type="date"
                    error={errors.end_date?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="department"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <SelectField
                    id="department"
                    label="Department"
                    value={field.value || ""}
                    onChange={(val) => {
                      field.onChange(val);
                      registerStore.setField("department", val);
                    }}
                    error={errors.department?.message}
                    options={[
                      {
                        value: "Informatique",
                        label: "Informatique / Technique",
                      },
                      { value: "Marketing", label: "Marketing" },
                      { value: "RH", label: "Ressources Humaines" },
                      { value: "Ventes", label: "Ventes" },
                      { value: "Support", label: "Support" },
                    ]}
                  />
                )}
              />

              <Controller
                name="linkedin"
                control={control}
                rules={{
                  pattern: {
                    value:
                      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
                    message:
                      "Invalid LinkedIn format (ex: www.linkedin.com/in/username)",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    id="linkedin"
                    label="LinkedIn"
                    error={errors.linkedin?.message}
                    placeholder="Enter your linkedIn profile link"
                    {...field}
                  />
                )}
              />

              <Controller
                name="portfolio"
                control={control}
                render={({ field }) => (
                  <FormField
                    id="portfolio"
                    label="Portfolio"
                    placeholder="Enter your portfolio profile link"
                    error={errors.portfolio?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="github"
                control={control}
                rules={{
                  pattern: {
                    value: /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/?$/,
                    message:
                      "Invalid GitHub format (ex: https://github.com/username)",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    id="github"
                    label="GitHub"
                    error={errors.github?.message}
                    placeholder="Enter your github profile link"
                    {...field}
                  />
                )}
              />
            </div>

            <Controller
              name="cv"
              control={control}
              rules={{ required: "CV required for intern" }}
              render={({ field }) => (
                <CVUploader
                  onChange={(file) => {
                    field.onChange(file); // This updates react-hook-form
                    registerStore.setField("cv", file);
                  }}
                  value={field.value} // Pass the value too
                  error={errors.cv?.message}
                />
              )}
            />
          </FormSection>
        </TabsContent>

        {/* ==================== OTHER TAB ==================== */}
        <TabsContent value="other">
          <FormSection title="Other Details">
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TagsField
                  id="tags"
                  label="Tags"
                  value={field.value || []}
                  onChange={(newTags) => {
                    field.onChange(newTags);
                    registerStore.setField("tags", newTags);
                  }}
                  error={errors.tags?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextareaField
                  id="description"
                  label="Description"
                  {...register("description")}
                  error={errors.description?.message}
                  placeholder="Please provide a brief description of your role or needs."
                  {...field}
                />
              )}
            />
          </FormSection>
        </TabsContent>
      </Tabs>

      <Button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full bg-primary hover:bg-[color-mix(in oklch, var(--primary) 80%, black)] text-primary-foreground font-semibold py-6 rounded-lg transition-colors mt-8"
      >
        {registerMutation.isPending ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
