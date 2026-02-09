// PlanCreate.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PlanForm } from "@/features/plans/components/PlanForm";
import { usePack } from "@/features/plans/hooks/usePacks";
import { toast } from "sonner";
import { useAuthContext } from "@/hooks/AuthContext";

export default function PlanCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuthContext();

  // Extract the pack ID from the URL path
  const pathSegments = location.pathname.split("/");
  const plansManagementIndex = pathSegments.indexOf("plans_management");
  const packId = plansManagementIndex !== -1 && plansManagementIndex + 1 < pathSegments.length
    ? pathSegments[plansManagementIndex + 1]
    : null;

  const { data: pack, isLoading } = usePack(packId);

  const handleSuccess = () => {
    toast.success("Plan created successfully");
    navigate(`/${role}/settings/plans_management/${packId}`);
  };

  const handleCancel = () => {
    navigate(`/${role}/settings/plans_management/${packId}`);
  };

  if (isLoading) {
    return <div className="p-12 text-center">Loading pack...</div>;
  }

  if (!pack) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Pack not found
      </div>
    );
  }

  return (
    <div>
      <PlanForm packId={packId} onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
