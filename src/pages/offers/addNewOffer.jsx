// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import api from "@/utils/axios";
// import FormField from "@/Components/Form/FormField";
// import InputLabel from "@/Components/InputLabel";
// import InputError from "@/Components/InputError";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
// import SelectField from "@/Components/Form/SelectField";
// export default function AddNewOffer() {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     watch,
//     formState: { errors, isSubmitting, isSubmitSuccessful },
//   } = useForm({
//     defaultValues: {
//       name: "",
//       description: "",
//       base_price: "",
//       tax_rate: "0",
//       status: "active",
//     },
//   });

//   const location = useLocation();
//   const editId = location.state?.editId;

//   const [offer, setOffer] = useState([]);
//   useEffect(() => {
//     if (!editId) return;

//     const fetchData = async () => {
//       try {
//         const req = await api.get(
//           `${import.meta.env.VITE_BACKEND_URL}/offers/${editId}`
//         );
//         const fetchedOffer = req.data;
//         setOffer(fetchedOffer);

//         reset({
//           name: fetchedOffer.name,
//           description: fetchedOffer.description,
//           base_price: fetchedOffer.base_price,
//           tax_rate: fetchedOffer.tax_rate || 0,
//           status: fetchedOffer.status,
//         });
//       } catch (error) {
//         console.error("Failed to fetch offer:", error);
//       }
//     };

//     fetchData();
//   }, [editId, reset]);
//   const navigate = useNavigate();
//   const { role } = useAuthContext();
//   const onSubmit = async (data) => {
//     const offerData = {
//       name: data.name,
//       description: data.description,
//       base_price: Number(data.base_price).toFixed(2),
//       tax_rate: data.tax_rate,
//       status: data.status,
//     };

//     try {
//       if (editId) {
//         await api.put(
//           `${import.meta.env.VITE_BACKEND_URL}/offers/${editId}`,
//           offerData
//         );
//         alert("the offer has been updated");
//         navigate(`/${role}/offers`);
//       } else {
//         await api.post(`${import.meta.env.VITE_BACKEND_URL}/offers`, offerData);
//         alert("the new offer has been added");
//       }
//     } catch (error) {
//       console.log(error);
//     }

//     reset();
//   };
//   return (
//     // <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:w-[60%] w-full">
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="p-4  flex flex-col gap-4 w-full"
//     >
//       <div>
//         <InputLabel htmlFor="email" value={"offer name"} />
//         <Input
//           id="name"
//           type="text"
//           placeholder="e.g., Premium Web Development"
//           {...register("name", {
//             required: "name is required",
//           })}
//           value={watch("name")}
//           onChange={(e) => setValue("name", e.target.value)}
//           className="mt-1 block w-full"
//         />
//         <InputError message={errors.name?.message} className="mt-2" />
//       </div>

//       <div className="space-y-2">
//         <InputLabel htmlFor="email" value={"offer description"} />

//         <Textarea
//           id="description"
//           type="text"
//           placeholder="Describe the offer in detail..."
//           {...register("description", {
//             required: "description is required",
//           })}
//           value={watch("description")}
//           onChange={(e) => setValue("description", e.target.value)}
//           className="mt-1 block w-full"
//         />
//         <InputError message={errors.description?.message} className="mt-2" />
//       </div>

//       <div className="space-y-2">
//         <InputLabel htmlFor="email" value={"offer price"} />

//         <FormField
//           id="base_price"
//           type="number"
//           placeholder="0.00"
//           {...register("base_price", {
//             required: "base_price is required",
//           })}
//           value={watch("base_price")}
//           onChange={(e) => setValue("base_price", e.target.value)}
//           className="mt-1 block w-full"
//         />
//         <InputError message={errors.base_price?.message} className="mt-2" />
//       </div>
//       <div className="space-y-2">
//         <InputLabel htmlFor="tax_rate" value="Tax Rate" />
//         <SelectField
//           id="tax_rate"
//           className="mt-1 block w-full"
//           value={watch("tax_rate")}
//           onChange={(value) => setValue("tax_rate", value)}
//           options={[
//             { value: "20", label: "20%" },
//             { value: "0", label: "0% (No Tax)" },
//           ]}
//         />
//         <InputError message={errors.tax_rate?.message} className="mt-2" />
//       </div>

//       {editId && (
//         <div className="space-y-2">
//           <InputLabel htmlFor="status" value="Offer Status" />
//           <SelectField
//             id="status"
//             className="mt-1 block w-full"
//             value={watch("status")}
//             onChange={(value) => setValue("status", value)}
//             options={[
//               { value: "active", label: "Active" },
//               { value: "inactive", label: "Inactive" },
//             ]}
//           />
//           <InputError message={errors.status?.message} className="mt-2" />
//         </div>
//       )}

//       <div className="flex justify-end gap-3 pt-4">
//         <Link to={`/${role}/offers`}>
//           <Button type="button" variant="outline" className="cursor-pointer">
//             cancel
//           </Button>
//         </Link>
//         <Button
//           type="submit"
//           disabled={isSubmitting}
//           className="cursor-pointer"
//         >
//           {isSubmitting ? (
//             <>{editId ? "Updating Offer..." : "Creating Offer..."}</>
//           ) : editId ? (
//             "Update Offer"
//           ) : (
//             "Create Offer"
//           )}
//         </Button>
//       </div>
//     </form>
//   );
// }

import React from 'react'

export default function addNewOffer() {
  return (
    <div>addNewOffer</div>
  )
}
