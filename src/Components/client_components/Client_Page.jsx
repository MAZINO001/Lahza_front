/* eslint-disable no-unused-vars */
import { Edit2, Link2Icon, MoreVertical, Plus, X } from "lucide-react";
import React, { useState } from "react";
import Transactions from "./Client_page/transactions/transactions";
import { Link, Links, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthContext } from "@/hooks/AuthContext";
import OverView from "./Client_page/overview/overview";
import Comments from "./Client_page/comments/Comments";
import Mails from "./Client_page/mails/Mails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClient } from "@/features/clients/hooks/useClientsQuery";
import ClientBanner from "@/components/ClientBanner";
import { Controller, useForm } from "react-hook-form";
import FileUploader from "@/components/Form/FileUploader";
export default function Client_Page({ currentId }) {
  const [activeTab, setActiveTab] = useState("overview");
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      client_files: "",
    },
  });
  const {
    data: client,
    isLoading: clientLoading,
    isError: clientError,
  } = useClient(currentId);
  console.log(client);
  const { role } = useAuthContext();
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "comments", label: "Comments" },
    { id: "transactions", label: "Transactions" },
    { id: "mails", label: "Mails" },
  ];

  return (
    <div className=" w-[75%] flex flex-col">
      <div className="bg-white p-4 border-b border-border">
        <div className="flex gap-4 items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 ">
            {client?.client_type === "company"
              ? client?.company
              : client?.user?.name}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="p-2 cursor-pointer">
              <Link
                to={`/${role}/client/${currentId}/edit`}
                state={{ clientId: currentId }}
              >
                <Edit2 size={20} />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  variant="outline"
                  className="p-2 border border-border rounded-md"
                >
                  <Link2Icon className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 z-9999">
                <DropdownMenuItem className="bg-white hover:bg-white hover:text-black focus:bg-white focus:text-black">
                  <Controller
                    name="client_files"
                    control={control}
                    render={({ field }) => (
                      <FileUploader
                        label="Client Files"
                        placeholder="Client Files path or URL"
                        error={errors.client_files?.message}
                        {...field}
                      />
                    )}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to={`/${role}/invoice/new`} state={{ clientId: currentId }}>
              <Button className="p-2 cursor-pointer">
                <Plus className="w-4 h-4" />
                New Transaction
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  variant="outline"
                  className="p-2 border border-border rounded-md "
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 z-9999">
                <DropdownMenuItem onClick={() => console.log("stop reminders")}>
                  Stop all reminders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("clone client")}>
                  Client Portal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("clone client")}>
                  Clone client
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => console.log("delete client")}
                >
                  Delete client
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <Link to={`/${role}/clients`}>
              <Button variant="outline" className="p-2 cursor-pointer">
                <X className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-border">
        <div className="flex px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex  flex-col gap-4 overflow-y-auto p-4">
        {activeTab === "overview" && <ClientBanner />}
        {activeTab === "overview" && <OverView data={client} />}
        {activeTab === "comments" && <Comments data={client} />}
        {activeTab === "transactions" && <Transactions data={client} />}
        {activeTab === "mails" && <Mails data={client} />}
      </div>
    </div>
  );
}
