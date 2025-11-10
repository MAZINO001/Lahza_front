/* eslint-disable no-unused-vars */
import { ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import SelectField from "../Form/SelectField";

export default function Client_Sidebar({ data }) {
  const { id: currentId } = useParams();
  const { role } = useAuth();
  const {
    register,
    handleSubmit,
    watch: Watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  return (
    <div className="w-[25%] bg-white border-r border-gray-200">
      <div className="px-2 py-4 border-b flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {/* <ChevronDown className="w-4 h-4" /> */}
          <SelectField
            id="client_group"
            value={Watch("poste")}
            onChange={(value) => {
              setValue("poste", value);
            }}
            placeholder={"All Clients"}
            error={errors.poste}
            options={[
              { value: "all", label: "All Clients" },
              { value: "active", label: "Active Clients" },
              { value: "inactive", label: "Inactive Clients" },
              { value: "overdue", label: "Overdue Clients" },
              { value: "unpaid", label: "Unpaid Clients" },
            ]}
          />
        </button>

        <div className="flex gap-2 items-center">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New
          </Button>
          <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="cursor-pointer">
        {data?.map((c, index) => (
          <Link
            to={`/${role}/clients/${c.id}`}
            key={index}
            className={`block mb-1 rounded-tr-lg rounded-br-lg p-2 cursor-pointer border-l-2 transition ${
              c.id == currentId
                ? "bg-blue-50 border-l-blue-500"
                : "border-l-transparent hover:bg-gray-100"
            }`}
          >
            <div className="font-medium text-gray-900">{c.user?.name}</div>
            <div className="text-sm text-gray-500">MAD 0.00</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
