import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, ArrowRight, CheckCircle, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import FormField from "@/components/Form/FormField";

export default function ConfirmPassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const currentPassword = watch("currentPassword");

  const validatePasswordMatch = (confirmPassword) =>
    confirmPassword === newPassword || "Passwords do not match";

  const validateNewPasswordDifferent = (password) =>
    password !== currentPassword ||
    "New password must be different from current password";

  const handleConfirmPassword = async (data) => {
    setIsLoading(true);
    console.log(data);
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
      toast.success("Password updated successfully!");
    }, 2000);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, text: "Very Weak", color: "bg-red-500" },
      { strength: 1, text: "Weak", color: "bg-orange-500" },
      { strength: 2, text: "Fair", color: "bg-yellow-500" },
      { strength: 3, text: "Good", color: "bg-blue-500" },
      { strength: 4, text: "Strong", color: "bg-green-500" },
      { strength: 5, text: "Very Strong", color: "bg-green-600" },
    ];

    return levels[Math.min(strength, 5)];
  };

  const passwordStrength = getPasswordStrength(newPassword);

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-background rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Password Updated!
            </h2>
            <p className="text-gray-600">
              Your password has been successfully updated. You can continue
              using your account with the new password.
            </p>
            <Button className="w-full">
              Continue to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderPasswordField = (name, label, show, setShow, rules) => (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <div className="space-y-2 relative">
          <FormField
            id={name}
            label={label}
            type={show ? "text" : "password"}
            placeholder={`Enter ${label.toLowerCase()}`}
            {...field}
            error={errors?.name?.message}
          />
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
          >
            {show ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
          {errors[name] && (
            <p className="text-sm text-red-600">{errors[name].message}</p>
          )}
          {name === "newPassword" && newPassword && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Password strength:</span>
                <span
                  className={`font-medium ${
                    passwordStrength.strength <= 2
                      ? "text-orange-600"
                      : passwordStrength.strength <= 3
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {passwordStrength.text}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    />
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-background rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Change Password</CardTitle>
          <CardDescription>
            Enter your current password and choose a new secure password for
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={handleSubmit(handleConfirmPassword)}
            className="space-y-4"
          >
            {renderPasswordField(
              "currentPassword",
              "Current Password",
              showCurrentPassword,
              setShowCurrentPassword,
              { required: "Current password is required" }
            )}
            {renderPasswordField(
              "newPassword",
              "New Password",
              showNewPassword,
              setShowNewPassword,
              {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: validateNewPasswordDifferent,
              }
            )}
            {renderPasswordField(
              "confirmPassword",
              "Confirm New Password",
              showConfirmPassword,
              setShowConfirmPassword,
              {
                required: "Please confirm your new password",
                validate: validatePasswordMatch,
              }
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}{" "}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Cancel and return to{" "}
            <Link
              to="/client/settings"
              className="text-blue-600 hover:text-blue-800"
            >
              Account Settings
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
