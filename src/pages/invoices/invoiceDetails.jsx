import Inv_Qt_page from "@/Components/Invoice_Quotes/Inv_Qt_page";
import Inv_Qt_sidebar from "@/Components/Invoice_Quotes/Inv_Qt_sidebar";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Edit,
  Download,
  Printer,
  Send,
  MoreVertical,
  X,
} from "lucide-react";
import React from "react";

export default function Invoice_Details() {
  const invoices = [
    {
      name: "Govind Kumar Tara",
      id: "INV-000001",
      date: "09/02/2018",
      dueDate: "16/02/2018",
      total: "₹488.00",
      status: "PAID",
    },
    {
      name: "Shweta Naruka",
      id: "INV-000002",
      date: "10/02/2018",
      dueDate: "17/02/2018",
      total: "₹520.00",
      status: "PAID",
    },
    {
      name: "Arun Chokshi",
      id: "INV-000003",
      date: "19/02/2018",
      dueDate: "26/02/2018",
      total: "₹1,250.00",
      status: "DRAFT",
    },
    {
      name: "Pooja J",
      id: "INV-000004",
      date: "09/08/2018",
      dueDate: "16/08/2018",
      total: "₹240.00",
      status: "SENT",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Inv_Qt_sidebar type="invoices" data={invoices} />
      {/* Main Content */}
      <Inv_Qt_page type="invoices" data={invoices} />
    </div>
  );
}
