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
import { toast } from "sonner";
import { Link } from "react-router-dom";
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

  const handleConfirmPassword = async (data) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
      toast.success("Password updated successfully!");
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background w-full">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Password Updated!
            </h2>
            <p className="text-foreground">
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background w-full">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Change Password</CardTitle>
          <CardDescription>
            Enter your current password and choose a new secure password for
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-4">
            <Controller
              name="currentPassword"
              control={control}
              rules={{ required: "Current password is required" }}
              render={({ field }) => (
                <div className="space-y-2 relative">
                  <FormField
                    {...field}
                    id="currentPassword"
                    label="Current Password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    error={errors.currentPassword?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 bottom-3.5 text-muted-foreground hover:text-foreground focus:outline-none"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            />

            {/* New Password */}
            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: validateNewPasswordDifferent,
              }}
              render={({ field }) => (
                <div className="space-y-2 relative">
                  <FormField
                    {...field}
                    id="newPassword"
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    error={errors.newPassword?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-10.5 text-muted-foreground "
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  {newPassword && (
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground">
                          Password strength:
                        </span>
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
                      <div className="w-full bg-background rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{
                            width: `${(passwordStrength.strength / 5) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your new password",
                validate: validatePasswordMatch,
              }}
              render={({ field }) => (
                <div className="space-y-2 relative">
                  <FormField
                    {...field}
                    id="confirmPassword"
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    error={errors.confirmPassword?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 bottom-3.5 text-muted-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            />

            <Button
              onClick={handleSubmit(handleConfirmPassword)}
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <p className="text-center text-sm text-foreground">
            <Link
              to="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to Account Settings
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
