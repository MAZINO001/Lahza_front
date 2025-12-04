// src/features/documents/hooks/useDocumentPayments.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/utils/axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export function useDocumentPayments(invoiceId) {
    console.log(invoiceId)
    return useQuery({
        queryKey: ["document-payments", invoiceId],
        queryFn: async () => {
            const res = await api.get(
                `${API_URL}/getInvoicePayments/${invoiceId}`
            );
            return res.data?.payments || res.data || [];
        },
        enabled: !!invoiceId,
        staleTime: 5 * 60 * 1000,
        onError: () => {
            toast.error("Failed to load payments");
        },
    });
}