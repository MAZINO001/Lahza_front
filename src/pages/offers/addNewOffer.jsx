/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import api from "@/utils/axios";
import FormField from "@/Components/Form/FormField";
import { useAuthContext } from "@/hooks/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SelectField from "@/Components/Form/SelectField";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import { useLoading } from "@/hooks/LoadingContext";
import TextareaField from "@/Components/Form/TextareaField";

export default function AddNewOffer() {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      discount_type: "",
      discount_value: 0,
      start_date: "",
      end_date: "",
      service_id: null,
      status: "active",
    },
  });

  const location = useLocation();
  const editId = location.state?.editId;
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();

  const { show: showLoading, hide: hideLoading } = useLoading();
  useEffect(() => {
    const fetchServices = async () => {
      showLoading();
      try {
        const res = await api.get(
          `${import.meta.env.VITE_BACKEND_URL}/services`
        );
        setServices(res.data);
      } catch (error) {
        console.error(
          "Error fetching services:",
          error.response?.data || error
        );
        alert(
          `Failed to get services: ${error.response?.data?.message || error.message}`
        );
      } finally {
        hideLoading();
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (!editId) return;

    const fetchOffer = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `${import.meta.env.VITE_BACKEND_URL}/offers/${editId}`
        );
        const offer = res.data;

        reset({
          title: offer.title || "",
          description: offer.description || "",
          discount_type: offer.discount_type || "",
          discount_value: parseFloat(offer.discount_value) || 0,
          start_date: offer.start_date ? offer.start_date.split(" ")[0] : "",
          end_date: offer.end_date ? offer.end_date.split(" ")[0] : "",
          service_id: offer.service_id ? parseInt(offer.service_id, 10) : null,
          status: offer.status || "active",
        });
      } catch (err) {
        console.error("Failed to fetch offer:", err);
        alert("Failed to load offer data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [editId, reset]);

  const onSubmit = async (data) => {
    if (!startSubmit()) return;

    try {
      setLoading(true);

      if (editId) {
        await api.put(
          `${import.meta.env.VITE_BACKEND_URL}/offers/${editId}`,
          data
        );
        alert("Offer updated successfully");
      } else {
        await api.post(`${import.meta.env.VITE_BACKEND_URL}/offers`, data);
        alert("Offer created successfully");
      }

      navigate(`/${role}/offers`);
      reset();
    } catch (err) {
      console.error("Error submitting offer:", err);
      alert(
        `Something went wrong: ${err.response?.data?.message || "Please try again!"}`
      );
    } finally {
      endSubmit();
      setLoading(false);
    }
  };

  const serviceOptions = services.map((s) => ({
    label: s.name,
    value: String(s.id), // Convert to string
  }));
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 flex flex-col gap-4 w-full"
    >
      <Controller
        name="title"
        control={control}
        rules={{ required: "Title is required" }}
        render={({ field }) => (
          <FormField
            label="Offer Title"
            error={errors.title?.message}
            id="title"
            type="text"
            placeholder="e.g., Premium Web Development"
            {...field}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        rules={{ required: "Description is required" }}
        render={({ field }) => (
          <TextareaField
            label="Offer Description"
            error={errors.description?.message}
            id="description"
            placeholder="Describe the offer in detail..."
            {...field}
          />
        )}
      />

      <Controller
        name="service_id"
        control={control}
        rules={{ required: "Please select a service" }}
        render={({ field, fieldState: { error } }) => (
          <SelectField
            label="Service"
            options={serviceOptions}
            value={String(field.value || "")}
            onChange={(val) => {
              field.onChange(Number(val));
            }}
            onBlur={field.onBlur}
            error={error?.message}
            placeholder="Select or add a Service"
          />
        )}
      />

      <Controller
        name="discount_type"
        control={control}
        rules={{ required: "Please select a discount type" }}
        render={({ field, fieldState: { error } }) => (
          <SelectField
            label="Discount Type"
            id="discount_type"
            options={[
              { value: "fixed", label: "Fixed" },
              { value: "percent", label: "Percent" },
            ]}
            placeholder="Select discount type"
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={error?.message}
          />
        )}
      />

      <Controller
        name="discount_value"
        control={control}
        rules={{
          required: "Discount value is required",
          min: { value: 0, message: "Discount value cannot be negative" },
        }}
        render={({ field: { onChange, ...field } }) => (
          <FormField
            label="Discount Value"
            error={errors.discount_value?.message}
            id="discount_value"
            type="number"
            step="1"
            placeholder="0.00"
            {...field}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          />
        )}
      />

      <Controller
        name="start_date"
        control={control}
        rules={{ required: "Start date is required" }}
        render={({ field }) => (
          <FormField
            id="start_date"
            label="Start Date*"
            error={errors.start_date?.message}
            type="date"
            {...field}
          />
        )}
      />

      <Controller
        name="end_date"
        control={control}
        rules={{ required: "End date is required" }}
        render={({ field }) => (
          <FormField
            label="End Date"
            error={errors.end_date?.message}
            id="end_date"
            type="date"
            {...field}
          />
        )}
      />

      {editId && (
        <Controller
          name="status"
          control={control}
          rules={{ required: "Please select an offer status" }}
          render={({ field }) => (
            <SelectField
              label="Offer Status"
              id="status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              error={errors.status?.message}
              {...field}
            />
          )}
        />
      )}
      <div className="flex justify-end gap-3 pt-4">
        <Link to={`/${role}/offers`}>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting || loading}>
          {isSubmitting || loading
            ? editId
              ? "Updating Offer..."
              : "Creating Offer..."
            : editId
              ? "Update Offer"
              : "Create Offer"}
        </Button>
      </div>
    </form>
  );
}
