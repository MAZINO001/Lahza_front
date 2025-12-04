/* eslint-disable no-unused-vars */
import { Tabs, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import FormSection from "../Form/FormSection";
import FormField from "../Form/FormField";
import SelectField from "../Form/SelectField";
import TextareaField from "../Form/TextareaField";
import RoleTabs from "../Form/RoleTabs";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import FileUploader from "../Form/FileUploader";
import TagsField from "../Form/TagsField";
import api from "@/lib/utils/axios";
import { useRegisterStore } from "@/hooks/registerStore";
import { useNavigate } from "react-router-dom";

export function TeamClientForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const registerStore = useRegisterStore();

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
    setSubmitting(true);

    const filledData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != null && v !== "")
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

      await api.post(`${import.meta.env.VITE_BACKEND_URL}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/auth/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data);
    } finally {
      setSubmitting(false);
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
        <FormSection title="Informations du compte">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Le nom est requis" }}
            render={({ field }) => (
              <FormField
                id="name"
                label="Nom complet"
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
              required: "L'email est requis",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Adresse email invalide",
              },
            }}
            render={({ field }) => (
              <FormField
                id="email"
                label="Adresse email"
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
                required: "Le mot de passe est requis",
                minLength: { value: 6, message: "Minimum 6 caractères" },
              }}
              render={({ field }) => (
                <FormField
                  id="password"
                  label="Mot de passe"
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
                required: "La confirmation est requise",
                validate: (val) =>
                  val === watch("password") ||
                  "Les mots de passe ne correspondent pas",
              }}
              render={({ field }) => (
                <FormField
                  id="password_confirmation"
                  label="Confirmer le mot de passe"
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
          <FormSection title="Détails de l'équipe">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="poste"
                control={control}
                rules={{ required: "Le poste est requis" }}
                render={({ field }) => (
                  <SelectField
                    id="poste"
                    label="Rôle / Poste"
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
                rules={{ required: "Le département est requis" }}
                render={({ field }) => (
                  <SelectField
                    id="department"
                    label="Département"
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
          <FormSection title="Détails du stage">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="start_date"
                control={control}
                rules={{ required: "Date de début requise" }}
                render={({ field }) => (
                  <FormField
                    id="start_date"
                    label="Date de début"
                    type="date"
                    error={errors.start_date?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="end_date"
                control={control}
                rules={{ required: "Date de fin requise" }}
                render={({ field }) => (
                  <FormField
                    id="end_date"
                    label="Date de fin"
                    type="date"
                    error={errors.end_date?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="department"
                control={control}
                rules={{ required: "Le département est requis" }}
                render={({ field }) => (
                  <SelectField
                    id="department"
                    label="Département"
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
                      "Format LinkedIn invalide (ex: www.linkedin.com/in/username)",
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
                      "Format GitHub invalide (ex: https://github.com/username)",
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
              rules={{ required: "CV requis pour un stagiaire" }}
              render={({ field }) => (
                <FileUploader
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
          <FormSection title="Autres détails">
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
                  placeholder="Veuillez fournir une brève description de votre rôle ou de vos besoins."
                  {...field}
                />
              )}
            />
          </FormSection>
        </TabsContent>
      </Tabs>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary hover:bg-[color-mix(in oklch, var(--primary) 80%, black)] text-primary-foreground font-semibold py-6 rounded-lg transition-colors mt-8"
      >
        {submitting ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
}
