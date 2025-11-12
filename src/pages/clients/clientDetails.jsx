import Client_Page from "@/Components/client_components/Client_Page";
import Client_Sidebar from "@/Components/client_components/Client_Sidebar";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchClients = async () => {
  const res = await api.get(`${import.meta.env.VITE_BACKEND_URL}/clients`);
  return res.data;
};

export default function CustomerOverview() {
  const {
    data: clients = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  if (isLoading) return <div className="p-4">Loading clients...</div>;
  if (isError)
    return <div className="p-4 text-red-600">Failed to load clients</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Client_Sidebar data={clients} />
      <Client_Page data={clients} />
    </div>
  );
}
