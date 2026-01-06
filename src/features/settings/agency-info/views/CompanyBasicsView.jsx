import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CompanyBasicsView({ data }) {
  return (
    <Card className="p-4">
      <CardHeader className="px-0">
        <CardTitle className="text-lg font-semibold">Company Basics</CardTitle>
      </CardHeader>
      <CardContent className=" space-y-4 px-0">
        <div>
          <label className="text-sm font-medium text-gray-500">
            Company Name
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {data?.company_name || "Not specified"}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Tagline</label>
          <p className="mt-1 text-sm text-gray-900">
            {data?.tagline || "Not specified"}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Description
          </label>
          <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
            {data?.description || "Not specified"}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Terms & Conditions
          </label>
          <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
            {data?.terms_and_conditions || "Not specified"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
