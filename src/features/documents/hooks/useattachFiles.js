import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/utils/axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const apiAttachments = {
    /**
     * Fetch reusable attachments (global library).
     * Backend currently returns all files of type "reusable_attachment"
     * for the authenticated user.
     */
    getAttachments: () =>
        api
            .get(`${API_URL}/attachments`)
            .then((res) => {
                console.log("API Response from getAttachments:", res.data);
                // Controller returns: { data: [ ...files ] }
                return res.data?.data ?? [];
            }),

    /**
     * Delete a single file by ID using the dedicated delete route.
     * Route: DELETE /files-delete/{id}
     */
    deleteAttachment: (id) =>
        api
            .delete(`${API_URL}/files-delete/${id}`)
            .then((res) => res.data),

    /**
     * Create / delete reusable attachments via a single endpoint.
     * NOTE: We always use type "reusable_attachment" for now so that
     * they show up in the /attachments library.
     */
    manageAttachments: ({ newFiles, deleteFileIds, type = "reusable_attachment" }) => {
        const formData = new FormData();

        // Add type
        if (type) {
            formData.append("type", type);
        }

        // Add new files - only if they exist
        if (newFiles?.length > 0) {
            console.log(`Uploading ${newFiles.length} new files`);
            newFiles.forEach((file) => {
                if (file instanceof File) {
                    formData.append("new_files[]", file);
                }
            });
        }

        // Add file IDs to delete - only if they exist
        if (deleteFileIds?.length > 0) {
            console.log(`Deleting ${deleteFileIds.length} files with IDs:`, deleteFileIds);
            formData.append("delete_file_ids", JSON.stringify(deleteFileIds));
        }

        return api
            .post(`${API_URL}/attachments/manage`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log("API Response from manageAttachments:", res.data);
                return res.data?.data ?? [];
            });
    },
};

/**
 * Query hook to load all reusable attachments.
 */
export function useAttachments() {
    return useQuery({
        queryKey: ["attachments"],
        queryFn: () => apiAttachments.getAttachments(),
        staleTime: 0,
        refetchOnWindowFocus: true,
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to fetch attachments");
        },
    });
}

/**
 * Transform backend File models into the structure expected by FileUploader /
 * useFileUpload as "initialFiles".
 *
 * File model fields (from backend):
 * - id
 * - original_name
 * - size
 * - mime_type
 * - url (accessor)
 */
export const transformAttachmentsForFileUploader = (attachments) => {
    if (!attachments || !Array.isArray(attachments)) return [];

    return attachments.map((attachment) => ({
        id: attachment.id,
        // Use original_name from FileUploadService; fall back gracefully
        name: attachment.original_name || attachment.name || "Unknown file",
        size: attachment.size ?? 0,
        type: attachment.mime_type || attachment.type || "application/octet-stream",
        // "url" is an accessor on the File model
        url: attachment.url || "",
        // This object itself is treated as the "file" by useFileUpload,
        // so we don't want it to be a real File instance.
    }));
};

export function useManageAttachments() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ newFiles, deleteFileIds, type = "reusable_attachment" }) => {
            console.log("useManageAttachments called with:", {
                newFilesCount: newFiles?.length,
                deleteFileIds,
                type,
            });
            return apiAttachments.manageAttachments({ newFiles, deleteFileIds, type });
        },
        onSuccess: (data) => {
            console.log("Attachments managed successfully:", data);
            toast.success("Attachments managed successfully!");
            queryClient.invalidateQueries({ queryKey: ["attachments"] });
        },
        onError: (error) => {
            const errorMessage =
                error?.response?.data?.message || "Failed to manage attachments";
            console.error("Manage attachments error:", error?.response?.data);
            toast.error(errorMessage);
        },
    });
}

/**
 * Simple delete hook around DELETE /files-delete/{id}
 * so we can reuse it wherever we need to remove a file.
 */
export function useDeleteAttachment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => {
            console.log("Deleting attachment via /files-delete:", id);
            return apiAttachments.deleteAttachment(id);
        },
        onSuccess: () => {
            toast.success("Attachment deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["attachments"] });
        },
        onError: (error) => {
            const errorMessage =
                error?.response?.data?.message || "Failed to delete attachment";
            console.error("Delete attachment error:", error?.response?.data);
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to manage attachments within DocumentForm
 * Tracks original files and detects additions/removals
 * 
 * Usage in DocumentForm:
 * const { originalFiles, handleAttachmentChange } = useDocumentFileAttachments(documentId, documentType);
 * 
 * Then in useForm defaultValues:
 * attach_file: originalFiles
 * 
 * And in FileUploader onChange (already wired in DocumentForm):
 * onChange={(files) => {
 *   field.onChange(files);
 *   handleAttachmentChange(files);
 * }}
 */
export function useDocumentFileAttachments(documentId, documentType) {
    const { data: attachments } = useAttachments();
    const manageAttachments = useManageAttachments();
    const deleteAttachment = useDeleteAttachment();

    const [originalFiles, setOriginalFiles] = useState([]);
    const [hasInitialized, setHasInitialized] = useState(false);

    // Initialize original files from attachments
    useEffect(() => {
        if (attachments && !hasInitialized) {
            const transformed = transformAttachmentsForFileUploader(attachments);
            setOriginalFiles(transformed);
            setHasInitialized(true);
        }
    }, [attachments, hasInitialized]);

    const handleAttachmentChange = useCallback((currentFiles) => {
        if (!Array.isArray(currentFiles)) return;

        const newFiles = [];
        const deleteFileIds = [];

        // Find new files (File objects - not existing attachments)
        currentFiles.forEach((fileObj) => {
            if (fileObj instanceof File) {
                newFiles.push(fileObj);
            }
        });

        // Find deleted files (check which original files are no longer in current list)
        originalFiles.forEach((originalFile) => {
            const stillExists = currentFiles.some((currentFile) => {
                // Check if the file still exists by ID
                return currentFile.id === originalFile.id;
            });

            // If original file is not in current list and has an ID, mark for deletion
            if (!stillExists && originalFile.id) {
                deleteFileIds.push(originalFile.id);
            }
        });

        // Upload NEW files via /attachments/manage
        if (newFiles.length > 0) {
            manageAttachments.mutate({
                newFiles,
                deleteFileIds: [],
                // Use the same type as /attachments so these
                // files appear in the reusable library.
                type: "reusable_attachment",
            });
        }

        // Delete removed existing files via DELETE /files-delete/{id}
        if (deleteFileIds.length > 0) {
            deleteFileIds.forEach((id) => {
                deleteAttachment.mutate(id);
            });
        }
    }, [originalFiles, manageAttachments, deleteAttachment]);

    return {
        originalFiles,
        handleAttachmentChange,
        isLoading: manageAttachments.isPending || deleteAttachment.isPending,
    };
}