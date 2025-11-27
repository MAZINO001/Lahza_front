/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/utils/axios";
import FormField from "@/Components/Form/FormField";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { useAuthContext } from "@/hooks/AuthContext";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import SelectField from "@/Components/Form/SelectField";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import { useLoading } from "@/hooks/LoadingContext";
export default function AddNewService() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isLoading, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      base_price: "",
      tax_rate: "0",
      status: "active",
    },
  });

  const location = useLocation();
  const editId = location.state?.editId;

  const [service, setService] = useState([]);
  const { show: showLoading, hide: hideLoading } = useLoading();
  useEffect(() => {
    if (!editId) return;

    const fetchData = async () => {
      showLoading();
      try {
        const req = await api.get(
          `${import.meta.env.VITE_BACKEND_URL}/services/${editId}`
        );
        const fetchedService = req.data;
        setService(fetchedService);

        reset({
          name: fetchedService.name,
          description: fetchedService.description,
          base_price: fetchedService.base_price,
          tax_rate: fetchedService.tax_rate || 0,
          status: fetchedService.status,
        });
      } catch (error) {
        console.error("Failed to fetch service:", error);
      } finally {
        hideLoading();
      }
    };

    fetchData();
  }, [editId, reset]);
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const onSubmit = async (data) => {
    if (isSubmitting) return;

    if (!startSubmit()) return;
    const serviceData = {
      name: data.name,
      description: data.description,
      base_price: Number(data.base_price).toFixed(2),
      tax_rate: data.tax_rate,
      status: data.status,
    };

    try {
      if (editId) {
        await api.put(
          `${import.meta.env.VITE_BACKEND_URL}/services/${editId}`,
          serviceData
        );
        alert("the service has been updated");
        navigate(`/${role}/services`);
      } else {
        await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/services`,
          serviceData
        );
        alert("the new service has been added");
      }
    } catch (error) {
      console.log(error);
    } finally {
      endSubmit();
    }

    reset();
  };
  return (
    // <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:w-[60%] w-full">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4  flex flex-col gap-4 w-full"
    >
      <div>
        <InputLabel htmlFor="email" value={"service name"} />
        <Input
          id="name"
          type="text"
          placeholder="e.g., Premium Web Development"
          {...register("name", {
            required: "name is required",
          })}
          value={watch("name")}
          onChange={(e) => setValue("name", e.target.value)}
          className="mt-1 block w-full"
        />
        <InputError message={errors.name?.message} className="mt-2" />
      </div>

      <div className="space-y-2">
        <InputLabel htmlFor="email" value={"service description"} />

        <Textarea
          id="description"
          type="text"
          placeholder="Describe the service in detail..."
          {...register("description", {
            required: "description is required",
          })}
          value={watch("description")}
          onChange={(e) => setValue("description", e.target.value)}
          className="mt-1 block w-full"
        />
        <InputError message={errors.description?.message} className="mt-2" />
      </div>

      <div className="space-y-2">
        <InputLabel htmlFor="email" value={"service price"} />

        <FormField
          id="base_price"
          type="number"
          placeholder="0.00"
          {...register("base_price", {
            required: "base_price is required",
          })}
          value={watch("base_price")}
          onChange={(e) => setValue("base_price", e.target.value)}
          className="mt-1 block w-full"
        />
        <InputError message={errors.base_price?.message} className="mt-2" />
      </div>
      <div className="space-y-2">
        <InputLabel htmlFor="tax_rate" value="Tax Rate" />
        <SelectField
          id="tax_rate"
          className="mt-1 block w-full"
          value={watch("tax_rate")}
          onChange={(value) => setValue("tax_rate", value)}
          options={[
            { value: "20", label: "20%" },
            { value: "0", label: "0% (No Tax)" },
          ]}
        />
        <InputError message={errors.tax_rate?.message} className="mt-2" />
      </div>

      {editId && (
        <div className="space-y-2">
          <InputLabel htmlFor="status" value="Service Status" />
          <SelectField
            id="status"
            className="mt-1 block w-full"
            value={watch("status")}
            onChange={(value) => setValue("status", value)}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <InputError message={errors.status?.message} className="mt-2" />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Link to={`/${role}/services`}>
          <Button type="button" variant="outline" className="cursor-pointer">
            cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isLoading} className="cursor-pointer">
          {isLoading ? (
            <>{editId ? "Updating Service..." : "Creating Service..."}</>
          ) : editId ? (
            "Update Service"
          ) : (
            "Create Service"
          )}
        </Button>
      </div>
    </form>
  );
}
