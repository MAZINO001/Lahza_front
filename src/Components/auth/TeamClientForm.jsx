import { Tabs, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import FormSection from "../Form/FormSection";
import FormField from "../Form/FormField";
import SelectField from "../Form/SelectField";
import TextareaField from "../Form/TextareaField";
import RoleTabs from "../Form/RoleTabs";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import CVUploader from "../Form/CVUploader";
import TagsField from "../Form/TagsField";
import { useRegisterStore } from "@/hooks/registerStore";
import { useNavigate } from "react-router-dom";
import DateField from "../Form/DateField";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function TeamClientForm() {
  const { t } = useTranslation();
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

      toast.info(t("client_form.check_email_toast"));
      navigate("/auth/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data);
      toast.error(error.response?.data?.message || t("client_form.registration_failed"));
    }
  };



  useEffect(() => {
    if (!["team", "intern", "other"].includes(registerStore.user_type)) {
      registerStore.setField("user_type", "team");
      reset({ ...registerStore, user_type: "team" });
    }
  }, []);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full p-4 text-foreground"
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
        <FormSection title={t("team_client_form.section_account_info")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: t("validation.name_required") }}
            render={({ field }) => (
              <FormField
                id="name"
                label={t("client_form.full_name")}
                placeholder={t("team_client_form.name_placeholder")}
                error={errors.name?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: t("validation.email_required"),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t("validation.email_invalid"),
              },
            }}
            render={({ field }) => (
              <FormField
              id="email"
                label={t("client_form.email_address")}
                type="email"
                placeholder={t("team_client_form.email_placeholder")}
                error={errors.email?.message}
                {...field}
                />
              )}
              />
              </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="password"
              control={control}
              rules={{
                required: t("validation.password_required"),
                minLength: { value: 6, message: t("validation.password_min_length") },
              }}
              render={({ field }) => (
                <FormField
                  id="password"
                  label={t("client_form.password")}
                  type="password"
                  placeholder={t("team_client_form.password_placeholder")}
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="password_confirmation"
              control={control}
              rules={{
                required: t("validation.password_confirmation_required"),
                validate: (val) =>
                  val === watch("password") || t("validation.passwords_no_match"),
              }}
              render={({ field }) => (
                <FormField
                  id="password_confirmation"
                  label={t("client_form.confirm_password")}
                  type="password"
                  placeholder={t("team_client_form.confirm_password_placeholder")}
                  error={errors.password_confirmation?.message}
                  {...field}
                />
              )}
            />
          </div>
        </FormSection>
        {/* ==================== TEAM TAB ==================== */}
        <TabsContent value="team">
          <FormSection title={t("team_client_form.section_team_details")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="poste"
                control={control}
                rules={{ required: t("validation.position_required") }}
                render={({ field }) => (
                  <SelectField
                    id="poste"
                    label={t("team_client_form.role_position")}
                    value={field.value || ""}
                    onChange={(val) => {
                      field.onChange(val);
                      registerStore.setField("poste", val);
                    }}
                    error={errors.poste?.message}
                    options={[
                      { value: "Informatique", label: t("team_client_form.option_it") },
                      { value: "Marketing", label: t("team_client_form.option_marketing") },
                      { value: "RH", label: t("team_client_form.option_hr") },
                      { value: "Ventes", label: t("team_client_form.option_sales") },
                      { value: "Support", label: t("team_client_form.option_support") },
                    ]}
                  />
                )}
              />

              <Controller
                name="department"
                control={control}
                rules={{ required: t("validation.department_required") }}
                render={({ field }) => (
                  <SelectField
                    id="department"
                    label={t("team_client_form.department")}
                    value={field.value || ""}
                    onChange={(val) => {
                      field.onChange(val);
                      registerStore.setField("department", val);
                    }}
                    error={errors.department?.message}
                    options={[
                      { value: "Informatique", label: t("team_client_form.option_it") },
                      { value: "Marketing", label: t("team_client_form.option_marketing") },
                      { value: "RH", label: t("team_client_form.option_hr") },
                      { value: "Ventes", label: t("team_client_form.option_sales") },
                      { value: "Support", label: t("team_client_form.option_support") },
                    ]}
                  />
                )}
              />
            </div>
          </FormSection>
        </TabsContent>

        {/* ==================== INTERN TAB ==================== */}
        <TabsContent value="intern">
          <FormSection title={t("team_client_form.section_internship_details")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="start_date"
                control={control}
                rules={{ required: t("validation.start_date_required") }}
                render={({ field }) => (
                  // <FormField
                  <DateField
                    id="start_date"
                    label={t("team_client_form.start_date")}
                    type="date"
                    error={errors.start_date?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="end_date"
                control={control}
                rules={{ required: t("validation.end_date_required") }}
                render={({ field }) => (
                  // <FormField
                  <DateField
                    id="end_date"
                    label={t("team_client_form.end_date")}
                    type="date"
                    error={errors.end_date?.message}
                    {...field}
                  />
                )}
              />


<div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              <Controller
                name="department"
                control={control}
                rules={{ required: t("validation.department_required") }}
                render={({ field }) => (
                  <SelectField
                    id="department"
                    label={t("team_client_form.department")}
                    value={field.value || ""}
                    onChange={(val) => {
                      field.onChange(val);
                      registerStore.setField("department", val);
                    }}
                    error={errors.department?.message}
                    options={[
                      { value: "Informatique", label: t("team_client_form.option_it") },
                      { value: "Marketing", label: t("team_client_form.option_marketing") },
                      { value: "RH", label: t("team_client_form.option_hr") },
                      { value: "Ventes", label: t("team_client_form.option_sales") },
                      { value: "Support", label: t("team_client_form.option_support") },
                    ]}
                  />
                )}
              />
                            <Controller
                name="specialty"
                control={control}
                render={({ field }) => (
                  <FormField
                    id="specialty"
                    label={t("team_client_form.specialty")}
                    error={errors.linkedin?.message}
                    placeholder={t("team_client_form.specialty_placeholder")}
                    {...field}
                  />
                )}
              />


                    </div>

              <Controller
                name="linkedin"
                control={control}
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
                    label={t("team_client_form.portfolio")}
                    placeholder={t("team_client_form.portfolio_placeholder")}
                    error={errors.portfolio?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="github"
                control={control}
                render={({ field }) => (
                  <FormField
                    id="github"
                    label={t("team_client_form.github")}
                    error={errors.github?.message}
                    placeholder={t("team_client_form.github_placeholder")}
                    {...field}
                  />
                )}
              />
            </div>

            <Controller
              name="cv"
              control={control}
              rules={{ required: t("validation.cv_required_intern") }}
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
          <FormSection title={t("team_client_form.section_other_details")}>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TagsField
                  id="tags"
                  label={t("team_client_form.tags")}
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
                  label={t("team_client_form.description")}
                  {...register("description")}
                  error={errors.description?.message}
                  placeholder={t("team_client_form.description_placeholder")}
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
        className="w-[120px] float-right bg-primary font-semibold py-4 rounded-lg transition-colors mt-4"
      >
        {registerMutation.isPending ? t("client_form.registering") : t("client_form.register_btn")}
      </Button>
    </form>
  );
}
