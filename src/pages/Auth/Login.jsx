/* eslint-disable no-unused-vars */
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
import FormField from "@/components/Form/FormField";
import { toast } from "sonner";
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
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-background border border-border flex flex-col md:flex-row text-foreground w-full h-screen p-0 gap-0">
      <div className="bg-background flex flex-col  md:w-1/2 p-4 justify-center items-center">
        <div className="w-full max-w-md ">
          <CardTitle className="mb-12">
            <h1 className="mb-4 text-center text-3xl font-extrabold  text-foreground">
              {t("login.title")}
            </h1>
            <p className="text-center text-sm text-muted-foreground">
              {t("login.description")}
            </p>
          </CardTitle>

          {status && (
            <div className="text-green-600 mb-4 text-center text-sm font-medium">
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <FormField
                id="email"
                label={t("login.email")}
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
                placeholder="examle@example.com"
                autoComplete="email"
                isFocused
              />
              <InputError message={errors.email?.message} className="mt-2" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <InputLabel htmlFor="password" value={t("login.password")} />
                <Link to={"/forgot-password"} className="text-sm underline">
                  Forgot Password?
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
                  className="border-border text-indigo-600 focus:ring-indigo-500 rounded shadow-sm"
                />
                <span className="text-muted-foreground ml-2 select-none text-sm">
                  {t("login.remember")}
                </span>
              </label>
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
            {/* <div className="flex items-center gap-1 w-full">
              <div className="flex-1 h-[0.4px] bg-border"></div>
              <p className="text-muted-foreground text-sm whitespace-nowrap">
                Or continue with
              </p>
              <div className="flex-1 h-[0.4px] bg-border"></div>
            </div> */}
            <Link
              to="/auth/register"
              className="text-muted-foreground hover:text-foreground text-sm underline"
            >
              {t("login.no_account")}
            </Link>
          </form>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src="https://picsum.photos/800/800"
          alt="login img"
          className="w-full h-full object-cover"
        />
      </div>
    </Card>
  );
}
