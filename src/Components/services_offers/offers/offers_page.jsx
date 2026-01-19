import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Trash2, X, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import api from "@/lib/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOffer } from "@/features/offers/hooks/useOffersQuery";

export default function OfferPage({ currentId }) {
  const { data, isLoading, isError } = useOffer(currentId);
  const { role } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () =>
      api.delete(`${import.meta.env.VITE_BACKEND_URL}/offers/${currentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Offer deleted successfully");
      navigate(`/${role}/offers`);
    },
    onError: () => toast.error("Failed to delete offer"),
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

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
          <p className="text-muted-foreground">Failed to load offer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-t px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {data?.title || "Untitled Offer"}
        </h1>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link
              to={`/${role}/offer/${currentId}/edit`}
              state={{ editId: currentId }}
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Link>
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Are you sure you want to delete this offer?")) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <Button variant="outline" className="h-8 w-8">
            <Link to={`/${role}/offers`}>
              <X className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-4 w-full">
        <Card>
          <CardContent className="space-y-6 py-4 px-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </p>
              <div className="text-md text-foreground whitespace-pre-wrap">
                {data?.description ? (
                  <div dangerouslySetInnerHTML={{ __html: data.description }} />
                ) : (
                  <span className="text-muted-foreground italic">
                    No description provided
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-8">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Start Date
                </p>
                <p className="text-md">
                  {data?.start_date ? formatDate(data.start_date) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  End Date
                </p>
                <p className="text-md">
                  {data?.end_date ? formatDate(data.end_date) : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex gap-8 mt-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Discount Type
                </p>
                <p className="text-md capitalize">
                  {data?.discount_type || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Discount Value
                </p>
                <p className="text-md">
                  {data?.discount_type === "percent"
                    ? `${data?.discount_value || 0} %`
                    : `MAD ${data?.discount_value || 0}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
