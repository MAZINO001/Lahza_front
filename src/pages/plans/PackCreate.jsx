// PackCreate.jsx
import React from "react";
import { PackForm } from "@/features/plans/components/PackForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthContext } from "@/hooks/AuthContext";

export default function PackCreate() {
  const navigate = useNavigate();
  const { role } = useAuthContext();

  const handleSuccess = () => {
    toast.success("Pack created successfully");
    navigate(`/${role}/packs`);
  };

  return (
    <div className="p-4 min-h-screen">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Create New Pack</h1>
        <p className="text-muted-foreground mt-1">
          Create a new subscription pack to organize your plans
        </p>
      </div>
      <PackForm onSuccess={handleSuccess} />
    </div>
  );
}
