import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SubscribersTable } from "@/features/plans/components/subscribersTable";
import AllPlans from "@/features/plans/components/allPlans";
import ClientsAllPlans from "@/features/plans/components/clientsAllPlans";
import { useAuthContext } from "@/hooks/AuthContext";
export default function PlanesPage() {
  const { packId } = useParams();
  const [selectedView, setSelectedView] = useState("table");
  const { role } = useAuthContext();

  useEffect(() => {
    if (role === "admin") {
      setSelectedView("table");
    } else {
      setSelectedView("cards");
    }
  }, [role]);

  return (
    <div className="text-foreground w-full pt-4">
      {selectedView === "table" && (
        <SubscribersTable packId={packId} onViewChange={setSelectedView} />
      )}
      {selectedView === "cards" && (
        <AllPlans packId={packId} onViewChange={setSelectedView} />
      )}
      {selectedView === "clientSubscriptions" && (
        <ClientsAllPlans onViewChange={setSelectedView} />
      )}
    </div>
  );
}
