import React from "react";
import { useForm, Controller } from "react-hook-form";
import FormSection from "@/components/Form/FormSection";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Preferences() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      dark_mode: false,
      language: "en",
      timezone: "Africa/Casablanca",
      date_format: "DD/MM/YYYY",
      reduce_motion: false,
    },
  });

  const onSubmit = (values) => {
    console.log("PREFERENCES", values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl">
      <FormSection title="Preferences">
        <div className="space-y-6">
          {/* Appearance */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">
              Appearance
            </h3>

            <Setting
              label="Dark Mode"
              description="Use dark theme across the dashboard"
              name="dark_mode"
              control={control}
            />
            
          </div>

          {/* Language & Region */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">
              Language & Region
            </h3>

            <div className="rounded-lg border p-4 space-y-2">
              <Label className="text-sm font-medium">Language</Label>

              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="rounded-lg border p-4 space-y-2 mt-3">
              <Label className="text-sm font-medium">Timezone</Label>

              <Controller
                name="timezone"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Casablanca">
                        Africa / Casablanca
                      </SelectItem>
                      <SelectItem value="Europe/Paris">
                        Europe / Paris
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                )}
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
/* Reusable Switch Row */
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
