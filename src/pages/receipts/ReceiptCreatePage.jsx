/* eslint-disable no-unused-vars */
// src/pages/receipts/ReceiptCreatePage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReceiptForm } from "@/features/receipts/components/ReceiptForm";
import { useReceipts } from "@/features/receipts/hooks/useReceipts";

const ReceiptCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;
  const { role } = useAuthContext();
  const { fetchReceipt, createReceipt, updateReceipt } = useReceipts();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const loadReceipt = async () => {
        try {
          setLoading(true);
          const data = await fetchReceipt(editId);
          setReceipt(data);
        } catch (error) {
          console.error("Error loading receipt:", error);
        } finally {
          setLoading(false);
        }
      };
      loadReceipt();
    }
  }, [isEditing, editId, fetchReceipt]);

  const handleSuccess = () => {
    navigate(`/${role}/receipts`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/${role}/receipts`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Receipts
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Receipt" : "Create New Receipt"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Update receipt information"
              : "Generate a new payment receipt for a client"}
          </p>
        </div>
      </div>

      <ReceiptForm receipt={receipt} onSuccess={handleSuccess} />
    </div>
  );
};

export default ReceiptCreatePage;
