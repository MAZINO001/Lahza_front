// src/pages/services/ServiceViewPage.jsx
import ServicesSidebar from "@/components/services_offers/service_sidebar";
import ServicePage from "@/components/services_offers/service_offers_page";
import { useParams } from "react-router-dom";
export default function ServiceViewPage() {
  const { id } = useParams();
  return (
    <div className="flex h-screen bg-gray-50">
      <ServicesSidebar type="service" currentId={id} />
      <ServicePage type="service" currentId={id} />
    </div>
  );
}