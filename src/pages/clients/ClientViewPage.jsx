import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Client_Sidebar from "@/components/client_components/Client_Sidebar";
import Client_Page from "@/components/client_components/Client_Page";
import { useClient, useClients } from "@/features/clients/hooks/useClientsQuery";
export default function CustomerOverview() {
    const { id } = useParams();

    const {
        data: clients = [],
        isLoading: clientsLoading,
        isError: clientsError,
    } = useClients();

    const {
        data: client,
        isLoading: clientLoading,
        isError: clientError,
    } = useClient(id);

    // Loading state
    if (clientsLoading || clientLoading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <div className="w-80 border-r bg-white p-6">
                    <Skeleton className="h-8 w-48 mb-6" />
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
                <div className="flex-1 p-10">
                    <Skeleton className="h-12 w-96 mb-8" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    // Error state
    if (clientsError || clientError || !client) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Alert variant="destructive" className="max-w-md">
                    <AlertDescription>
                        {clientsError || clientError
                            ? "Failed to load service. Please try again."
                            : "client not found."}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Client_Sidebar data={clients} />
            <Client_Page data={client} />
        </div>
    );
}
