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
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import FormField from "@/components/Form/FormField";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyEmail() {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { verificationCode: "" },
  });

  const verificationCode = watch("verificationCode");

  const handleVerify = async (data) => {
    setIsLoading(true);
    console.log(data);
    setTimeout(() => {
      setIsVerified(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleResendCode = () => {
    toast.info("Verification code resent! Please check your inbox.");
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Email Verified!
            </h2>
            <p className="text-gray-600 mt-2">
              Your email has been successfully verified. You can now access your
              account.
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-background rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification code to your email. Please enter it below.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(handleVerify)} className="space-y-4">
            <Controller
              name="verificationCode"
              control={control}
              rules={{
                required: "Verification code is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Please enter a valid 6-digit code",
                },
              }}
              render={({ field }) => (
                <FormField
                  id="verificationCode"
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                  error={errors.verificationCode?.message}
                  {...field}
                />
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || verificationCode?.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Email"}{" "}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendCode}
            >
              Resend Code
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Go back to{" "}
            <Link
              to="/auth/login"
              className="text-blue-600 hover:text-blue-800"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
