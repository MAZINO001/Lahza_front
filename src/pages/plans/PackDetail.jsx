// PackDetail.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Plus, Edit, Trash2, Check } from "lucide-react";
import { usePack, useDeletePack } from "@/features/plans/hooks/usePacks";
import { usePlans } from "@/features/plans/hooks/usePlans";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/hooks/AuthContext";
import Plan from "./Plan";

export default function PackDetail() {
  const location = useLocation();
  const { role } = useAuthContext();
  const navigate = useNavigate();

  // Extract the pack ID from the URL path
  const pathSegments = location.pathname.split("/");
  const plansManagementIndex = pathSegments.indexOf("plans_management");
  const id =
    plansManagementIndex !== -1 &&
    plansManagementIndex + 1 < pathSegments.length
      ? pathSegments[plansManagementIndex + 1]
      : null;

  const { data: pack, isLoading: packLoading } = usePack(id);
  const { data: plans, isLoading: plansLoading } = usePlans(id);
  const [isAnnual, setIsAnnual] = useState(false);
  const deletePack = useDeletePack();

  const handleDeletePack = () => {
    if (
      !window.confirm(`Delete entire pack "${pack?.name}" and all its plans?`)
    )
      return;
    deletePack.mutate(id, {
      onSuccess: () => {
        toast.success("Pack deleted");
        navigate(`/${role}/settings/plans_management`);
      },
    });
  };

  if (packLoading || plansLoading) {
    return <div className="p-12 text-center">Loading...</div>;
  }

  if (!pack) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Pack not found
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold text-lg">Plans in :{pack?.name}</h1>
        <Button
          onClick={() =>
            navigate(`/${role}/settings/plans_management/${id}/plans/new`)
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <div className="p-4 text-center flex items-center justify-center flex-col">
          <p className="text-muted-foreground mb-4">
            No plans in this pack yet
          </p>
          <Button
            onClick={() =>
              navigate(`/${role}/settings/plans_management/${id}/plans/new`)
            }
          >
            Create First Plan
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {plans.map((plan) => (
            <Plan key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
