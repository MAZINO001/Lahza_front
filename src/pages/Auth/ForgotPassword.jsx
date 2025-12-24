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
import { Link } from "react-router-dom";
import { toast } from "sonner";
import FormField from "@/components/Form/FormField";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
  });

  const handleForgotPassword = async (data) => {
    setIsLoading(true);
    console.log(data);
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
      toast.success("Reset link sent to your email!");
    }, 2000);
  };

  const handleSendToAnotherEmail = () => setIsSuccess(false);

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-background rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email Sent!</h2>
            <p className="text-gray-600 mt-2">
              We've sent password reset instructions to your email address.
              Please check your inbox and follow the link to reset your
              password.
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
              <Button
                variant="link"
                className="w-full"
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-background rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription>
            No worries! Enter your email address below and we'll send you a link
            to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={handleSubmit(handleForgotPassword)}
            className="space-y-4"
          >
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
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}{" "}
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
