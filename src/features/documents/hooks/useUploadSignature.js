// src/features/documents/hooks/useUploadSignature.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;


export function useUploadSignature(documentId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            file,
            type,
        }) => {
            const formData = new FormData();
            formData.append("signature", file);
            formData.append("type", type);

            const res = await api.post(
                `${API_URL}/documents/${documentId}/signature`, // ← works for invoice & quote
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            return res.data;
        },
        onSuccess: () => {
            toast.success("Signature uploaded successfully!");
            queryClient.invalidateQueries({ queryKey: ["documents", documentId] });
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to upload signature"
            );
        },
    });
}