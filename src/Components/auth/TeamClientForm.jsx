/* eslint-disable no-unused-vars */
import { Tabs, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import FormSection from "../Form/FormSection";
import FormField from "../Form/FormField";
import SelectField from "../Form/SelectField";
import TextareaField from "../Form/TextareaField";
import RoleTabs from "../Form/RoleTabs";
import { useForm } from "react-hook-form";
import { useState } from "react";
import FileUploader from "../comp-545";
import TagsField from "../comp-57";
import axios from "axios";
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
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: registerStore,
  });

  // const thePost = watch("poste");
  const theRole = watch("user_type");
  // const theDepartement = watch("departement");

  const handleChange = (field, value) => setValue(field, value);
  // const onSubmit = async (data) => {
  //   setSubmitting(true);
  //   const filledData = Object.fromEntries(
  //     Object.entries(registerStore).filter(
  //       ([key, value]) => value !== "" && value != null
  //     )
  //   );
  //   console.log("Filled data:", filledData);
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8000/api/register",
  //       filledData
  //     );
  //     console.log("Registration successful:", response.data);
  //   } catch (error) {
  //     console.error("Registration failed:", error.response.data);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const onSubmit = async (data) => {
    setSubmitting(true);

    // Filter out empty values
    const filledData = Object.fromEntries(
      Object.entries(registerStore).filter(
        ([key, value]) => value !== "" && value != null
      )
    );

    console.log("Filled data:", filledData);

    try {
      // Create FormData
      const formData = new FormData();

      // Add all fields to FormData
      Object.entries(filledData).forEach(([key, value]) => {
        if (key === "cv") {
          // Add the file
          formData.append("cv", value);
        } else {
          // Add regular data
          formData.append(key, value);
        }
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Registration successful:", response.data);
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
          // add reset data whne the user chnages the tabs
          registerStore.reset();
          reset(registerStore);
          setValue("user_type", val);
          registerStore.setField("user_type", val);
        }}
        className="w-full"
      >
        <RoleTabs
          value={register.user_type}
          onChange={(val) => handleChange("user_type", val)}
        />

        <FormSection title="Informations du compte">
          <FormField
            id="name"
            label="Nom complet"
            // {...register("name")}
            value={watch("name")}
            onChange={(e) => {
              setValue("name", e.target.value);
              registerStore.setField("name", e.target.value);
            }}
            error={errors.name}
          />
          <FormField
            id="email"
            label="Adresse email"
            type="email"
            // {...register("email")}
            value={watch("email")}
            onChange={(e) => {
              setValue("email", e.target.value);
              registerStore.setField("email", e.target.value);
            }}
            error={errors.email}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="password"
              label="Mot de passe"
              type="password"
              // {...register("password")}
              value={watch("password")}
              onChange={(e) => {
                setValue("password", e.target.value);
                registerStore.setField("password", e.target.value);
              }}
              error={errors.password}
            />
            <FormField
              id="password_confirmation"
              label="Confirmer le mot de passe"
              type="password"
              // {...register("password_confirmation")}
              value={watch("password_confirmation")}
              onChange={(e) => {
                setValue("password_confirmation", e.target.value);
                registerStore.setField("password_confirmation", e.target.value);
              }}
              error={errors.password_confirmation}
            />
          </div>
        </FormSection>

        <TabsContent value="team">
          <FormSection title="Détails de l'équipe">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                id="poste"
                label="Rôle / Poste"
                // value={thePost}
                // onChange={(v) => handleChange("poste", v)}
                // {...register("poste")}
                value={watch("poste")}
                onChange={(value) => {
                  setValue("poste", value);
                  registerStore.setField("poste", value);
                }}
                error={errors.poste}
                options={[
                  { value: "Informatique", label: "Informatique / Technique" },
                  { value: "Marketing", label: "Marketing" },
                  { value: "RH", label: "Ressources Humaines" },
                  { value: "Ventes", label: "Ventes" },
                  { value: "Support", label: "Support" },
                ]}
              />
              <SelectField
                id="department"
                label="Département"
                // {...register("department")}
                value={watch("department")}
                onChange={(value) => {
                  setValue("department", value);
                  registerStore.setField("department", value);
                }}
                error={errors.department}
                options={[
                  { value: "Informatique", label: "Informatique / Technique" },
                  { value: "Marketing", label: "Marketing" },
                  { value: "RH", label: "Ressources Humaines" },
                  { value: "Ventes", label: "Ventes" },
                  { value: "Support", label: "Support" },
                ]}
              />
            </div>
          </FormSection>
        </TabsContent>

        <TabsContent value="intern">
          <FormSection title="Détails du stage">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="start_date"
                label="Date de début"
                type="date"
                // {...register("start_date")}
                value={watch("start_date")}
                onChange={(e) => {
                  setValue("start_date", e.target.value);
                  registerStore.setField("start_date", e.target.value);
                }}
                error={errors.start_date}
              />
              <FormField
                id="end_date"
                label="Date de fin"
                type="date"
                // {...register("end_date")}
                value={watch("end_date")}
                onChange={(e) => {
                  setValue("end_date", e.target.value);
                  registerStore.setField("end_date", e.target.value);
                }}
                error={errors.end_date}
              />

              <SelectField
                id="department"
                label="Département"
                // value={theDepartement}
                // onChange={(v) => handleChange("department", v)}
                // {...register("department")}
                value={watch("department")}
                onChange={(value) => {
                  setValue("department", value);
                  registerStore.setField("department", value);
                }}
                error={errors.department}
                options={[
                  { value: "Informatique", label: "Informatique / Technique" },
                  { value: "Marketing", label: "Marketing" },
                  { value: "RH", label: "Ressources Humaines" },
                  { value: "Ventes", label: "Ventes" },
                  { value: "Support", label: "Support" },
                ]}
              />
              <FormField
                id="linkedin"
                label="linkedin"
                // {...register("linkedin")}
                value={watch("linkedin")}
                onChange={(e) => {
                  setValue("linkedin", e.target.value);
                  registerStore.setField("linkedin", e.target.value);
                }}
                error={errors.linkedin}
              />
              <FormField
                id="portfolio"
                label="portfolio"
                // {...register("portfolio")}
                value={watch("portfolio")}
                onChange={(e) => {
                  setValue("portfolio", e.target.value);
                  registerStore.setField("portfolio", e.target.value);
                }}
                error={errors.portfolio}
              />
              <FormField
                id="github"
                label="GitHub"
                // {...register("github")}
                value={watch("github")}
                onChange={(e) => {
                  setValue("github", e.target.value);
                  registerStore.setField("github", e.target.value);
                }}
                error={errors.github}
              />
            </div>
            <FileUploader />
          </FormSection>
        </TabsContent>

        <TabsContent value="other">
          <FormSection title="Autres détails">
            <TagsField
              id="tags"
              label="Tags"
              value={watch("tags")}
              onChange={(newTags) => {
                setValue("tags", newTags);
                registerStore.setField("tags", newTags);
              }}
            />

            <TextareaField
              id="description"
              label="Description"
              // {...register("description")}
              value={watch("description")}
              onChange={(e) => {
                setValue("description", e.target.value);
                registerStore.setField("description", e.target.value);
              }}
              error={errors.description}
              placeholder="Veuillez fournir une brève description de votre rôle ou de vos besoins."
            />
          </FormSection>
        </TabsContent>
      </Tabs>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary
                   hover:bg-[color-mix(in oklch, var(--primary) 80%, black)]
                   text-primary-foreground
                   font-semibold py-2 px-4 rounded-lg
                   transition-colors mt-8"
      >
        {submitting ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  );
}
