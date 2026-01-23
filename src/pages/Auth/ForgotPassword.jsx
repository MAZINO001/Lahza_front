"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

export default function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setIsSuccess(true);
      toast.success("Reset link sent — check your inbox!");
      form.reset();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send reset link",
      );
    }
  };

  const handleSendToAnotherEmail = () => {
    setIsSuccess(false);
    form.reset();
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex w-full items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md border-border shadow-sm">
          <CardContent className="pt-10 pb-8 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100/70 dark:bg-green-950/40">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Email Sent!
              </h2>
              <p className="text-muted-foreground">
                We've sent password reset instructions to your email.
                <br />
                Please check your inbox (and spam folder) and follow the link.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button asChild variant="outline" size="lg">
                <Link to="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>

              <Button size="lg" onClick={handleSendToAnotherEmail}>
                Try another email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md border-border shadow-sm">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Mail className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Forgot password?
          </CardTitle>
          <CardDescription className="text-base">
            No worries — enter your email and we'll send you a reset link.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        autoComplete="email"
                        disabled={forgotPasswordMutation.isPending}
                        {...field}
                      />
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
                  forgotPasswordMutation.isPending || !form.formState.isValid
                }
              >
                {forgotPasswordMutation.isPending ? (
                  <>Sending…</>
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              to="/auth/login"
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
