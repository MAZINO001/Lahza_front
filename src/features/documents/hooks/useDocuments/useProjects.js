import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiDocuments } from '@/lib/api/documents';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useNoInvoiceProject() {
    return useQuery({
        queryKey: QUERY_KEYS.invoicesProjects,
        queryFn: () => apiDocuments.getProjects(),
        staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity
        refetchOnMount: true, // Enable refetch on mount
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch projects");
            console.error(error);
        },
    });
}
