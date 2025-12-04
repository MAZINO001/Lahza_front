import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Trash2, X } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import api from "@/lib/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ServicePage({ data, type }) {
  const { role } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () =>
      api.delete(`${import.meta.env.VITE_BACKEND_URL}/${type}s/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${type}s`] });
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
      );
      navigate(`/${role}/${type}s`);
    },
    onError: () => toast.error(`Failed to delete ${type}`),
  });

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-700 mb-2">
            No {type} selected
          </p>
          <p className="text-sm text-gray-500">
            Choose a {type} from the sidebar or create a new one
          </p>
        </div>
      </div>
    );
  }

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
          {type === "service" ? data.name : data.title}
        </h1>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/${role}/${type}/${id}/edit`} state={{ editId: id }}>
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
            {/* Name / Title */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {type === "service" ? "Name" : "Title"}
              </p>
              <p className="text-lg font-semibold">
                {type === "service" ? data.name : data.title}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Description
              </p>
              <p className="text-md text-gray-800 whitespace-pre-wrap">
                {data.description || (
                  <span className="text-gray-400 italic">
                    No description provided
                  </span>
                )}
              </p>
            </div>

            {/* Service vs Offer Details */}
            {type === "service" ? (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Base Price
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  ${Number(data.base_price).toFixed(2)}
                </p>
              </div>
            ) : (
              <>
                <div className="flex gap-8">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Start Date
                    </p>
                    <p className="text-md">{formatDate(data.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      End Date
                    </p>
                    <p className="text-md">{formatDate(data.end_date)}</p>
                  </div>
                </div>
                <div className="flex gap-8 mt-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Discount Type
                    </p>
                    <p className="text-md capitalize">{data.discount_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Discount Value
                    </p>
                    <p className="text-md">
                      {data.discount_type === "percent"
                        ? `${data.discount_value} %`
                        : `MAD ${data.discount_value}`}
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
