// ContactAddressSection.jsx
import React from "react";
import { Controller } from "react-hook-form";
import FormField from "@/components/Form/FormField";
import FormSection from "@/components/Form/FormSection";

export function ContactAddressSection({ control, errors }) {
  return (
    <form className="flex flex-col gap-4">
      <h1 className="font-semibold text-lg">Contact & Address</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* Contact */}
        <div className="space-y-2">
          <Controller
            name="email"
            control={control}
            rules={{
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            }}
            render={({ field }) => (
              <FormField
                type="email"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="Email"
                id="email"
                placeholder="Enter email address"
                error={errors.email?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <FormField
                type="text"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="Phone"
                id="phone"
                placeholder="Enter phone number"
                error={errors.phone?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="phone2"
            control={control}
            render={({ field }) => (
              <FormField
                type="text"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="Phone 2"
                id="phone2"
                placeholder="Enter secondary phone number"
                error={errors.phone2?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <FormField
                type="text"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="Website"
                id="website"
                placeholder="Enter website URL"
                error={errors.website?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="instagram"
            control={control}
            render={({ field }) => (
              <FormField
                type="text"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="Instagram"
                id="instagram"
                placeholder="Enter instagram account url"
                error={errors.website?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="linkedIn"
            control={control}
            render={({ field }) => (
              <FormField
                type="text"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="LinkedIn"
                id="linkedIn"
                placeholder="Enter LinkedIn account url"
                error={errors.website?.message}
              />
            )}
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Controller
            name="address_line1"
            control={control}
            render={({ field }) => (
              <FormField
                type="text"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="Address Line 1"
                id="address_line1"
                placeholder="Enter address line 1"
                error={errors.address_line1?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="address_line2"
            control={control}
            render={({ field }) => (
              <FormField
                type="text"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="Address Line 2"
                id="address_line2"
                placeholder="Enter address line 2"
                error={errors.address_line2?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <FormField
                type="text"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="City"
                id="city"
                placeholder="Enter city"
                error={errors.city?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <FormField
                type="text"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="State / Region"
                id="state"
                placeholder="Enter state or region"
                error={errors.state?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <FormField
                type="text"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="Country"
                id="country"
                placeholder="Enter country"
                error={errors.country?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            name="postal_code"
            control={control}
            render={({ field }) => (
              <FormField
                type="text"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="Postal Code"
                id="postal_code"
                placeholder="Enter postal code"
                error={errors.postal_code?.message}
              />
            )}
          />
        </div>
      </div>
    </form>
  );
}
