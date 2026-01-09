/* eslint-disable no-unused-vars */
import React from "react";
import { useForm, Controller } from "react-hook-form";
import FormSection from "@/components/Form/FormSection";
import FormField from "@/components/Form/FormField";
import { Button } from "@/components/ui/button";

export default function SecurityPreferences() {
  /* ---------------- Password ---------------- */
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  /* ---------------- Email ---------------- */
  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onPasswordSubmit = (values) => {
    // Password update logic
  };

  const onEmailSubmit = (values) => {
    // Email update logic
  };

  return (
    <div className="w-full">
      <h1 className="font-semibold text-lg">Security</h1>
      <FormSection title="Password">
        <form
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          className="space-y-4"
        >
          <Controller
            name="current_password"
            control={passwordControl}
            rules={{ required: "Current password is required" }}
            render={({ field }) => (
              <FormField
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                error={passwordErrors.current_password?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="new_password"
            control={passwordControl}
            rules={{ required: "New password is required", minLength: 8 }}
            render={({ field }) => (
              <FormField
                label="New Password"
                type="password"
                placeholder="Enter new password"
                error={passwordErrors.new_password?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="confirm_password"
            control={passwordControl}
            rules={{
              validate: (v, f) =>
                v === f.new_password || "Passwords do not match",
            }}
            render={({ field }) => (
              <FormField
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                error={passwordErrors.confirm_password?.message}
                {...field}
              />
            )}
          />

          <div className="flex justify-end">
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </FormSection>

      <FormSection title="Email Address">
        <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
          <Controller
            name="email"
            control={emailControl}
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <FormField
                label="New Email"
                placeholder="Enter new email address"
                error={emailErrors.email?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="password"
            control={emailControl}
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <FormField
                label="Current Password"
                type="password"
                placeholder="Enter your current password"
                error={emailErrors.password?.message}
                {...field}
              />
            )}
          />
          <div className="flex justify-end">
            <Button variant="outline">Update Email</Button>
          </div>
        </form>
      </FormSection>
    </div>
  );
}
