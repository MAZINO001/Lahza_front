import { ClientTable } from "@/features/clients/components/ClientTable";
import { useClients } from "@/features/clients/hooks/useClientsQuery";

export default function ClientsPage() {
    const { data: clients = [], isLoading } = useClients();

    return <ClientTable clients={clients} isLoading={isLoading} />;
};


