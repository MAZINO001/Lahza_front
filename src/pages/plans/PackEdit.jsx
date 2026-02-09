// PackEdit.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PackForm } from "@/features/plans/components/PackForm";
import { usePack } from "@/features/plans/hooks/usePacks";
import { toast } from "sonner";
import { useAuthContext } from "@/hooks/AuthContext";

export default function PackEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const { data: pack, isLoading } = usePack(id);

  const handleSuccess = () => {
    toast.success("Pack updated successfully");
    navigate(`/${role}/packs/${id}`);
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
    <div className="p-4 min-h-screen">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Edit Pack</h1>
        <p className="text-muted-foreground mt-1">
          Update the pack details and configuration
        </p>
      </div>
      <PackForm pack={pack} onSuccess={handleSuccess} />
    </div>
  );
}
