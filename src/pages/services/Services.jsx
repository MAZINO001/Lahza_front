import React, { useEffect, useState } from "react";
import api from "@/utils/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { useAuthContext } from "@/hooks/AuthContext";
import FormField from "@/Components/Form/FormField";
import { Link } from "react-router-dom";

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_BACKEND_URL}/services`
        );
        setServices(res.data);
      } catch (error) {
        console.error("Error details:", error.response?.data || error);
        alert(
          `Failed to get services ): ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchData();
  }, []);

  const { role } = useAuthContext();
  const [search, setSearch] = useState("");
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <FormField
          placeholder="Filter by name..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link to={`/${role}/services`}>
          <Button className="cursor-pointer">Add New Service</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <Card key={service.id} className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {service.name}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {service.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {service.base_price} MAD
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => console.log("View", service.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => console.log("Edit", service.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => console.log("Delete", service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
