// src/pages/receipts/ReceiptsPage.jsx
import React from "react";
import { ReceiptTable } from "@/features/receipts/components/ReceiptTable";

const ReceiptsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <ReceiptTable />
    </div>
  );
};

export default ReceiptsPage;
