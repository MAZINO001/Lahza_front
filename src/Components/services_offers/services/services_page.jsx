import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, X, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import api from "@/lib/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useService } from "@/features/services/hooks/useServiceQuery";
import Transactions from "@/components/services_offers/services/service_Transactions";
import Overview from "@/components/services_offers/services/overview";

export default function ServicePage({ currentId }) {
  const { data, isLoading, isError } = useService(currentId);
  const [activeTab, setActiveTab] = useState("overview");
  const { role } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () =>
      api.delete(`${import.meta.env.VITE_BACKEND_URL}/services/${currentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted successfully");
      navigate(`/${role}/services`);
    },
    onError: () => toast.error("Failed to delete service"),
  });

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
      <div className="bg-background border-b px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {data?.name || "Unnamed Service"}
        </h1>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link
              to={`/${role}/service/${currentId}/edit`}
              state={{ editId: currentId }}
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Link>
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Are you sure you want to delete this service?")) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <Button variant="outline" className="h-8 w-8">
            <Link to={`/${role}/services`}>
              <X className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-background border-b border-border">
        <div className="flex px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
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
