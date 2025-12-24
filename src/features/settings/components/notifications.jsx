/* eslint-disable no-unused-vars */
import React from "react";
import { useForm, Controller } from "react-hook-form";
import FormSection from "@/components/Form/FormSection";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Notifications() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email_notifications: true,
      in_app_notifications: true,

      new_client: true,
      new_project: true,
      project_deadline: true,
      invoice_paid: true,
      invoice_overdue: false,

      weekly_summary: true,
    },
  });

  const onSubmit = (values) => {
    console.log("NOTIFICATIONS SETTINGS", values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <FormSection title="Notifications Preferences">
        <div className="flex w-full gap-4 ">
          <div className="w-[50%]">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                General
              </h3>

              <Setting
                label="Email Notifications"
                description="Receive important updates by email"
                name="email_notifications"
                control={control}
              />

              <Setting
                label="In-App Notifications"
                description="Get notified inside the dashboard"
                name="in_app_notifications"
                control={control}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                Activity
              </h3>

              <Setting
                label="New Client"
                description="When a new client is added"
                name="new_client"
                control={control}
              />

              <Setting
                label="New Project"
                description="When a project is created"
                name="new_project"
                control={control}
              />

              <Setting
                label="Project Deadline"
                description="Before a project deadline"
                name="project_deadline"
                control={control}
              />
            </div>
          </div>
          <div className="w-[50%]">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                Billing
              </h3>

              <Setting
                label="Invoice Paid"
                description="When a client pays an invoice"
                name="invoice_paid"
                control={control}
              />

              <Setting
                label="Invoice Overdue"
                description="When an invoice becomes overdue"
                name="invoice_overdue"
                control={control}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                Summary
              </h3>

              <Setting
                label="Weekly Summary"
                description="Receive a weekly activity recap"
                name="weekly_summary"
                control={control}
              />
            </div>
          </div>
        </div>
      </FormSection>

      <div className="mt-6 flex justify-end">
        <Button type="submit">Save Preferences</Button>
      </div>
    </form>
  );
}

/* ----------------------------- */
/* Reusable Setting Row */
/* ----------------------------- */

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
