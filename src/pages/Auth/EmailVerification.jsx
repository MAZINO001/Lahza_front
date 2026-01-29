"use client";

import { useEmailVerification } from "@/features/auth/hooks/useEmailVerification";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function VerifyEmailPage() {
  const {
    token,
    email,
    status,
    message,
    renderContent,
    goToSignIn,
    goToResendVerification,
    handleResendVerification,
    sendVerificationMutation,
  } = useEmailVerification();

  const content = renderContent();

  const isLoading = content.icon === "loader";
  const isSuccess = content.icon === "success";
  const isError = content.icon === "error";
  const isWarning = content.icon === "warning";
  const isResend = status === "resend";

  return (
    <div className="min-h-screen  flex items-center justify-center bg-background px-4 py-12 w-full">
      <Card className="w-full max-w-md border-border shadow-sm">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Mail className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Verify your email
          </CardTitle>
          <CardDescription className="text-base">
            {email ? (
              <>
                We sent a verification link to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </>
            ) : (
              "Confirming your email address..."
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {/* Resend State */}
          {isResend && (
            <div className="space-y-6">
              <Alert>
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>{content.title}</AlertTitle>
                <AlertDescription>{content.subtitle}</AlertDescription>
              </Alert>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={content.primaryAction}
                  variant="default"
                  size="lg"
                  disabled={sendVerificationMutation.isPending}
                >
                  {sendVerificationMutation.isPending ? "Sending..." : content.primaryActionText}
                </Button>

                {content.secondaryAction && content.secondaryActionText && (
                  <Button
                    onClick={content.secondaryAction}
                    variant="outline"
                    size="lg"
                  >
                    {content.secondaryActionText}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-semibold">{content.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                {content.subtitle}
              </p>
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-100/60 dark:bg-green-950/40 rounded-full blur-xl" />
                <CheckCircle2 className="relative h-16 w-16 text-green-600 dark:text-green-500 mx-auto" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold tracking-tight">
                  {content.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {content.subtitle}
                </p>
              </div>
              <Button
                onClick={content.primaryAction}
                size="lg"
                className="gap-2"
              >
                {content.primaryActionText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Error / Warning State */}
          {(isError || isWarning) && (
            <div className="space-y-6">
              <Alert variant={isError ? "destructive" : "default"}>
                {isWarning ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <AlertTitle>{content.title}</AlertTitle>
                <AlertDescription>{content.subtitle}</AlertDescription>
              </Alert>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={content.primaryAction}
                  variant={isError ? "destructive" : "default"}
                  size="lg"
                >
                  {content.primaryActionText}
                </Button>

                {content.secondaryAction && content.secondaryActionText && (
                  <Button
                    onClick={content.secondaryAction}
                    variant="outline"
                    size="lg"
                  >
                    {content.secondaryActionText}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
        {/* Optional Footer – resend link if needed */}
        {isLoading && (
          <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
            Didn't receive the email?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-medium"
              onClick={handleResendVerification}
              disabled={sendVerificationMutation.isPending}
            >
              {sendVerificationMutation.isPending ? "Sending..." : "Resend verification link"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
