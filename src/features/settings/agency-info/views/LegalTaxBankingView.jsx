import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LegalTaxBankingView({ data }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Legal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Morocco ICE
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.ma_ice || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Morocco IF
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.ma_if || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Morocco CNSS
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.ma_cnss || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Morocco RC
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.ma_rc || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Morocco VAT
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.ma_vat || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              France SIRET
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.fr_siret || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              France VAT
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.fr_vat || "Not specified"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Banking Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Bank Name
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.bank_name || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">RIB</label>
            <p className="mt-1 text-sm text-gray-900 font-mono">
              {data?.rib || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Account Name
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.account_name || "Not specified"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
