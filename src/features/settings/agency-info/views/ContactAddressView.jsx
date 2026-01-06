import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContactAddressView({ data }) {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <CardHeader className="px-0">
          <CardTitle className="text-lg font-semibold">
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.email || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.phone || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Phone 2</label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.phone2 || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Website</label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.website ? (
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {data.website}
                </a>
              ) : (
                "Not specified"
              )}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Instagram
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.instagram ? (
                <a
                  href={`https://instagram.com/${data.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  @{data.instagram}
                </a>
              ) : (
                "Not specified"
              )}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              LinkedIn
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.linkedIn ? (
                <a
                  href={data.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {data.linkedIn}
                </a>
              ) : (
                "Not specified"
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardHeader className="px-0">
          <CardTitle className="text-lg font-semibold">
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-0">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Address Line 1
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.address_line1 || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Address Line 2
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.address_line2 || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">City</label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.city || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">State</label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.state || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Country</label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.country || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Postal Code
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {data?.postal_code || "Not specified"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
