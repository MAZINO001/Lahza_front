import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentForm } from "@/features/documents/components/DocumentForm";

export function AddQuoteModal({ open, onOpenChange, onSuccess }) {
    const handleSuccess = () => {
        onSuccess?.();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[80vw] max-h-[90vh] overflow-y-auto p-4">
                <DialogHeader>
                    <DialogTitle>Create New Quote</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <DocumentForm type="quotes" onSuccess={handleSuccess} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
