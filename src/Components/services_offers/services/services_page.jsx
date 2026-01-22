import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, X, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { toast } from "sonner";
import { useService } from "@/features/services/hooks/useServices";
import Transactions from "@/components/services_offers/services/service_Transactions";
import Overview from "@/components/services_offers/services/overview";
import { useDeleteService } from "@/features/services/hooks/useServicesData";

export default function ServicePage({ currentId }) {
  const { data, isLoading, isError } = useService(currentId);
  const [activeTab, setActiveTab] = useState("overview");
  const { role } = useAuthContext();
  const navigate = useNavigate();

  const deleteMutation = useDeleteService();

  const handleDeleteService = () => {
    if (!currentId) {
      toast.error("Service ID not found");
      return;
    }
    deleteMutation.mutate(currentId, {
      onSuccess: () => {
        navigate(`/${role}/services`);
      },
      onError: () => {
        console.error("Deletion failed");
      },
    });
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "transactions", label: "Transactions" },
  ];
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
          <p className="text-muted-foreground">Failed to load service</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-t px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          {data?.name || "Unnamed Service"}
        </h1>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" asChild className="flex-1 sm:flex-none">
            <Link
              to={`/${role}/service/${currentId}/edit`}
              state={{ editId: currentId }}
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Link>
          </Button>

          <Button
            variant="destructive"
            onClick={handleDeleteService}
            disabled={deleteMutation.isPending}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2 hidden sm:block"></div>

          <Button variant="outline" className="h-8 w-8 hidden sm:flex">
            <Link to={`/${role}/services`}>
              <X className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="border-b border-border overflow-x-auto">
        <div className="flex px-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-muted-foreground  hover:text-foreground "
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 w-full">
        {activeTab === "overview" && <Overview data={data} />}
        {activeTab === "transactions" && <Transactions currentId={currentId} />}
      </div>
    </div>
  );
}
