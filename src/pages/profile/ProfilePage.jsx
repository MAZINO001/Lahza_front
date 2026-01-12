import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuthContext } from "@/hooks/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit2, Calendar, Shield, Camera } from "lucide-react";
import FormField from "@/components/Form/FormField";
import InputError from "@/components/InputError";
import FileUploader from "@/components/Form/FileUploader";
import LanguageToggle from "@/components/LanguageToggle";
import CurrencyToggle, { CurrencyProvider } from "@/components/CurrencyToggle";

const ProfilePage = () => {
  const { user, role } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      address: user?.address || "",
      city: user?.city || "",
      country: user?.country || "",
      avatar: user?.avatar || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log("Updating profile:", data);
      // TODO: Add API call to update profile
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const onCancel = () => {
    reset();
    setIsEditing(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "team_member":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "client":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="p-4 bg-background min-h-screen flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and account settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={!isDirty}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-4">
                  {user?.name || "User Name"}
                  <Badge className={getRoleColor(role)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {role?.charAt(0).toUpperCase() + role?.slice(1)}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {user?.email || "user@example.com"}
                </CardDescription>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined{" "}
                    {new Date(user?.created_at).toLocaleDateString() ||
                      "Recently"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <CurrencyProvider>
                <LanguageToggle />
                <CurrencyToggle />
              </CurrencyProvider>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FormField
                  id="name"
                  label="Full Name"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.name?.message}
                  placeholder="Enter your full name"
                  disabled={!isEditing}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <FormField
                  id="email"
                  label="Email Address"
                  type="email"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.email?.message}
                  placeholder="Enter your email"
                  disabled={!isEditing}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <FormField
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.phone?.message}
                  placeholder="Enter your phone number"
                  disabled={!isEditing}
                />
              )}
            />

            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <FormField
                  id="country"
                  label="Country"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.country?.message}
                  placeholder="Enter your country"
                  disabled={!isEditing}
                />
              )}
            />
          </div>

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor="address" className="text-foreground">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter your address"
                  className="mt-1 border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  disabled={!isEditing}
                  rows={3}
                />
                {errors.address && (
                  <InputError
                    message={errors.address.message}
                    className="mt-2"
                  />
                )}
              </div>
            )}
          />

          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor="bio" className="text-foreground">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Tell us about yourself"
                  className="mt-1 border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  disabled={!isEditing}
                  rows={4}
                />
                {errors.bio && (
                  <InputError message={errors.bio.message} className="mt-2" />
                )}
              </div>
            )}
          />

          {isEditing && (
            <Controller
              name="avatar"
              control={control}
              render={({ field }) => (
                <FileUploader
                  label="Profile Picture"
                  placeholder="Upload your profile picture"
                  error={errors.avatar?.message}
                  {...field}
                />
              )}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
