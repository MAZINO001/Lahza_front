/* eslint-disable no-unused-vars */
import React from "react";
import { useForm, Controller } from "react-hook-form";
import FormSection from "@/components/Form/FormSection";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SelectField from "@/components/Form/SelectField";

export default function GeneralPreferences() {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            dark_mode: false,
            language: "en",
            timezone: "Africa/Casablanca",
        },
    });

    const onSubmit = (values) => {
        const formattedData = {
            ui: {
                dark_mode: values.dark_mode,
                language: values.language,
                timezone: values.timezone,
            },
        };

        // Process general settings
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <h1 className="font-semibold text-lg">General</h1>
            <FormSection title="Preferences">
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">Dark Mode</Label>
                        </div>
                        <Controller
                            name="dark_mode"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                            Language & Region
                        </h3>

                        <div className="rounded-lg border p-4 space-y-2">
                            <Controller
                                name="language"
                                control={control}
                                render={({ field }) => (
                                    <SelectField
                                        Label="Language"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        options={[
                                            { value: "en", label: "English" },
                                            { value: "fr", label: "French" },
                                            { value: "es", label: "Spanish" },
                                            { value: "ar", label: "Arabic" },
                                        ]}
                                    />
                                )}
                            />
                        </div>

                        <div className="rounded-lg border p-4 space-y-2 mt-4">
                            <Controller
                                name="timezone"
                                control={control}
                                render={({ field }) => (
                                    <SelectField
                                        Label="timezone"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        options={[
                                            {
                                                value: "Africa/Casablanca",
                                                label: "Africa / Casablanca",
                                            },
                                            { value: "Europe/Paris", label: "Europe / Paris" },
                                            { value: "UTC", label: "UTC" },
                                        ]}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </FormSection>
            <div className="mt-4 flex justify-end">
                <Button type="submit">Save Preferences</Button>
            </div>
        </form>
    );
}
