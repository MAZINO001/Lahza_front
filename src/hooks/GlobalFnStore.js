
import api from "@/lib/utils/axios";
import { toast } from "sonner";
import { create } from "zustand";


export const globalFnStore = create((set) => ({
    handleSendInvoice_Quote: (id, email, type) => {
        const payload = {
            email: `${email}`,
            message: `Thanks for your business! Please find the invoice attached.`,
            type: type,
            id: id,
            subject: "Your Invoice from LAHZA HM",
        }
        try {
            const req = api.post(`${import.meta.env.VITE_BACKEND_URL}/email/send`, payload)
            toast.success(type + " is sent to " + email)
        } catch (error) {
            console.log(error)
            toast.error("Failed to send " + type)
        }
    },
    handleDownloadInvoice_Quotes: async (id, type) => {
        try {
            const response = await api.get(`http://127.0.0.1:8000/api/pdf/${type}/${id}`, { responseType: 'blob', withCredentials: true });

            const blob = response.data;

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${type}-${id}.pdf`;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success(`${type} downloaded successfully`);
        } catch (error) {
            console.error('Download error:', error);
            toast.error(`Failed to download ${type}`);
        }
    },

    HandleEditService: async (id, navigate, role) => {
        navigate(`/${role}/service/${id}/edit`, {
            state: { editId: id },
            replace: true
        });
    },


    handleDeleteService: (id, deleteMutation, reloadCallback) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                if (reloadCallback) reloadCallback();
            },
        });
    },

    // handleDeleteService: async (id, reloadCallback) => {
    //     try {
    //         await api.delete(`${import.meta.env.VITE_BACKEND_URL}/services/${id}`);
    //         if (reloadCallback) reloadCallback();
    //     } catch (error) {
    //         alert(error);
    //     }
    // },

    HandleEditOffer: async (id, navigate, role) => {
        navigate(`/${role}/offer/${id}/edit`, {
            state: { editId: id },
            replace: true
        });
    },
    HandleEditProject: async (id, navigate, role) => {
        navigate(`/${role}/project/${id}/settings`, {
            state: { editId: id },
            replace: true
        });
    },

    HandleCloneProject: async (id, navigate, role) => {
        navigate(`/${role}/project/new`, {
            state: { cloneFromId: id },
            replace: true
        });
    },

    handleDeleteOffer: async (id, reloadCallback) => {
        try {
            await api.delete(`${import.meta.env.VITE_BACKEND_URL}/offers/${id}`);
            if (reloadCallback) reloadCallback();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete offer");
        }
    },

    HandleEditTask: async (id, navigate, role) => {
        // Get the current path to extract project ID
        const currentPath = window.location.pathname;
        const pathMatch = currentPath.match(/\/project\/(\d+)/);
        const projectId = pathMatch ? pathMatch[1] : null;

        if (projectId) {
            navigate(`/${role}/project/${projectId}/task/${id}/edit`, {
                replace: true
            });
        } else {
            // Fallback to relative navigation
            navigate(`../task/${id}/edit`, {
                replace: true
            });
        }
    },

    handleDeleteTask: async (projectId, id, reloadCallback) => {
        try {
            await api.delete(`${import.meta.env.VITE_BACKEND_URL}/projects/tasks/${projectId}/${id}`);
            if (reloadCallback) reloadCallback();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete task");
        }
    },


    cloneQuoteOrInvoice: (id, type, role, currentSection, navigate) => {
        navigate(`/${role}/${currentSection}/new`, {
            state: { cloneFromId: id },
        });
    }
}))
