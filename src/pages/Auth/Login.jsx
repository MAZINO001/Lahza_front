import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { Button } from "@/Components/ui/button";
import { Card, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { useAuthContext } from "@/hooks/AuthContext";
import { t } from "i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/utils/axios";
export default function Login({ status, canResetPassword }) {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, role, verifyAuth } = useAuthContext();

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

    await verifyAuth();

    const nextRole = res.data.user?.role || "client";
    navigate(`/${nextRole}/dashboard`, { replace: true });
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Login failed");
  } finally {
    setSubmitting(false);
  }
};
    

    

  return (
    <Card className="bg-card p-4 border border-stale-900 flex flex-col md:flex-row text-foreground border-none">
      <div className="bg-white flex flex-col  h-full w-full md:w-1/2 rounded-md p-6 justify-center items-center">
        <div className="w-full max-w-md">
          <CardTitle className="mb-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-gradient-end">
            {t("login.title")}
          </CardTitle>

          {status && (
            <div className="text-green-600 mb-4 text-center text-sm font-medium">
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <InputLabel htmlFor="email" value={t("login.email")} />
              <Input
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
                className="mt-1 block w-full"
                autoComplete="email"
                isFocused
              />
              <InputError message={errors.email?.message} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="password" value={t("login.password")} />
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: t("validation.password_required"),
                })}
                value={watch("password")}
                onChange={(e) => setValue("password", e.target.value)}
                className="mt-1 block w-full"
                autoComplete="current-password"
                isFocused
              />
              <InputError message={errors.password?.message} className="mt-2" />
            </div>

            <div className="flex flex-col space-y-4">
              <label
                className="flex cursor-pointer items-center"
                htmlFor="remember"
              >
                <input
                  type="checkbox"
                  id="remember"
                  {...register("remember")}
                  className="border-gray-300 text-indigo-600 focus:ring-indigo-500 rounded shadow-sm"
                />
                <span className="text-gray-600 ml-2 select-none text-sm">
                  {t("login.remember")}
                </span>
              </label>

              <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
                {canResetPassword && (
                  <Link
                    to="/auth/forgot-password"
                    className="text-gray-600 hover:text-gray-900 text-sm underline"
                  >
                    {t("login.forgot_password")}
                  </Link>
                )}
                <Link
                  to="/auth/register"
                  className="text-gray-600 hover:text-gray-900 text-sm underline"
                >
                  {t("login.no_account")}
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="mt-2 w-full justify-center text-center"
                disabled={submitting}
              >
                {submitting ? t("login.submitting") : t("login.submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src="https://picsum.photos/800/800"
          alt="login img"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    </Card>
  );
}
