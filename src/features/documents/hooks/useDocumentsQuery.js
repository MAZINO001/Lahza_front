/* eslint-disable no-unused-vars */
// src/features/documents/hooks/useDocuments.ts
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Helper to get correct plural route
const getRoute = (type) => (type === "quote" ? "quotes" : "invoices");

const apiDocuments = {
  getAll: (type) =>
    api
      .get(`${API_URL}/${getRoute(type)}`)
      .then((res) => res.data?.[getRoute(type)] || res.data?.invoices || res.data?.quotes || res.data || []),

  getById: (id, type) =>
    api
      .get(`${API_URL}/${getRoute(type)}/${id}`)
      .then((res) => res.data?.invoice || res.data?.quote || res.data),

  create: (data, type) =>
    api.post(`${API_URL}/${getRoute(type)}`, data),

  createFromQuote: (id) =>
    api.post(`${API_URL}/quotes/${id}/create-invoice`),

  update: (id, data, type) =>
    api.put(`${API_URL}/${getRoute(type)}/${id}`, data),

  delete: (id, type) =>
    api.delete(`${API_URL}/${getRoute(type)}/${id}`),
};

export function useDocuments(type) {
  if (!type) throw new Error("useDocuments requires a type: 'invoice' or 'quote'");

  return useQuery({
    queryKey: ["documents", type],
    queryFn: () => apiDocuments.getAll(type),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDocument(id, type) {
  if (!type) throw new Error("useDocument requires a type: 'invoice' or 'quote'");

  return useQuery({
    queryKey: ["documents", type, id],
    queryFn: () => apiDocuments.getById(id, type),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useCreateDocument(type) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiDocuments.create(data, type),
    onSuccess: (newDoc) => {
      const label = type === "quote" ? "Quote" : "Invoice";
      toast.success(`${label} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["documents", type] });
      queryClient.setQueryData(["documents", type, newDoc.id], newDoc);
    },
    refetchOnWindowFocus: true,
  });
}

export function useCreateInvoiceFromQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      apiDocuments.createFromQuote(id),
    onSuccess: (data) => {
      toast.success('Invoice created from quote successfully');
      queryClient.invalidateQueries({ queryKey: ["documents", "invoice"] });
      queryClient.invalidateQueries({ queryKey: ["documents", "quote"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
    refetchOnWindowFocus: true,
    onError: (error) => {
      toast.error(error.message || 'Failed to create invoice from quote');
    }
  });
}

export function useUpdateDocument(type) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      apiDocuments.update(id, data, type),
    onSuccess: (updatedDoc) => {
      const label = type === "quote" ? "Quote" : "Invoice";
      toast.success(`${label} updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ["documents", type] });
      queryClient.setQueryData(["documents", type, updatedDoc.id], updatedDoc);
    },
    refetchOnWindowFocus: true,
  });
}

export function useDeleteDocument(type) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiDocuments.delete(id, type),
    onSuccess: () => {
      toast.success("Document deleted");
      queryClient.invalidateQueries({ queryKey: ["documents", type] });
    },
    refetchOnWindowFocus: true,
  });
}