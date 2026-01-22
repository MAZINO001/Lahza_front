/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import FormSection from "@/components/Form/FormSection";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SelectField from "@/components/Form/SelectField";
import {
  usePreferences,
  useUpdatePreferences,
} from "../../hooks/usePreferencesQuery";

export default function GeneralPreferences() {
  const { data: preferences, isLoading } = usePreferences();
  const updatePreferences = useUpdatePreferences();

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      dark_mode: false,
      language: "en",
      currency: "eur",
    },
  });

  const watchedLanguage = watch("language");
  console.log("Current language value:", watchedLanguage);

  useEffect(() => {
    if (preferences?.ui) {
      reset({
        dark_mode: preferences.ui.dark_mode || false,
        language: preferences.ui.language || "en",
        currency:
          preferences.ui.currency ||
          localStorage.getItem("userCurrency") ||
          "eur",
      });
    }
  }, [
    preferences?.ui?.language,
    preferences?.ui?.dark_mode,
    preferences?.ui?.currency,
    reset,
  ]);

  const onSubmit = (values) => {
    const formattedData = {
      ui: {
        dark_mode: values.dark_mode,
        language: values.language,
        currency: values.currency,
      },
    };

    console.log("Submitting preferences payload:", formattedData);
    console.log("Form values:", values);

    // Save currency to localStorage as fallback since backend isn't storing it
    localStorage.setItem("userCurrency", values.currency);

    updatePreferences.mutate(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <h1 className="font-semibold text-lg mb-6">General</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Dark Mode</Label>
          </div>
          <Controller
            name="dark_mode"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            Language & Region
          </h3>

          <div className="rounded-lg space-y-4 flex gap-4">
            <div className="w-[50%]">
              <Controller
                name="language"
                control={control}
                render={({ field }) => {
                  console.log("Controller render - field.value:", field.value);
                  return (
                    <SelectField
                      label="Language"
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      options={[
                        { value: "en", label: "English" },
                        { value: "fr", label: "French" },
                        { value: "es", label: "Spanish" },
                        { value: "ar", label: "Arabic" },
                      ]}
                    />
                  );
                }}
              />
            </div>
            <div className="w-[50%]">
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Currency"
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    options={[
                      { value: "usd", label: "USD - US Dollar ($)" },
                      { value: "eur", label: "EUR - Euro (€)" },
                      { value: "mad", label: "MAD - Moroccan Dirham (د.م.)" },
                    ]}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={updatePreferences.isPending}>
          {updatePreferences.isPending ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </form>
  );
}
