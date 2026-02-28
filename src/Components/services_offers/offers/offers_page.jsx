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
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

export default function OfferPage({ currentId }) {
  const { data, isLoading, isError } = useOffer(currentId);
  const { role } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formatAmount = useCurrencyStore((state) => state.formatAmount);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);
  console.log(data);

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
      <div className="sticky top-0 z-10 border-b border-t backdrop-blur-sm px-4 py-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground truncate max-w-[60%]">
          {data?.title || "Untitled Offer"}
        </h1>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link
              to={`/${role}/offer/${currentId}/edit`}
              state={{ editId: currentId }}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              deleteMutation.mutate();
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>

          <div className="h-5 w-px bg-border mx-1" />

          <Button variant="ghost" size="icon" asChild>
            <Link to={`/${role}/offers`}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 max-w-5xl mx-auto">
        <Card className="border-border shadow-sm">
          <CardContent className="pt-4 space-y-8">
            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Description
              </h3>
              {data?.description ? (
                <div
                  className="text-sm leading-relaxed text-foreground prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No description provided.
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Start Date
                </h3>
                <p className="text-base font-medium">
                  {data?.start_date ? formatDate(data.start_date) : "—"}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  End Date
                </h3>
                <p className="text-base font-medium">
                  {data?.end_date ? formatDate(data.end_date) : "—"}
                </p>
              </div>
            </div>

            {/* Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Discount Type
                </h3>
                <p className="text-base font-medium capitalize">
                  {data?.discount_type || "—"}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Discount Value
                </h3>
                <p className="text-base font-medium">
                  {data?.discount_type === "percent"
                    ? `${data?.discount_value || 0}%`
                    : data?.discount_value
                      ? `${formatAmount(data.discount_value || 0, "MAD")}`
                      : "—"}
                </p>
              </div>
              {formatAmount(data.totalPaid || 0, "MAD")}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
