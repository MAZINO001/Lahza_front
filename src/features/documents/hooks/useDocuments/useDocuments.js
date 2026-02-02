import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiDocuments } from '@/lib/api/documents';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useDocuments(type, options) {
    options = options || {};
    var enabled = options.enabled !== undefined ? options.enabled : true;
    if (!type) throw new Error("useDocuments requires a type: 'invoices' or 'quotes'");

    // Use type-specific query key to prevent cache contamination
    const queryKey = type === "invoices" ? QUERY_KEYS.invoices : QUERY_KEYS.quotes;

    return useQuery({
        queryKey,
        queryFn: () => apiDocuments.getAll(type),
        staleTime: Infinity,
        refetchOnMount: false,
        enabled,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch documents");
            console.error(error);
        },
    });
}

export function useDocument(id, type) {
    if (!type) throw new Error("useDocument requires a type: 'invoices' or 'quotes'");
    return useQuery({
        queryKey: QUERY_KEYS.document(id),
        queryFn: () => apiDocuments.getById(id, type),
        enabled: !!id,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch document");
            console.error(error);
        },
    });
}

export function useDocumentFromCache(id) {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(QUERY_KEYS.document(id));
}
