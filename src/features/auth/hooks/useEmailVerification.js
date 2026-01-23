import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from '@/lib/utils/axios';

const verifyEmail = async ({ token }) => {
    const response = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/email/verify`,
        { token },
        {
            headers: { "Content-Type": "application/json" },
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

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link. Please request a new one.");
            return;
        }

        verifyEmailMutation.mutate({ token });
    }, [token]);

    const goToSignIn = () => navigate("/signin");
    const goToResendVerification = () => navigate("/resend-verification");

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

            case "expired":
                return {
                    icon: "warning",
                    title: "Verification Link Expired",
                    subtitle: message,
                    showActions: true,
                    primaryAction: goToResendVerification,
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
                    primaryAction: goToResendVerification,
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
    };
}
