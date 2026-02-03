import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiDocuments } from '@/lib/api/documents';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useInvoicesWithoutProjects() {
    return useQuery({
        queryKey: QUERY_KEYS.invoicesWithoutProjects,
        queryFn: () => apiDocuments.getInvoices(),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch invoices");
            console.error(error);
        },
    });
}