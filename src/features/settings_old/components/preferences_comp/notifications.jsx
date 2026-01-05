/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Notifications() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email_projects: true,
      email_invoices: true,
      email_quotes: true,
      email_payments: true,
      email_offers: true,
      in_app_projects: true,
      in_app_invoices: true,
      in_app_quotes: true,
      in_app_payments: true,
      in_app_offers: true,
    },
  });

  const emailNotifications = watch("email_notifications");
  const inAppNotifications = watch("in_app_notifications");

  const emailSettings = watch([
    "email_projects",
    "email_invoices",
    "email_quotes",
    "email_payments",
    "email_offers",
  ]);

  const inAppSettings = watch([
    "in_app_projects",
    "in_app_invoices",
    "in_app_quotes",
    "in_app_payments",
    "in_app_offers",
  ]);

  const lastEmailMasterRef = useRef(emailNotifications);
  const lastInAppMasterRef = useRef(inAppNotifications);

  useEffect(() => {
    if (lastEmailMasterRef.current !== emailNotifications) {
      if (!emailNotifications) {
        setValue("email_projects", false);
        setValue("email_invoices", false);
        setValue("email_quotes", false);
        setValue("email_payments", false);
        setValue("email_offers", false);
        setValue("email_invoices", false);
      }
      lastEmailMasterRef.current = emailNotifications;
    }
  }, [emailNotifications, setValue]);

  useEffect(() => {
    if (lastInAppMasterRef.current !== inAppNotifications) {
      if (!inAppNotifications) {
        setValue("in_app_projects", false);
        setValue("in_app_invoices", false);
        setValue("in_app_quotes", false);
        setValue("in_app_payments", false);
        setValue("in_app_offers", false);
      }
      lastInAppMasterRef.current = inAppNotifications;
    }
  }, [inAppNotifications, setValue]);

  useEffect(() => {
    const hasEmailEnabled = emailSettings.some((val) => val === true);
    if (hasEmailEnabled !== emailNotifications) {
      setValue("email_notifications", hasEmailEnabled);
    }
  }, [emailSettings, emailNotifications, setValue]);

  useEffect(() => {
    const hasInAppEnabled = inAppSettings.some((val) => val === true);
    if (hasInAppEnabled !== inAppNotifications) {
      setValue("in_app_notifications", hasInAppEnabled);
    }
  }, [inAppSettings, inAppNotifications, setValue]);

  const onSubmit = (values) => {
    const formattedData = {
      mail: {
        payments: values.email_payments,
        invoices: values.email_invoices,
        quotes: values.email_quotes,
        offers: values.email_offers,
      },
      app: {
        payments: values.in_app_payments,
        invoices: values.in_app_invoices,
        quotes: values.in_app_quotes,
        offers: values.in_app_offers,
      },
    };

    // Process notifications settings
  };

  function Setting({ label, description, name, control }) {
    return (
      <div className="flex items-center justify-between rounded-lg border p-4 mb-3">
        <div className="space-y-1">
          <Label className="text-sm font-medium">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="font-semibold text-lg mb-6">Notifications</h1>
      <div className="flex w-full gap-4">
        {/* Email Notifications */}
        <div className="w-[50%]">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            Email Notifications
          </h3>
          <Setting
            label="Enable Email Notifications"
            description="Receive updates by email"
            name="email_notifications"
            control={control}
          />
          <div className="mt-6 mb-4 ml-2 border-l-2 pl-4">
            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase">
              Notification Types
            </p>
            <Setting
              label="Projects"
              description="All actions related to new projects"
              name="email_projects"
              control={control}
            />
            <Setting
              label="Invoices"
              description="All actions related to invoices"
              name="email_invoices"
              control={control}
            />

            <Setting
              label="Quotes"
              description="All actions related to quotes"
              name="email_quotes"
              control={control}
            />
            <Setting
              label="Payments"
              description="All actions related to payments"
              name="email_payments"
              control={control}
            />
            <Setting
              label="Offers"
              description="All actions related to offers"
              name="email_offers"
              control={control}
            />
          </div>
        </div>

        {/* In-App Notifications */}
        <div className="w-[50%]">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            Browser Notifications
          </h3>
          <Setting
            label="Enable In-App Notifications"
            description="Get notified inside the dashboard"
            name="in_app_notifications"
            control={control}
          />
          <div className="mt-6 mb-4 ml-2 border-l-2 pl-4">
            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase">
              Notification Types
            </p>
            <Setting
              label="Projects"
              description="When a project is created"
              name="in_app_projects"
              control={control}
            />
            <Setting
              label="Invoices"
              description="All actions related to invoices"
              name="in_app_invoices"
              control={control}
            />

            <Setting
              label="Quotes"
              description="All actions related to quotes"
              name="in_app_quotes"
              control={control}
            />
            <Setting
              label="Payments"
              description="All actions related to payments"
              name="in_app_payments"
              control={control}
            />
            <Setting
              label="Offers"
              description="All actions related to offers"
              name="in_app_offers"
              control={control}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit(onSubmit)}>Save Preferences</Button>
      </div>
    </div>
  );
}
