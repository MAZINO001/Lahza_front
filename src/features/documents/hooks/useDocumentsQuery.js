import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiDocuments = {
  getAll: (type) =>
    api
      .get(`${API_URL}/${type}`)
      .then((res) => res.data?.[type] || res.data?.invoices || res.data?.quotes || res.data || []),

  getById: (id, type) =>
    api
      .get(`${API_URL}/${type}/${id}`)
      .then((res) => res.data?.invoice || res.data?.quote || res.data),

  getProjects: () =>
    api
      .get(`${API_URL}/getproject/invoices`)
      .then((res) => res.data || []),

  create: (data, type) =>
    api.post(`${API_URL}/${type}`, data),

  createFromQuote: (id) =>
    api.post(`${API_URL}/quotes/${id}/create-invoice`),

  update: (id, data, type) =>
    api.put(`${API_URL}/${type}/${id}`, data),

  delete: (id, type) =>
    api.delete(`${API_URL}/${type}/${id}`),
};

export function useDocuments(type) {
  if (!type) throw new Error("useDocuments requires a type: 'invoice' or 'quote'");
  return useQuery({
    queryKey: ["documents", type],
    queryFn: () => apiDocuments.getAll(type),
    staleTime: 0,
  });
}

export function useDocument(id, type) {
  if (!type) throw new Error("useDocument requires a type: 'invoices' or 'quotes'");
  return useQuery({
    queryKey: ["documents", type, id],
    queryFn: () => apiDocuments.getById(id, type),
    enabled: !!id,
    staleTime: 0,
    refetchOnWindowFocus: true,
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to fetch document");
    },
  });
}

export function useCreateDocument(type) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiDocuments.create(data, type),
    onSuccess: (newDoc) => {
      const label = type === "quotes" ? "Quote" : "Invoice";
      toast.success(`${label} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["documents", type] });
      queryClient.setQueryData(["documents", type, newDoc.id], newDoc);
    },
    refetchOnWindowFocus: true,
    onError: (error) => {
      toast.error(error.message);
      console.log(error)
    }
  });
}

export function useCreateInvoiceFromQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      apiDocuments.createFromQuote(id),
    onSuccess: () => {
      toast.success('Invoice created from quote successfully');
      queryClient.invalidateQueries({ queryKey: ["documents", "invoices"] });
      queryClient.invalidateQueries({ queryKey: ["documents", "quotes"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
    refetchOnWindowFocus: true,
    onError: (error) => {
      toast.error(error.message);
      console.log(error)
    }
  });
}

export function useUpdateDocument(type) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      apiDocuments.update(id, data, type),
    onSuccess: (updatedDoc) => {
      const label = type === "quotes" ? "Quote" : "Invoice";
      toast.success(`${label} updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ["documents", type] });
      queryClient.setQueryData(["documents", type, updatedDoc.id], updatedDoc);
    },
    refetchOnWindowFocus: true,
    onError: (error) => {
      toast.error(error.message);
      console.log(error)
    }
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
    onError: (error) => {
      toast.error(error.message);
      console.log(error)
    }
  });
}

export function useNoInvoiceProject() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: () => apiDocuments.getProjects(),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,

  });
}

