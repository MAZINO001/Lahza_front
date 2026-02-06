import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from '@/lib/utils/axios';
import { toast } from "sonner";

const sendVerificationEmail = async () => {
    const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/email/send-verification`,
        {},
        {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // Important for HTTP-only cookies
        }
    );
    return response.data;
};

const verifyEmail = async ({ token }) => {
    const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/email/verify`,
        { token },
        {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // Important for HTTP-only cookies
        }
    );
    return response.data;
};

export function useEmailVerification() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    const verifyEmailMutation = useMutation({
        mutationFn: verifyEmail,
        onSuccess: (data) => {
            setStatus("success");
            setMessage("Your email has been verified successfully!");
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                if (error.response.data?.message?.includes("expired")) {
                    setStatus("expired");
                    setMessage(
                        "This verification link has expired. Please request a new one."
                    );
                } else {
                    setStatus("error");
                    setMessage(error.response.data?.message || "Invalid verification link.");
                }
            } else {
                setStatus("error");
                setMessage("Something went wrong. Please try again later.");
            }
        },
    });

    const sendVerificationMutation = useMutation({
        mutationFn: sendVerificationEmail,
        onSuccess: (data) => {
            toast.success("Verification email sent successfully!");
            setStatus("loading");
            setMessage("Please check your email for the verification link.");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to send verification email");
        },
    });

    useEffect(() => {
        if (!token) {
            // No token in URL, show resend verification option
            setStatus("resend");
            setMessage("Please request a verification email to continue.");
            return;
        }

        verifyEmailMutation.mutate({ token });
    }, [token, verifyEmailMutation]);

    const goToSignIn = () => navigate("/auth/login");
    const goToResendVerification = () => navigate("/auth/verify-email");
    const handleResendVerification = () => {
        sendVerificationMutation.mutate();
    };

    const renderContent = () => {
        switch (status) {
            case "loading":
                return {
                    icon: "loader",
                    title: "Verifying your email...",
                    subtitle: "Please wait while we confirm your email address",
                    showActions: false,
                };

            case "success":
                return {
                    icon: "success",
                    title: "Email verified!",
                    subtitle: message,
                    showActions: true,
                    primaryAction: goToSignIn,
                    primaryActionText: "Go to Sign In",
                };

            case "resend":
                return {
                    icon: "warning",
                    title: "Email Verification Required",
                    subtitle: message,
                    showActions: true,
                    primaryAction: handleResendVerification,
                    primaryActionText: "Request Verification Link",
                    secondaryAction: goToSignIn,
                    secondaryActionText: "Back to Sign In",
                };

            case "expired":
                return {
                    icon: "warning",
                    title: "Verification Link Expired",
                    subtitle: message,
                    showActions: true,
                    primaryAction: handleResendVerification,
                    primaryActionText: "Request New Verification Link",
                    secondaryAction: goToSignIn,
                    secondaryActionText: "Back to Sign In",
                };

            case "error":
            default:
                return {
                    icon: "error",
                    title: "Verification Failed",
                    subtitle: message,
                    showActions: true,
                    primaryAction: handleResendVerification,
                    primaryActionText: "Request New Verification Link",
                    secondaryAction: goToSignIn,
                    secondaryActionText: "Back to Sign In",
                };
        }
    };

    return {
        token,
        email,
        status,
        message,
        renderContent,
        goToSignIn,
        goToResendVerification,
        handleResendVerification,
        sendVerificationMutation,
    };
}
