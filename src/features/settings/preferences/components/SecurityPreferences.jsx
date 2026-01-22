import React from "react";
import { useForm, Controller } from "react-hook-form";
import FormSection from "@/components/Form/FormSection";
import FormField from "@/components/Form/FormField";
import { Button } from "@/components/ui/button";
import {
  useUpdateEmail,
  useUpdatePassword,
} from "@/features/settings/hooks/useUsersQuery";

export default function SecurityPreferences() {
  const updateEmailMutation = useUpdateEmail();
  const updatePasswordMutation = useUpdatePassword();

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onPasswordSubmit = (values) => {
    updatePasswordMutation.mutate(
      {
        current_password: values.current_password,
        password: values.new_password,
        password_confirmation: values.confirm_password,
      },
      {
        onSuccess: () => {
          resetPasswordForm();
        },
      },
    );
  };

  const onEmailSubmit = (values) => {
    updateEmailMutation.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          resetEmailForm();
        },
      },
    );
  };

  return (
    <div className="w-full">
      <h1 className="font-semibold text-lg mb-6">Security</h1>
      <form
        onSubmit={handlePasswordSubmit(onPasswordSubmit)}
        className="space-y-4"
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          Change Password
        </h3>
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
            required: "Please confirm your password",
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
          <Button type="submit" disabled={updatePasswordMutation.isPending}>
            {updatePasswordMutation.isPending
              ? "Updating..."
              : "Update Password"}
          </Button>
        </div>
      </form>

      <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          Change Email Address
        </h3>
        <Controller
          name="email"
          control={emailControl}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
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
          <Button
            type="submit"
            disabled={updateEmailMutation.isPending}
            variant="outline"
          >
            {updateEmailMutation.isPending ? "Updating..." : "Update Email"}
          </Button>
        </div>
      </form>
    </div>
  );
}
