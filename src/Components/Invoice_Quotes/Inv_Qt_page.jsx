/* eslint-disable no-unused-vars */
import { Download, Edit2, Filter, Printer, Send, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import PdfPreview from "./PdfPreview";
import api from "@/utils/axios";

export default function Inv_Qt_page({ type, data }) {
  const isInvoice = type === "invoice";
  const { id } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();

  const handleDownloadPdf = () => {
    alert("your pdf id downloaded");
  };
  const handlePrintPdf = () => {
    alert("your pdf id printed");
  };
  const handleSendPdf = () => {
    alert("your pdf id sent");
  };

  const handleInvoiceConversion = async () => {
    const statusToSend = "draft"; // for the invoice
    const quotationDate = new Date(data.quotation_date);
    const dueDate = new Date(quotationDate);
    dueDate.setDate(dueDate.getDate() + 30);
    const formattedDueDate = dueDate.toISOString().slice(0, 10);

    const payload = {
      client_id: data.client_id,
      invoice_date: data.quotation_date,
      due_date: formattedDueDate,
      balance_due: 0,
      status: statusToSend,
      total_amount: data.total_amount,
      quote_id: data.id,
      services: data.quote_services,
      notes: data.notes || "",
    };

    const QuotePayload = {
      client_id: data.client_id,
      quotation_date: data.quotation_date,
      balance_due: 0,
      status: "confirmed",
      total_amount: data.total_amount,
      quote_id: data.id,
      services: data.quote_services,
      notes: data.notes || "",
    };

    try {
      // Create the invoice
      await api.post(`${import.meta.env.VITE_BACKEND_URL}/invoices`, payload);

      // Update the quote status to "accepted"
      await api.put(
        `${import.meta.env.VITE_BACKEND_URL}/quotes/${data.id}`,
        QuotePayload
      );

      alert("Quote converted and marked as accepted!");
      navigate(`/${role}/invoices`);
    } catch (error) {
      console.error("Error details:", error.response?.data || error);
      alert(
        `Failed to convert to invoice: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  console.log(data);
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b px-2 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">
          {isInvoice ? "INV" : "QT"}-000{id}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Link
              to={`/${role}/${type}/new`}
              state={{ [isInvoice ? "invoiceId" : "quoteId"]: id }}
            >
              <Edit2 size={20} />
            </Link>
          </button>
          <button
            onClick={handleDownloadPdf}
            className="p-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            <Download size={20} />
          </button>
          <button
            onClick={handlePrintPdf}
            className="p-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            <Printer size={20} />
          </button>
          {role === "admin" ? (
            <button
              onClick={handleSendPdf}
              className="p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <Send size={20} />
            </button>
          ) : (
            ""
          )}

          {type === "quote" &&
          role === "admin" &&
          data?.status !== "confirmed" ? (
            <>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <div>
                <Button
                  onClick={handleInvoiceConversion}
                  variant="outline"
                  className="text-sm cursor-pointer"
                >
                  Convert to Invoice
                </Button>
              </div>
            </>
          ) : (
            ""
          )}
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Link
              to={`/${role}/${type}s`}
              state={{ [isInvoice ? "invoiceId" : "quoteId"]: id }}
            >
              <X size={20} />
            </Link>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <PdfPreview src={`http://127.0.0.1:8000/pdf/${type}/${id}`} />
      </div>
    </div>
  );
}
