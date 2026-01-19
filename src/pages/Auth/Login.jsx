import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { useAuthContext } from "@/hooks/AuthContext";
import { t } from "i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/utils/axios";
import FormField from "@/components/Form/FormField";
import { toast } from "sonner";
import { Github } from "lucide-react";
export default function Login({ status, canResetPassword }) {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { role, login } = useAuthContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        data,
        {
          headers: { Accept: "application/json" },
        }
      );

      const token = res.data.token;
      localStorage.setItem("token", token);
      login(res.data.user);
      navigate(`/${role}/dashboard`, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex w-full">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col">
        {/* Logo */}
        <div className="p-8">
          <div className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="ShadcnStore"
              className="h-10 w-auto"
            />
          </div>
        </div>

        {/* Login Form Container */}
        <div className="flex-1 flex items-center justify-center px-8">
          <Card className="w-full max-w-md border-0 shadow-none">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                <p className="text-muted-foreground">
                  Sign in to your account to continue
                </p>
              </div>

              {status && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 text-sm">
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <FormField
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    value={watch("email")}
                    onChange={(e) => setValue("email", e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full"
                  />
                  <InputError message={errors.email?.message} />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormField
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    value={watch("password")}
                    onChange={(e) => setValue("password", e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full"
                  />
                  <InputError message={errors.password?.message} />
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    {...register("remember")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground"
                  >
                    Remember me
                  </label>
                </div>

                {/* Login Button */}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Signing in..." : "Login"}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/auth/register"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src="https://picsum.photos/800/1100"
          alt="login img"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
