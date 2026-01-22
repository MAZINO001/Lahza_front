import { Edit2, MoreVertical, Plus, X } from "lucide-react";
import React, { useState } from "react";
import Transactions from "./Client_page/transactions/transactions";
import { Link, useParams } from "react-router-dom";
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
import {
  useClient,
  useDeleteClient,
} from "@/features/clients/hooks/useClients/useClientsData";
import ClientBanner from "@/components/ClientBanner";
import { Controller, useForm } from "react-hook-form";
import FileUploader from "@/components/Form/FileUploader";
import AlertDialogDestructive from "../alert-dialog-destructive-1";
import ComboBoxWithStates3 from "@/components/combobox-with-states-3";
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
  const { role } = useAuthContext();

  const deleteClientMutation = useDeleteClient();

  const handleDeleteClient = () => {
    deleteClientMutation.mutate(currentId);
  };
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "comments", label: "Comments" },
    { id: "transactions", label: "Transactions" },
    { id: "mails", label: "Mails" },
  ];

  return (
    <div className="w-[75%] flex flex-col">
      <div className="p-4 border-t border-b border-border">
        <div className="flex gap-4 items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground ">
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

            <Controller
              name="client_files"
              control={control}
              render={({ field }) => <ComboBoxWithStates3 />}
            />

            <Link to={`/${role}/invoice/new`} state={{ clientId: currentId }}>
              <Button className="p-2 cursor-pointer">
                <Plus className="w-4 h-4" />
                New Transaction
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 border border-border rounded-md bg-background">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 z-50">
                <DropdownMenuItem onClick={() => console.log("stop reminders")}>
                  Stop all reminders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("clone client")}>
                  Client Portal
                </DropdownMenuItem>
                <AlertDialogDestructive
                  onDelete={handleDeleteClient}
                  trigger={
                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                      Delete client
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <Link to={`/${role}/clients`}>
              <Button variant="outline" className="cursor-pointer">
                <X className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className=" border-b border-border">
        <div className="flex px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-muted-foreground  hover:text-foreground "
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto p-4">
        {activeTab === "overview" && <ClientBanner currentId={currentId} />}
        {activeTab === "overview" && (
          <OverView data={client} currentId={currentId} />
        )}
        {activeTab === "comments" && (
          <Comments type={"clients"} currentId={currentId} data={client} />
        )}
        {activeTab === "transactions" && <Transactions currentId={currentId} />}
        {activeTab === "mails" && <Mails currentId={currentId} />}
      </div>
    </div>
  );
}
