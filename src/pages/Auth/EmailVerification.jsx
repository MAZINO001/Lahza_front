import { useEmailVerification } from "@/features/auth/hooks/useEmailVerification";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function VerifyEmailPage() {
  const {
    token,
    email,
    status,
    message,
    renderContent,
    goToSignIn,
    goToResendVerification,
  } = useEmailVerification();

  const content = renderContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 w-full">
      <div className="w-full max-w-md border border-gray-200 bg-white rounded-lg shadow-lg">
        <div className="px-6 py-8 space-y-2 text-center border-b border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Mail className="h-6 w-6 text-gray-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Verify your email
          </h2>
          <p className="text-sm text-gray-600">
            {email ? (
              <>
                We sent a verification link to <br />
                <span className="font-semibold text-gray-900">{email}</span>
              </>
            ) : (
              "Confirming your email address..."
            )}
          </p>
        </div>

        <div className="px-6 py-8">
          {content.icon === "loader" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                {content.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {content.subtitle}
              </p>
            </div>
          )}

          {content.icon === "success" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-green-100 rounded-full blur-md opacity-50" />
                <CheckCircle2 className="relative h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {content.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{content.subtitle}</p>
              <button
                onClick={content.primaryAction}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                {content.primaryActionText} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {(content.icon === "warning" || content.icon === "error") && (
            <div className="space-y-6">
              <div className={`border ${content.icon === "warning" ? "border-red-200 bg-red-50" : "border-red-200 bg-red-50"} rounded-md p-4 flex gap-3`}>
                {content.icon === "warning" ? (
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {content.title}
                  </p>
                  <p className="text-sm text-red-700 mt-1">{content.subtitle}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={content.primaryAction}
                  className="w-full px-4 py-2 bg-black text-white rounded-md font-medium text-sm hover:bg-gray-800 transition-colors"
                >
                  {content.primaryActionText}
                </button>
                {content.secondaryAction && (
                  <button
                    onClick={content.secondaryAction}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors"
                  >
                    {content.secondaryActionText}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
