import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Client_Sidebar from "@/components/client_components/Client_Sidebar";
import Client_Page from "@/components/client_components/Client_Page";
import { useClient, useClients } from "@/features/clients/hooks/useClientsQuery";
export default function CustomerOverview() {
    const { id } = useParams();

    return (
        <div className="flex h-screen bg-gray-50">
            <Client_Sidebar currentId={id} />
            <Client_Page currentId={id} />
        </div>
    );
}
