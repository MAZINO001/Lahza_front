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
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import FormField from "@/components/Form/FormField";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

export default function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { email: "" },
  });

  const handleForgotPassword = async (data) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setIsSuccess(true);
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    }
  };

  const handleSendToAnotherEmail = () => {
    setIsSuccess(false);
    reset();
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background w-full">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Email Sent!</h2>
            <p className="text-muted-foreground mt-2">
              We've sent password reset instructions to your email address.
              Please check your inbox and follow the link to reset your
              password.
            </p>
            <div className="space-y-2">
              <Link to="/auth/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
              <Button
                className="w-full mt-4"
                onClick={handleSendToAnotherEmail}
              >
                Send to another email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background w-full">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2 ">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription>
            No worries! Enter your email address below and we'll send you a link
            to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-4">
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              }}
              render={({ field }) => (
                <FormField
                  {...field}
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  error={errors.email?.message}
                />
              )}
            />

            <Button
              onClick={handleSubmit(handleForgotPassword)}
              className="w-full "
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              to="/auth/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
