/* eslint-disable no-unused-vars */
import { Download, Edit2, Printer, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, Outlet, useParams } from "react-router-dom";
import PdfPreview from "./PdfPreview";

export default function Inv_Qt_page({ type, data }) {
  const isInvoice = type === "invoices";
  console.log(type);
  const { id } = useParams();
  const { role } = useAuth();
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
          <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Download size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Printer size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Send size={20} />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          {type === "quotes" ? (
            <div>
              <Button variant="outline" className="text-sm">
                Convert to Invoice
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <PdfPreview src="http://127.0.0.1:8000/pdf/invoice/12" />
      </div>
    </div>
  );
}
