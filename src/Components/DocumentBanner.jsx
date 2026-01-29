import React, { useState } from "react";
import { Sparkles, X, Plus, MoreVertical, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import SignatureExamples from "@/features/documents/components/SignatureExamples";
import SignUploader from "@/features/documents/components/SignUploader";
import { toast } from "sonner";
import { useCreateInvoiceFromQuote } from "@/features/documents/hooks/useDocuments/useDocumentsQueryData";
import api from "@/lib/utils/axios";
export default function WhatsNextBanner({
  type,
  action,
  content,
  clientId,
  currentSection,

  projectId,
  DocId,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [signatureFile, setSignatureFile] = useState(null);
  const createInvoice = useCreateInvoiceFromQuote();

  const { role } = useAuthContext();
  const navigate = useNavigate();
  const { cloneQuoteOrInvoice } = globalFnStore();

  if (!isVisible) return null;

  const handleSignatureUpload = (files) => {
    if (files && files.length > 0) {
      setSignatureFile(files[0]);
    }
  };

  const handleSubmitSignature = async () => {
    if (!signatureFile) {
      toast.error("Please select a signature");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("signature", signatureFile.file);
      formData.append("type", "client_signature");
      const endpoint = type;
      const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}/${DocId}/signature`;

      await api.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Signature uploaded successfully!");

      if (role === "client") {
        try {
          await createInvoice.mutateAsync(document.id);
          toast.success("Quote signed and invoice created successfully!");
        } catch (err) {
          console.error("Failed to create invoice:", err);
          toast.error(
            "Quote signed, but invoice creation failed. Please try again.",
          );
        }
      } else {
        toast.success("Quote signature uploaded successfully!");
      }

      setIsSignDialogOpen(false);
      setSignatureFile(null);
    } catch (error) {
      console.error("Error uploading signature:", error);
      toast.error("Failed to upload signature");
    }
  };

  const handleActionClick = () => {
    if (action === "Duplicate Quote") {
      cloneQuoteOrInvoice(clientId, type, role, currentSection, navigate);
    }

    if (action === "Check or Add Additional Data") {
      navigate(`/${role}/projects`);
    }

    if (action === "Sign Quote") {
      setIsSignDialogOpen(true);
    }

    if (action === "Go to Project Page") {
      navigate(`/${role}/projects/${projectId}`);
    }

    if (action === "Go to Payment Page") {
      navigate(`/${role}/payments`);
    }
  };

  return (
    <>
      <div className="bg-background border border-border rounded-lg px-4 py-4 w-full">
        <div className="flex gap-4 items-center">
          <div
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-100"
          >
            <Sparkles className="text-purple-600" size={18} />
          </div>

          <div className="flex items-center gap-4 w-full min-w-0">
            <div className="flex gap-2 space-y-1">
              <p className="font-semibold text-sm text-foreground">
                WHAT'S NEXT?
              </p>
              <p className="text-sm text-muted-foreground">{content}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 items-center flex-wrap">
              <Button size="sm" onClick={handleActionClick}>
                {action === "Sign Quote" ? (
                  <FileSignature className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {action}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 border border-border rounded-md">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setIsVisible(false)}>
                    Don't show again
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Button
            aria-label="Close banner"
            className="size-8 shrink-0 p-0 -mt-1 -mr-1"
            onClick={() => setIsVisible(false)}
            variant="ghost"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* SIGN POPUP */}
      <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>add your signature</DialogTitle>
          <DialogHeader>
            <DialogDescription className="space-y-6 mt-4">
              <p className="text-center text-base">
                Please upload a <strong>clear black signature</strong> on a{" "}
                <strong>pure white background</strong>.
              </p>

              <SignatureExamples />

              <p className="text-sm text-center text-muted-foreground pt-4">
                Accepted formats: PNG, JPG, JPEG • Max size: 5MB
              </p>
            </DialogDescription>
          </DialogHeader>

          <SignUploader onFileChange={handleSignatureUpload} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitSignature} disabled={!signatureFile}>
              Submit Signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
