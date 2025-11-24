// src/Components/services/service_page.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Trash2, X } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // optional, or use alert()

export default function ServicePage({ data }) {
  const { role } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () =>
      api.delete(`${import.meta.env.VITE_BACKEND_URL}/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted successfully");
      navigate(`/${role}/services`);
    },
    onError: () => toast.error("Failed to delete service"),
  });

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-700 mb-2">
            No service selected
          </p>
          <p className="text-sm text-gray-500">
            Choose a service from the sidebar or create a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white border-b px-4 py-4 flex items-center justify-between ">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/${role}/service/new`} state={{ editId: id }}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>

          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => {
              if (confirm("Are you sure you want to delete this service?")) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <Button variant="outline" className="h-8 w-8 cursor-pointer">
            <Link to={`/${role}/services`}>
              <X className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-4 w-full">
        <Card className="p-0 m-0">
          <CardContent className="space-y-6 py-4 px-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Name</p>
              <p className="text-lg font-semibold">{data.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Description
              </p>
              <p className="text-gray-800 whitespace-pre-wrap">
                {data.description || (
                  <span className="text-gray-400 italic">
                    No description provided
                  </span>
                )}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Base Price
              </p>
              <p className="text-3xl font-bold text-blue-600">
                ${Number(data.base_price).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
