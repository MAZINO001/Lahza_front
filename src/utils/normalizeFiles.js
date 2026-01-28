import api from "@/lib/utils/axios";

// Get backend origin from environment
const getBackendOrigin = () => {
    const base = import.meta.env.VITE_BACKEND_URL;
    const fallback = "http://localhost:8000";
    if (!base) return fallback;
    try {
        const url = new URL(base);
        const origin = `${url.protocol}//${url.host}`;
        return origin || fallback;
    } catch {
        const cleaned = String(base)
            .replace(/\/$/, "");
        if (/^https?:\/\//i.test(cleaned)) return cleaned;
        return fallback;
    }
};

export const normalizeExistingFiles = async (result) => {
    if (!result) return [];

    const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.files)
                ? result.files
                : [];

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    const filePromises = list.map(async (item, index) => {
        const path = item?.path ?? "";
        const name =
            item?.name ??
            item?.original_name ??
            item?.filename ??
            item?.file_name ??
            (path ? String(path).split("/").pop() : "") ??
            "";
        const size = Number(item?.size ?? item?.file_size ?? item?.bytes ?? 0);
        const type = item?.type ?? item?.mime_type ?? item?.mimetype ?? "";
        const id =
            item?.id ?? item?.uuid ?? item?.file_id ?? `${name || "file"}-${index}`;

        if (!path || !name) return null;

        try {
            const fileUrl = `/storage/${path}`;

            const response = await api.get(fileUrl, {
                responseType: 'blob'
            });

            const blob = response.data;

            const file = new File([blob], name, {
                type: blob.type || type,
            });

            return {
                id: String(id),
                path,
                name,
                size: size || blob.size,
                type: type || blob.type,
                file: file, // Store the actual File object
            };
        } catch (error) {
            console.error(`Failed to fetch file ${name}:`, error);
            return null;
        }
    });

    const files = await Promise.all(filePromises);
    return files.filter((f) => f && f.name);
};

/**
 * Synchronous version for getting file URLs without fetching the actual files
 * @param {Array|Object} result - The API response containing file data
 * @returns {Array} Array of normalized file objects with URLs
 */
export const normalizeExistingFilesSync = (result) => {
    if (!result) return [];

    const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.files)
                ? result.files
                : [];

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    return list
        .map((item, index) => {
            const path = item?.path ?? "";
            const name =
                item?.name ??
                item?.original_name ??
                item?.filename ??
                item?.file_name ??
                (path ? String(path).split("/").pop() : "") ??
                "";
            const size = Number(item?.size ?? item?.file_size ?? item?.bytes ?? 0);
            const type = item?.type ?? item?.mime_type ?? item?.mimetype ?? "";
            const id =
                item?.id ?? item?.uuid ?? item?.file_id ?? `${name || "file"}-${index}`;

            if (!path || !name) return null;

            const fileUrl = `${backendUrl}/storage/${path}`;

            return {
                id: String(id),
                path,
                name,
                size,
                type,
                url: fileUrl,
            };
        })
        .filter((f) => f && f.name);
};

export default normalizeExistingFiles;
