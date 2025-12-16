import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Trash2, X, AlertCircle, Loader2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import api from "@/lib/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useService } from "@/features/services/hooks/useServiceQuery";
import { useOffer } from "@/features/offers/hooks/useOffersQuery";

export default function ServicePage({ currentId, type }) {

  const servicesQuery = useService(currentId);
  const offersQuery = useOffer(currentId);

  const data = type === "service" ? servicesQuery.data : offersQuery.data;
  const isLoading = type === "service" ? servicesQuery.isLoading : offersQuery.isLoading;
  const isError = type === "service" ? servicesQuery.isError : offersQuery.isError;
  const error = type === "service" ? servicesQuery.error : offersQuery.error;

  const { role } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () =>
      api.delete(`${import.meta.env.VITE_BACKEND_URL}/${type}s/${currentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${type}s`] });
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
      );
      navigate(`/${role}/${type}s`);
    },
    onError: () => toast.error(`Failed to delete ${type}`),
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });


  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white border-b px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {type === "service" ? (data?.name || "Unnamed Service") : (data?.title || "Untitled Offer")}
        </h1>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/${role}/${type}/${currentId}/edit`} state={{ editId: currentId }}>
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Link>
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              if (confirm(`Are you sure you want to delete this ${type}?`)) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <Button variant="outline" className="h-8 w-8">
            <Link to={`/${role}/${type}s`}>
              <X className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-4 w-full">
        <Card>
          <CardContent className="space-y-6 py-4 px-4">

            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {type === "service" ? "Name" : "Title"}
              </p>
              <p className="text-lg font-semibold">
                {type === "service" ? (data?.name || "N/A") : (data?.title || "N/A")}
              </p>
            </div>


            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Description
              </p>
              <p className="text-md text-gray-800 whitespace-pre-wrap">
                {data?.description || (
                  <span className="text-gray-400 italic">
                    No description provided
                  </span>
                )}
              </p>
            </div>

            {type === "service" ? (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Base Price
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  ${data?.base_price ? Number(data.base_price).toFixed(2) : "0.00"}
                </p>
              </div>
            ) : (
              <>
                <div className="flex gap-8">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Start Date
                    </p>
                    <p className="text-md">{data?.start_date ? formatDate(data.start_date) : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      End Date
                    </p>
                    <p className="text-md">{data?.end_date ? formatDate(data.end_date) : "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-8 mt-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Discount Type
                    </p>
                    <p className="text-md capitalize">{data?.discount_type || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Discount Value
                    </p>
                    <p className="text-md">
                      {data?.discount_type === "percent"
                        ? `${data.discount_value || 0} %`
                        : `MAD ${data.discount_value || 0}`}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
