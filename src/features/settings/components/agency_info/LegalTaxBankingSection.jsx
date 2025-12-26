import React from "react";
import { Controller } from "react-hook-form";
import FormField from "@/components/Form/FormField";
import FormSection from "@/components/Form/FormSection";

export function LegalTaxBankingSection({ control, errors }) {
  return (
    <form className="flex flex-col gap-4">
      <h1 className="font-semibold text-lg">Legal, Tax & Banking</h1>
      <div className="space-y-6">
        {/* Morocco IDs */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Controller
              name="ma_ice"
              control={control}
              render={({ field }) => (
                <FormField
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  label="ICE (Morocco)"
                  id="ma_ice"
                  placeholder="Enter ICE number"
                  error={errors.ma_ice?.message}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="ma_if"
              control={control}
              render={({ field }) => (
                <FormField
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  label="IF (Morocco)"
                  id="ma_if"
                  placeholder="Enter IF number"
                  error={errors.ma_if?.message}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="ma_cnss"
              control={control}
              render={({ field }) => (
                <FormField
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  label="CNSS (Morocco)"
                  id="ma_cnss"
                  placeholder="Enter CNSS number"
                  error={errors.ma_cnss?.message}
                />
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Controller
              name="ma_rc"
              control={control}
              render={({ field }) => (
                <FormField
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  label="RC (Morocco)"
                  id="ma_rc"
                  placeholder="Enter RC number"
                  error={errors.ma_rc?.message}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="ma_vat"
              control={control}
              render={({ field }) => (
                <FormField
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  label="VAT (Morocco)"
                  id="ma_vat"
                  placeholder="Enter VAT number"
                  error={errors.ma_vat?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Controller
              name="fr_siret"
              control={control}
              render={({ field }) => (
                <FormField
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  label="SIRET (France)"
                  id="fr_siret"
                  placeholder="Enter SIRET number"
                  error={errors.fr_siret?.message}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="fr_vat"
              control={control}
              render={({ field }) => (
                <FormField
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  label="VAT (France)"
                  id="fr_vat"
                  placeholder="Enter VAT number"
                  error={errors.fr_vat?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Banking */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Controller
              name="bank_name"
              control={control}
              render={({ field }) => (
                <FormField
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  label="Bank Name"
                  id="bank_name"
                  placeholder="Enter bank name"
                  error={errors.bank_name?.message}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="rib"
              control={control}
              render={({ field }) => (
                <FormField
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  label="RIB"
                  id="rib"
                  placeholder="Enter RIB number"
                  error={errors.rib?.message}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="account_name"
              control={control}
              render={({ field }) => (
                <FormField
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  label="Account Name"
                  id="account_name"
                  placeholder="Enter account name"
                  error={errors.account_name?.message}
                />
              )}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
