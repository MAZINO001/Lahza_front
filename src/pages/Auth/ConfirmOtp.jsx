"use client";

import { Mail, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useVerifyOtp } from "@/features/auth/hooks/useVerifyOtp";

export default function ConfirmOtp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const verifyOtpMutation = useVerifyOtp();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      toast.error("No email found. Please start over.");
      navigate('/auth/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const form = useForm({
    defaultValues: {
      code: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, formState, setError, reset } = form;

  const onSubmit = async (values) => {
    try {
      await verifyOtpMutation.mutateAsync({
        email: email,
        otp: values.code
      });
      toast.success("Code verified successfully!");
      // Store verified OTP for reset password step
      sessionStorage.setItem('verifiedOtp', values.code);
      navigate('/auth/reset-password');
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid verification code"
      );
    }
  };

  return (
    <div className="min-h-screen flex w-full items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md border-border shadow-sm">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Mail className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Check your email
          </CardTitle>
          <CardDescription className="text-base">
            We sent a verification code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          {...field}
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={
                  verifyOtpMutation.isPending ||
                  !formState.isValid ||
                  formState.isSubmitting
                }
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          </Form>

          <div className="flex flex-col gap-3">
            <p className="text-center text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <Button
                variant="link"
                className="h-auto p-0"
                disabled={verifyOtpMutation.isPending}
                onClick={() => navigate('/auth/forgot-password')}
              >
                Try again
              </Button>
            </p>

            <Button asChild variant="outline" size="lg">
              <Link to="/auth/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
