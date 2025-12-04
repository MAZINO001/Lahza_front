// src/pages/services/ServicesPage.jsx
import { ServiceTable } from "@/features/services/components/ServiceTable";
import { useServices } from "@/features/services/hooks/useServiceQuery";

export default function ServicesPage() {
  const { data: services = [], isLoading } = useServices();

  return <ServiceTable services={services} isLoading={isLoading} />;
}