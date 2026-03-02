
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/queryKeys";

const API_URL = import.meta.env.VITE_BACKEND_URL;


const apiDocumentPayments = {
    getByInvoiceId: (invoiceId) =>
        api
            .get(`${API_URL}/getInvoicePayments/${invoiceId}`)
            .then((res) => {
                console.log("API Response from getByInvoiceId:", res.data);
                return res.data?.payments ?? res.data ?? [];
            }),

    addAdditionalPayment: (invoiceId, percentage) =>
        api
            .post(`${API_URL}/invoices/pay/${invoiceId}/${percentage}`)
            .then((res) => {
                console.log("API Response from addAdditionalPayment:", res.data);
                return res.data?.payments ?? res.data ?? [];
            }),
};


export function useDocumentPayments(invoiceId) {
    return useQuery({
        queryKey: ["document-payments", invoiceId],
        queryFn: () => apiDocumentPayments.getByInvoiceId(invoiceId),
        enabled: !!invoiceId,
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch document payments");
        },
    });
}


export function useAddAdditionalPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ invoiceId, percentage }) =>
            apiDocumentPayments.addAdditionalPayment(invoiceId, percentage),
        onSuccess: (_, { invoiceId }) => {
            toast.success("Additional payment added!");
            // Refresh payments for this invoice detail view
            queryClient.invalidateQueries({ queryKey: ["document-payments", invoiceId] });
            // Refresh global payments-related views (e.g. receipts, payments table)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payments });
            // Refresh invoices list and any invoice-dependent views (e.g. balance_due, status)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices });
            // Refresh this specific invoice document if it is cached
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.document(invoiceId) });
        },
        onError: () => toast.error("Failed to add additional payment"),
    });
}
