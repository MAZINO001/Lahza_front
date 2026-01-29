import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiDocuments } from '@/lib/api/documents';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useNoInvoiceProject() {
    return useQuery({
        queryKey: QUERY_KEYS.projects,
        queryFn: () => apiDocuments.getProjects(),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch projects");
            console.error(error);
        },
    });
}
