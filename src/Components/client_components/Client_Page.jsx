import { Edit, Edit2, Phone, X } from "lucide-react";
import React, { useState } from "react";
import Transactions from "./Client_page/transactions";
import { Link, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthContext } from "@/hooks/AuthContext";
import OverView from "./Client_page/overview";
import Comments from "./Client_page/Comments";
import Mails from "./Client_page/Mails";
import { useClient } from "@/features/clients/hooks/useClientsQuery";
export default function Client_Page({ currentId }) {
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: client,
    isLoading: clientLoading,
    isError: clientError,
  } = useClient(currentId);
  console.log(client)
  const { role } = useAuthContext();
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "comments", label: "Comments" },
    { id: "transactions", label: "Transactions" },
    { id: "mails", label: "Mails" },
  ];

  return (
    <div className=" w-[75%] flex flex-col">
      <div className="bg-white px-2 py-4 border-b border-gray-200 p-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 ">
            {client?.client_type === "company" ? client?.company : client?.user?.name}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="p-2 rounded cursor-pointer">
              <Link to={`/${role}/client/${currentId}/edit`} state={{ clientId: currentId }}>
                <Edit2 size={20} />
              </Link>
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <Button variant="outline" className="p-2 rounded cursor-pointer">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="flex px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "overview" && <OverView data={client} />}
        {activeTab === "comments" && <Comments data={client} />}
        {activeTab === "transactions" && <Transactions data={client} />}
        {activeTab === "mails" && <Mails data={client} />}
      </div>
    </div>
  );
}
