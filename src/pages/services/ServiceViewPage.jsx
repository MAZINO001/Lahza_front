// src/pages/services/ServiceViewPage.jsx
import ServicesSidebar from "@/components/services_offers/service_sidebar";
import ServicePage from "@/components/services_offers/service_offers_page";
import { useServices, useService } from "@/features/services/hooks/useServiceQuery";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ServiceViewPage() {
  const { id } = useParams();

  const {
    data: services = [],
    isLoading: servicesLoading,
    isError: servicesError,
  } = useServices();

  const {
    data: service,
    isLoading: serviceLoading,
    isError: serviceError,
  } = useService(id);

  if (servicesLoading || serviceLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-80 border-r bg-white p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-10">
          <Skeleton className="h-12 w-96 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (servicesError || serviceError || !service) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {serviceError || servicesError
              ? "Failed to load service. Please try again."
              : "Service not found."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ServicesSidebar type="service" data={services} currentId={id} />
      <ServicePage type="service" data={service} />
    </div>
  );
}