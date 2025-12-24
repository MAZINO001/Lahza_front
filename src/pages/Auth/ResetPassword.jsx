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
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import FormField from "@/components/Form/FormField";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");

  const validatePasswordMatch = (confirmPassword) =>
    confirmPassword === password || "Passwords do not match";

  const handleReset = async (data) => {
    setIsLoading(true);
    console.log(data);
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
      toast.success("Password reset successfully!");
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Password Reset!
            </h2>
            <p className="text-gray-600 mt-2">
              Your password has been successfully reset. You can now login with
              your new password.
            </p>
            <Button className="w-full">
              Continue to Login <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-background rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below to reset your account password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(handleReset)} className="space-y-4">
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
              render={({ field }) => (
                <FormField
                  id="password"
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  error={errors.password?.message}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  {...field}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: validatePasswordMatch,
              }}
              render={({ field }) => (
                <FormField
                  id="confirmPassword"
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  error={errors.confirmPassword?.message}
                  rightElement={
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  {...field}
                />
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}{" "}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/auth/login"
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
