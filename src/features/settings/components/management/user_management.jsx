/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { useForm, Controller } from "react-hook-form";
import FormSection from "@/components/Form/FormSection";
import FormField from "@/components/Form/FormField";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function User_management() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const onInvite = (values) => {
    // Invite user logic
    reset();
  };

  return (
    <div className="w-full space-y-4">
      <FormSection title="Invite Team Member">
        <form
          onSubmit={handleSubmit(onInvite)}
          className="flex gap-4 items-end"
        >
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <FormField
                label="Email Address"
                placeholder="user@agency.com"
                {...field}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <div className="w-48">
                <label className="text-sm font-medium mb-1 block">Role</label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Button type="submit">Send Invite</Button>
        </form>
      </FormSection>

      <Separator />

      {/* Team Members */}
      <FormSection title="Team Members">
        <div className="space-y-3">
          {/* Member Row */}
          <MemberRow
            name="John Doe"
            email="john@agency.com"
            role="Owner"
            status="Active"
          />

          <MemberRow
            name="Sarah Smith"
            email="sarah@agency.com"
            role="Admin"
            status="Active"
          />

          <MemberRow
            name="Alex Brown"
            email="alex@agency.com"
            role="Member"
            status="Pending"
          />
        </div>
      </FormSection>
    </div>
  );
}

/* ----------------------------- */
/* Member Row */
/* ----------------------------- */

function MemberRow({ name, email, role, status }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{email}</p>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant={status === "Active" ? "default" : "secondary"}>
          {status}
        </Badge>
        <Badge variant="outline">{role}</Badge>
        <Button variant="ghost" size="sm">
          Manage
        </Button>
      </div>
    </div>
  );
}
