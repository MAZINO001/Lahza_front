/* eslint-disable no-unused-vars */
import api from "@/utils/axios";
import axios from "axios";
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
            console.log(type + " is sent to " + email)
        } catch (error) {
            console.log(error)
        }
    },
    handleDownloadInvoice_Quotes: async (id, type) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/pdf/${type}/${id}`, { responseType: 'blob', withCredentials: true });
            console.log(response)

            const blob = response.data;

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${type}-${id}.pdf`;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            console.log(`${type} downloaded successfully`);
        } catch (error) {
            console.error('Download error:', error);
            alert(`Failed to download ${type}`);
        }
    },

    HandleEditService: async (id, navigate, role) => {
        navigate(`/${role}/service/new`, {
            state: { editId: id },
            replace: true
        });
    },

    handleDeleteService: async (id, reloadCallback) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            await api.delete(`${import.meta.env.VITE_BACKEND_URL}/services/${id}`);
            if (reloadCallback) reloadCallback();
        } catch (error) {
            console.log(error);
        }
    },

}))
