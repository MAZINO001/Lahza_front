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
import { Link, useLocation, useNavigate } from "react-router-dom";
import SelectField from "@/Components/Form/SelectField";
import { useSubmitProtection } from "@/hooks/spamBlocker";

export default function AddNewOffer() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      discount_type: "",
      discount_value: 0,
      start_date: "",
      end_date: "",
      status: "active",
    },
  });

  const location = useLocation();
  const editId = location.state?.editId;
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const [loading, setLoading] = useState(false);

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
          discount_value: offer.discount_value || 0,
          start_date: offer.start_date ? offer.start_date.split(" ")[0] : "", // YYYY-MM-DD
          end_date: offer.end_date ? offer.end_date.split(" ")[0] : "",
          status: offer.status || "active",
        });
      } catch (err) {
        console.error("Failed to fetch offer:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [editId, reset]);
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const onSubmit = async (data) => {
    if (!startSubmit()) return;
    try {
      setLoading(true);
      const payload = { ...data };

      if (editId) {
        await api.put(
          `${import.meta.env.VITE_BACKEND_URL}/offers/${editId}`,
          payload
        );
        alert("Offer updated successfully");
      } else {
        await api.post(`${import.meta.env.VITE_BACKEND_URL}/offers`, payload);
        alert("Offer created successfully");
      }

      navigate(`/${role}/offers`);
      reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong, try again!");
    } finally {
      endSubmit();
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 flex flex-col gap-4 w-full"
    >
      <div>
        <InputLabel htmlFor="title" value="Offer Title" />
        <Input
          id="title"
          type="text"
          placeholder="e.g., Premium Web Development"
          {...register("title", { required: "Title is required" })}
          value={watch("title")}
          onChange={(e) => setValue("title", e.target.value)}
          className="mt-1 block w-full"
        />
        <InputError message={errors.title?.message} />
      </div>

      <div>
        <InputLabel htmlFor="description" value="Offer Description" />
        <Textarea
          id="description"
          placeholder="Describe the offer in detail..."
          {...register("description", { required: "Description is required" })}
          value={watch("description")}
          onChange={(e) => setValue("description", e.target.value)}
          className="mt-1 block w-full"
        />
        <InputError message={errors.description?.message} />
      </div>

      <div>
        <InputLabel htmlFor="discount_type" value="Discount Type" />
        <SelectField
          id="discount_type"
          value={watch("discount_type")}
          onChange={(value) => setValue("discount_type", value)}
          options={[
            { value: "fixed", label: "Fixed" },
            { value: "percent", label: "Percent" },
          ]}
          className="mt-1 block w-full"
        />
        <InputError message={errors.discount_type?.message} />
      </div>

      <div>
        <InputLabel htmlFor="discount_value" value="Discount Value" />
        <FormField
          id="discount_value"
          type="number"
          placeholder="0.00"
          {...register("discount_value", {
            required: "Discount value is required",
          })}
          value={watch("discount_value")}
          onChange={(e) => setValue("discount_value", e.target.value)}
          className="mt-1 block w-full"
        />
        <InputError message={errors.discount_value?.message} />
      </div>

      <div>
        <InputLabel htmlFor="start_date" value="Start Date" />
        <FormField
          id="start_date"
          type="date"
          {...register("start_date")}
          value={watch("start_date")}
          onChange={(e) => setValue("start_date", e.target.value)}
          className="mt-1 block w-full"
        />
        <InputError message={errors.start_date?.message} />
      </div>

      <div>
        <InputLabel htmlFor="end_date" value="End Date" />
        <FormField
          id="end_date"
          type="date"
          {...register("end_date")}
          value={watch("end_date")}
          onChange={(e) => setValue("end_date", e.target.value)}
          className="mt-1 block w-full"
        />
        <InputError message={errors.end_date?.message} />
      </div>

      {editId && (
        <div>
          <InputLabel htmlFor="status" value="Offer Status" />
          <SelectField
            id="status"
            value={watch("status")}
            onChange={(value) => setValue("status", value)}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            className="mt-1 block w-full"
          />
          <InputError message={errors.status?.message} />
        </div>
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
