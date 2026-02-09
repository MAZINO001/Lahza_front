import React from "react";
import { useParams } from "react-router-dom";
import { PlanesTable } from "@/features/plans/components/PlanesTable";

export default function PlanesPage() {
  const { packId } = useParams();
  return <PlanesTable packId={packId} />;
}
