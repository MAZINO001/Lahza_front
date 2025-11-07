// import Inv_Qt_page from "@/Components/Invoice_Quotes/Inv_Qt_page";
// import Inv_Qt_sidebar from "@/Components/Invoice_Quotes/Inv_Qt_sidebar";
// import { Button } from "@/components/ui/button";
// import {
//   Menu,
//   Edit,
//   Download,
//   Printer,
//   Send,
//   MoreVertical,
//   X,
// } from "lucide-react";
// import React from "react";

// export default function QuoteDetails() {
//   const quotes = [
//     {
//       name: "Govind Kumar Tara",
//       id: "QT-000001",
//       date: "09/02/2018",
//       amount: "₹488.00",
//       status: "ACCEPTED",
//     },
//     {
//       name: "Shweta Naruka",
//       id: "QT-000002",
//       date: "10/02/2018",
//       amount: "₹520.00",
//       status: "ACCEPTED",
//     },
//     {
//       name: "Arun Chokshi",
//       id: "QT-000003",
//       date: "19/02/2018",
//       amount: "₹1250.00",
//       status: "DRAFT",
//     },
//     {
//       name: "Pooja J",
//       id: "QT-000004",
//       date: "09/08/2018",
//       amount: "₹240.00",
//       status: "SENT",
//     },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Inv_Qt_sidebar type="quote" data={quotes} />
//       {/* Main Content */}
//       <Inv_Qt_page type="quote" data={quotes} />
//     </div>
//   );
// }

import Inv_Qt_page from "@/Components/Invoice_Quotes/Inv_Qt_page";
import Inv_Qt_sidebar from "@/Components/Invoice_Quotes/Inv_Qt_sidebar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Menu,
  Edit,
  Download,
  Printer,
  Send,
  MoreVertical,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export default function QuoteDetails() {
  const [quotes, setQuotes] = useState([]);
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/quotes`
        );
        console.log(res.data.quotes);
        setQuotes(res.data.quotes);
      } catch (err) {
        console.error("Failed to fetch quote:", err);
      }
    };
    fetchQuote();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Inv_Qt_sidebar type="quotes" data={quotes} />
      <Inv_Qt_page type="quotes" data={quotes} />
    </div>
  );
}
