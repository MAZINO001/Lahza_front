/* eslint-disable no-unused-vars */
import ServicesSidebar from "@/Components/services_offers/service_sidebar";
import ServicePage from "@/Components/services_offers/service_offers_page";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/utils/axios";

const fetchServices = () =>
  api
    .get(`${import.meta.env.VITE_BACKEND_URL}/services`)
    .then((res) => res.data ?? []);

const fetchServiceById = (id) =>
  api
    .get(`${import.meta.env.VITE_BACKEND_URL}/services/${id}`)
    .then((res) => res.data?.service ?? res.data ?? null);

export default function ServiceDetails() {
  const { id } = useParams();

  const {
    data: services = [],
    isLoading: listLoading,
    isError: listError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: service,
    isLoading: serviceLoading,
    isError: serviceError,
    isFetching: serviceFetching,
  } = useQuery({
    queryKey: ["service", id],
    queryFn: () => fetchServiceById(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  console.log(services);
  console.log(service);

  return (
    <div className="flex h-screen bg-gray-50">
      <ServicesSidebar type="service" data={services} />
      <ServicePage type="service" data={service} />
    </div>
  );
}
