/* eslint-disable no-unused-vars */
import { ArrowLeft, Save } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "react-router-dom";
import SelectField from "@/components/Form/SelectField";
import FormField from "@/components/Form/FormField";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const defaultPermissions = [
    { id: "create_content", label: "Create Content" },
    { id: "edit_content", label: "Edit Content" },
    { id: "delete_content", label: "Delete Content" },
    { id: "manage_users", label: "Manage Users" },
    { id: "manage_roles", label: "Manage Roles" },
    { id: "view_analytics", label: "View Analytics" },
    { id: "manage_settings", label: "Manage Settings" },
    { id: "export_data", label: "Export Data" },
    { id: "view_reports", label: "View Reports" },
    { id: "approve_content", label: "Approve Content" },
  ];

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      joinDate: "2024-01-15",
      permissions: {
        create_content: true,
        edit_content: true,
        delete_content: false,
        manage_users: true,
        manage_roles: true,
        view_analytics: true,
        manage_settings: false,
        export_data: true,
        view_reports: true,
        approve_content: false,
      },
    },
  });

  const permissions = watch("permissions");

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("User updated successfully");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/admin/settings/users_management")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-2 gap-4">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Name"
                      id="name"
                      type="text"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      className="mt-1"
                      label="Email"
                      type="email"
                      id="email"
                      {...field}
                      disabled
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      id="role"
                      label="Role"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select a role"
                      options={[
                        { value: "Admin", label: "Admin" },
                        { value: "Editor", label: "Editor" },
                        { value: "Viewer", label: "Viewer" },
                      ]}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      id="status"
                      label="Status"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select a status"
                      options={[
                        { value: "Active", label: "Active" },
                        { value: "Inactive", label: "Inactive" },
                        { value: "Suspended", label: "Suspended" },
                      ]}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="joinDate"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Join Date"
                      id="joinDate"
                      {...field}
                      type="date"
                      value={field.value}
                      disabled
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {defaultPermissions.map((perm) => (
                  <Controller
                    key={perm.id}
                    name={`permissions.${perm.id}`}
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="text-sm flex-1">{perm.label}</span>
                      </div>
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="submit" className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
