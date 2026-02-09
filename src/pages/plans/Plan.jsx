import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeletePlan } from "@/features/plans/hooks/usePlans";
import { useAuthContext } from "@/hooks/AuthContext";
import { toast } from "sonner";
import AlertDialogDestructive from "@/components/alert-dialog-destructive-1";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Plan({ plan }) {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const deletePlan = useDeletePlan();

  console.log(plan);

  const handleEdit = () => {
    navigate(
      `/${role}/settings/plans_management/${plan.pack_id}/plans/${plan.id}/edit`,
    );
  };

  const handleDelete = () => {
    deletePlan.mutate(plan.id, {
      onSuccess: () => {
        toast.success("Plan deleted successfully");
      },
    });
  };
  return (
    <Card className="overflow-hidden border-2 relative">
      <CardHeader className="bg-pt-6">
        <div className="flex flex-col items-center text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">
            {plan.name}
          </CardTitle>
          <div className="mt-4 text-4xl font-extrabold text-emerald-600">
            {plan.prices?.[0]?.currency || "MAD"}{" "}
            {Number(plan.prices?.[0]?.price || 0).toLocaleString()}
          </div>
          <CardDescription className="mt-2 text-base font-medium text-emerald-700">
            {plan.prices?.[0]?.interval || "yearly"} access
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 px-4 space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${plan.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
                }`}
            >
              {plan.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          {plan.description && (
            <p className="text-sm text-gray-700 mt-2">{plan.description}</p>
          )}
        </div>

        <div>
          <h4 className="text-base font-semibold mb-4 text-gray-700 border-b pb-2">
            Plan Details & Limits
          </h4>
          <ul className="space-y-3 text-gray-700">
            {plan.custom_fields?.map((field) => (
              <li key={field.id} className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 shrink-0" />
                <span>
                  {field.label || field.key}:{" "}
                  <span className="font-medium">
                    {field.default_value === "true" ||
                      field.default_value === true
                      ? "Yes"
                      : field.default_value === "false" ||
                        field.default_value === false
                        ? "No"
                        : field.default_value || "—"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4 w-full">
          <Button variant="outline" className="flex-1" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <AlertDialogDestructive
            onDelete={handleDelete}
            trigger={
              <Button
                variant="destructive"
                className="flex-1"
                disabled={deletePlan.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deletePlan.isPending ? "Deleting..." : "Delete"}
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
