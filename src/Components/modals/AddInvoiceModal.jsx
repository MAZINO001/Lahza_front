import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentForm } from "@/features/documents/components/DocumentForm";

export function AddInvoiceModal({ open, onOpenChange, onSuccess }) {
    const handleSuccess = () => {
        onSuccess?.();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <DocumentForm type="invoices" onSuccess={handleSuccess} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
