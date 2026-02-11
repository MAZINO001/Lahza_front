/* eslint-disable react-hooks/rules-of-hooks */
// PackForm.jsx
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import FormField from "@/Components/Form/FormField";
import { useCreatePack, useUpdatePack } from "../hooks/usePacks";
import { useAuthContext } from "@/hooks/AuthContext";

export function PackForm({ pack, onSuccess, onCancel }) {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const isEdit = !!pack?.id;

  const mutation = isEdit ? useUpdatePack() : useCreatePack();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (pack) {
      reset({
        name: pack.name || "",
        description: pack.description || "",
        is_active: pack.is_active !== false,
      });
    }
  }, [pack, reset]);

  const onSubmit = (data) => {
    if (isEdit) {
      mutation.mutate(
        { id: pack.id, ...data },
        {
          onSuccess: () => {
            onSuccess?.();
          },
          onError: (err) => {
            // errors are handled by the mutation hook
          },
        },
      );
    } else {
      mutation.mutate(data, {
        onSuccess: () => {
          onSuccess?.();
          reset();
        },
        onError: (err) => {
          // errors are handled by the mutation hook
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Controller
          name="name"
          control={control}
          rules={{ required: "Pack name is required" }}
          render={({ field }) => (
            <FormField
              label="Pack Name"
              placeholder="e.g. Business Solutions, Enterprise, Starter"
              error={errors.name?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                placeholder="Describe this pack..."
                className="min-h-[100px]"
                {...field}
                value={field.value || ""}
              />
            </div>
          )}
        />

        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              <Label>Active</Label>
            </div>
          )}
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || (() => navigate(`/${role}/packs`))}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : isEdit
              ? "Update Pack"
              : "Create Pack"}
        </Button>
      </div>
    </form>
  );
}
