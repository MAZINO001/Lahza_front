"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { mockOfferData } from "@/lib/mockData";

export default function OffersPage() {
  const [offers, setOffers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setOffers(mockOfferData);
      setLoading(false); // ✅ stop loading
    }, 500); // small delay to see skeletons
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        There are no offers right now. 😔
      </div>
    );
  }

  return (
    <div className="py-4 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {offers.map((offer) => (
        <Card key={offer.id}>
          <CardHeader>
            <CardTitle>{offer.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{offer.description}</CardDescription>
            {offer.expiresAt && (
              <p className="mt-2 text-sm text-gray-500">
                Expires on: {new Date(offer.expiresAt).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
