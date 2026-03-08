import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { useAuthContext } from "@/hooks/AuthContext";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import FormField from "@/components/Form/FormField";
import { toast } from "sonner";
import { Github } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { useLogin } from "@/features/auth/hooks/useLogin";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
export default function Login({ status, canResetPassword }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role, login } = useAuthContext();
  const loginMutation = useLogin();

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
    try {
      const result = await loginMutation.mutateAsync(data);

      login(result.user);
      navigate(`/${role}/dashboard`, { replace: true });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || t("login.failed"));
    }
  };

  return (
    <div className="min-h-screen h-screen flex w-full flex-col md:flex-row overflow-auto">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Logo */}
        <div className="p-4 sm:p-6 md:p-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/images/logo.png"
              alt={t("login.logo_alt")}
              className="h-8 sm:h-10 w-auto"
            />
          </div>
          <div className="flex items-center gap-2 justify-end shrink-0">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Login Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-6 md:py-0 min-h-0">
          <Card className="w-full max-w-md border-0 shadow-none bg-background">
            <CardContent className="p-0">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold mb-2">{t("login.welcome_back")}</h1>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {t("login.continue_description")}
                </p>
              </div>

              {status && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md mb-4 sm:mb-6 text-xs sm:text-sm">
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t("login.email")}
                  </label>
                  <FormField
                    id="email"
                    type="email"
                    {...register("email", {
                      required: t("validation.email_required"),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t("validation.email_invalid"),
                      },
                    })}
                    value={watch("email")}
                    onChange={(e) => setValue("email", e.target.value)}
                    placeholder={t("login.email_placeholder")}
                    autoComplete="email"
                    className="w-full"
                  />
                  <InputError message={errors.email?.message} />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      {t("login.password")}
                    </Label>
                    <Link
                      to="/auth/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      {t("login.forgot_password")}
                    </Link>
                  </div>
                  <FormField
                    id="password"
                    type="password"
                    {...register("password", {
                      required: t("validation.password_required"),
                    })}
                    value={watch("password")}
                    onChange={(e) => setValue("password", e.target.value)}
                    placeholder={t("login.password_placeholder")}
                    autoComplete="current-password"
                    className="w-full"
                  />
                  <InputError message={errors.password?.message} />
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <input
                    asChild
                    type="checkbox"
                    id="remember"
                    {...register("remember")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground"
                  >
                    {t("login.remember")}
                  </Label>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? t("login.submitting") : t("login.submit")}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  {t("login.no_account")}{" "}
                  <Link
                    to="/auth/register"
                    className="text-primary hover:underline font-medium"
                  >
                    {t("login.sign_up")}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 md:min-h-screen md:h-auto lg:min-w-[400px] shrink-0">
        <img
          src="https://picsum.photos/800/1100"
          alt={t("login.image_alt")}
          className="w-full h-full min-h-[200px] object-cover"
        />
      </div>
    </div>
  );
}
