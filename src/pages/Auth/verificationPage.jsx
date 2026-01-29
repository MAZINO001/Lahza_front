import React, { useState } from "react";
import { CheckCircle, Mail, Loader2 } from "lucide-react";

export default function VerificationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyEmail = async () => {

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 space-y-8">
          {/* Icon Section */}
          <div className="flex justify-center">
            {isVerified ? (
              <div className="relative">
                <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
              </div>
            ) : (
              <div className="bg-blue-50 p-4 rounded-full">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>

          {/* Content */}
          {!isVerified ? (
            <>
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Verify Your Email
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  Click the button below to confirm your email address and
                  activate your account.
                </p>
              </div>

              {/* Button */}
              <button
                onClick={handleVerifyEmail}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Verify Email
                  </>
                )}
              </button>

              {/* Info Text */}
              <p className="text-xs text-slate-500 text-center">
                This link will expire in 24 hours. If you didn't request this,
                you can safely ignore this email.
              </p>
            </>
          ) : (
            <>
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Email Verified!
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  Your email has been successfully verified. You're all set!
                </p>
              </div>

              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Go to Home
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Need help? Contact our support team
        </p>
      </div>
    </div>
  );
}
