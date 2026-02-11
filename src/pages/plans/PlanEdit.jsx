import React from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { useAuthContext } from "@/hooks/AuthContext";

import { PlanForm } from "@/features/plans/components/PlanForm";

import { usePlan } from "@/features/plans/hooks/usePlans";

export default function PlanEdit() {
  const location = useLocation();

  const navigate = useNavigate();

  const { role } = useAuthContext();

  // Extract the pack ID and plan ID from the URL path

  const pathSegments = location.pathname.split("/");

  const plansManagementIndex = pathSegments.indexOf("plans_management");

  const packId =
    plansManagementIndex !== -1 &&
    plansManagementIndex + 1 < pathSegments.length
      ? pathSegments[plansManagementIndex + 1]
      : null;

  const plansIndex = pathSegments.indexOf("plans");

  const planId =
    plansIndex !== -1 && plansIndex + 1 < pathSegments.length
      ? pathSegments[plansIndex + 1]
      : null;

  const { data: plan, isLoading, error } = usePlan(planId);

  const handleSuccess = () => {
    navigate(`/${role}/settings/plans_management/${packId}`);
  };

  const handleCancel = () => {
    navigate(`/${role}/settings/plans_management/${packId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading plan...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-destructive">
          Error loading plan: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PlanForm
        plan={plan?.data}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        packId={packId}
      />
    </div>
  );
}
