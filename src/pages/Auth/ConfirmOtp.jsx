"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

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

export default function EmailVerificationForm() {
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm({
    defaultValues: {
      code: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, formState, setError, reset } = form;

  const onSubmit = (values) => {
    setIsVerifying(true);

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);

      if (values.code === "123456") {
        toast.success("Email verified successfully!");
        reset();
      } else {
        toast.error("Invalid verification code");
        setError("code", { message: "Incorrect code" });
      }
    }, 1400);
  };

  return (
    <div className="w-full max-w-sm space-y-6 px-1">
      {/* Header */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Check your email
        </h2>
        <p className="text-sm text-muted-foreground">
          We sent a verification code to{" "}
          <span className="font-medium text-foreground">user@example.com</span>
        </p>
      </div>

      {/* Form */}
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
            disabled={
              isVerifying || !formState.isValid || formState.isSubmitting
            }
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      </Form>

      {/* Resend link */}
      <p className="text-center text-sm text-muted-foreground">
        Didn't receive the email?{" "}
        <Button variant="link" className="h-auto p-0" disabled={isVerifying}>
          Resend code
        </Button>
      </p>
    </div>
  );
}
