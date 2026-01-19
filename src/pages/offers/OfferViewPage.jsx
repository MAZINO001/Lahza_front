// src/pages/services/ServiceViewPage.jsx
import ServicesSidebar from "@/components/services_offers/service_sidebar";
import ServicePage from "@/components/services_offers/offers/offers_page";
import { useParams } from "react-router-dom";

export default function ServiceViewPage() {
  const { id } = useParams();

  return (
    <div className="flex h-screen">
      <ServicesSidebar type="offer" currentId={id} />
      <ServicePage type="offer" currentId={id} />
    </div>
  );
}
