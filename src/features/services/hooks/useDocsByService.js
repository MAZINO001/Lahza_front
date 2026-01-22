import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiService } from '@/lib/api/services';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useDocsByService(id, type) {
    return useQuery({
        queryKey: QUERY_KEYS.docsByService(id, type), // FIXED: Use correct key
        queryFn: () => apiService.getByDocsId(id, type),
        enabled: !!id && !!type,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch documents");
            console.error(error);
        },
    });
}