// /* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect } from "react";
// import { useForm, Controller, useFieldArray } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Minus, Plus, X } from "lucide-react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { useSubmitProtection } from "@/hooks/spamBlocker";
// import FormField from "@/Components/Form/FormField";
// import SelectField from "@/Components/Form/SelectField";
// import SelectField_Search from "@/Components/Form/SelectField_Search";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import FileUploader from "@/components/Form/FileUploader";
// import ServiceSelect from "@/Components/Invoice_Quotes/ServiceSelector";

// import { terms } from "@/lib/Terms_Conditions.json";
// import {
//   useCreateDocument,
//   useDocument,
//   useUpdateDocument,
// } from "../hooks/useDocumentsQuery";
// import { useClients } from "@/features/clients/hooks/useClientsQuery";
// import { useServices } from "@/features/services/hooks/useServiceQuery";
// import AddClientModel from "@/components/common/AddClientModel";
// import TextareaField from "@/components/Form/TextareaField";

// export function DocumentForm({ type, onSuccess }) {
//   const navigate = useNavigate();
//   const { role } = useAuthContext();
//   const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
//   const { id } = useParams();

//   const { state } = useLocation();
//   const clientId = state?.clientId;
//   const cloneFromId = state?.cloneFromId;
//   const quoteId = state?.quoteId;

//   const isEditMode = !!id;
//   const isCloneMode = !!cloneFromId;

//   const documentId = quoteId ?? id ?? cloneFromId;
//   const documentType = quoteId ? "quotes" : type;

//   const { data: document } = useDocument(documentId, documentType);

//   console.log(document);

//   const isInvoice = type === "invoices";
//   const { data: clients, isLoading: clientsLoading } = useClients();
//   const { data: services = [], isLoading: servicesLoading } = useServices();

//   const createMutation = useCreateDocument(type);
//   const updateMutation = useUpdateDocument(type);

//   const mutation = isEditMode ? updateMutation : createMutation;

//   const projects = document?.client?.has_projects
//     ? JSON.parse(document.has_projects)
//     : [];

//   const {
//     register,
//     handleSubmit,
//     control,
//     setValue,
//     reset,
//     watch,
//     trigger,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       customerName: clientId || "",
//       ...(isInvoice
//         ? {
//             invoice_date: new Date().toISOString().split("T")[0],
//             due_date: new Date().toISOString().split("T")[0],
//           }
//         : {
//             quoteDate: new Date().toISOString().split("T")[0],
//           }),
//       notes: "",
//       payment_percentage: "50",
//       payment_status: "pending",
//       payment_type: "",
//       description: "",
//       terms,
//       old_projects: [],
//       has_projects: { title: [] },
//       items: [
//         {
//           serviceId: null,
//           description: "",
//           quantity: 1,
//           rate: 0,
//           tax: 0,
//           discount: 0,
//           amount: 0,
//         },
//       ],
//     },
//   });

//   const {
//     fields: itemFields,
//     append: appendItem,
//     remove: removeItem,
//   } = useFieldArray({
//     control,
//     name: "items",
//   });

//   const {
//     fields: has_projectFields,
//     append: appendHas_project,
//     remove: removeHas_project,
//   } = useFieldArray({
//     control,
//     name: "has_projects.title",
//   });

//   const items = watch("items");
//   useEffect(() => {
//     if (document && (isEditMode || isCloneMode)) {
//       const doc = document;
//       console.log(doc);
//       let projectTitles = [];
//       if (projects && projects.title && Array.isArray(projects.title)) {
//         projectTitles = projects.title.filter((t) => t !== "");
//       } else if (Array.isArray(projects) && projects.length > 0) {
//         projectTitles = projects
//           .map((p) => p.title || "")
//           .filter((t) => t !== "");
//       }

//       reset({
//         customerName: doc.client?.id || doc.client_id || clientId,
//         ...(isInvoice
//           ? {
//               invoice_date: doc.invoice_date,
//               due_date: doc.due_date,
//             }
//           : {
//               quoteDate: doc.quotation_date,
//             }),
//         notes: doc.notes || "",
//         terms: doc.terms || terms,
//         payment_percentage: "50",
//         payment_status: "pending",
//         payment_type: doc.payment_type,
//         description: doc?.description,
//         has_projects: {
//           title: projectTitles,
//         },
//         old_projects: doc?.old_projects,
//         items:
//           (isInvoice ? doc.invoice_services : doc.quote_services)?.map((s) => {
//             const serviceDetails = services.find(
//               (srv) => Number(srv.id) === Number(s.service_id)
//             );

//             return {
//               serviceId: Number(s.service_id),
//               description: serviceDetails?.description || "",
//               quantity: s.quantity,
//               rate: parseFloat(s.individual_total) / s.quantity || 0,
//               tax: Number(serviceDetails?.tax_rate) || 0,
//               discount: 0,
//               amount: parseFloat(s.individual_total),
//             };
//           }) || [],
//       });
//     }
//   }, [document, isEditMode, isCloneMode, isInvoice, reset, services]);

//   const clientOptions = clients?.map((c) => ({
//     label: c.client?.user?.name || c.name || "Unknown Client",
//     value: String(c.client?.id),
//   }));

//   // const { data: AllProjects } = useProject();

//   const AllProjects = [
//     { id: 1, name: "Landing Page Redesign" },
//     { id: 2, name: "E-commerce Dashboard" },
//     { id: 3, name: "Mobile App API" },
//     { id: 4, name: "Portfolio Website" },
//     { id: 5, name: "Admin Panel Revamp" },
//     { id: 6, name: "SaaS Auth System" },
//     { id: 7, name: "Marketing Website" },
//     { id: 8, name: "CRM Integration" },
//     { id: 9, name: "Internal Tools" },
//     { id: 10, name: "Blog Platform" },
//   ];

//   const ProjectOptions = AllProjects?.map((p) => ({
//     label: p.name || "Unknown Project",
//     value: String(p.id),
//   }));

//   const selectedClientId = watch("customerName");

//   const selectedClient = clients?.find(
//     (c) => c.client?.id === Number(selectedClientId)
//   );

//   useEffect(() => {
//     if (selectedClient) {
//       const isMoroccan =
//         selectedClient?.client?.country?.trim().toLowerCase() === "maroc";
//       const defaultPaymentMethod = isMoroccan ? "bank" : "stripe";
//       setValue("payment_type", defaultPaymentMethod);
//     }
//   }, [selectedClient, setValue]);

//   useEffect(() => {
//     const currentProjects = watch("has_projects");
//     if (!currentProjects?.title || currentProjects.title.length === 0) {
//       setValue("has_projects", { title: [] });
//     }
//   }, []);
//   const addNewRow = () => {
//     appendItem({
//       service: "",
//       serviceId: null,
//       description: "",
//       quantity: 1,
//       rate: 0,
//       tax: 0,
//       discount: 0,
//       amount: 0,
//     });
//   };

//   const deleteRow = (index) => {
//     if (itemFields.length > 1) {
//       removeItem(index);
//     }
//   };

//   const cancelFunction = () => {
//     reset();
//     navigate(`/${role}/${isInvoice ? "invoices" : "quotes"}`);
//   };

//   const updateItem = (index, field, value) => {
//     setValue(`items.${index}.${field}`, Number(value));
//     const quantity = Number(watch(`items.${index}.quantity`) || 1);
//     const rate = Number(watch(`items.${index}.rate`) || 0);
//     const tax = Number(watch(`items.${index}.tax_rate`) || 0);
//     const discount = Number(watch(`items.${index}.discount`) || 0);
//     const base = quantity * rate;
//     const taxAmount = base * (tax / 100);
//     const totalAfterTax = base + taxAmount;
//     const discountAmount = totalAfterTax * (discount / 100);
//     const finalAmount = totalAfterTax - discountAmount;

//     setValue(`items.${index}.amount`, Number(finalAmount.toFixed(2)));
//   };

//   const calculateTotal = () =>
//     items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
//   const onSubmit = async (data, status) => {
//     if (isSubmitting || !startSubmit()) return;

//     const payload = {
//       client_id: Number(data.customerName),
//       ...(isInvoice
//         ? {
//             invoice_date: data.invoice_date,
//             due_date: data.due_date,
//             status: status || "unpaid",
//             balance_due: Number(calculateTotal().toFixed(2)),
//           }
//         : {
//             quotation_date: data.quoteDate,
//             status: status || "draft",
//             description: data.description,
//           }),

//       total_amount: Number(calculateTotal().toFixed(2)),
//       notes: data.notes || "",
//       terms: data.terms || terms,
//       has_projects: JSON.stringify({
//         title: data.has_projects?.title || [],
//       }),
//       old_projects: data.old_projects,
//       payment_percentage: Number(data.payment_percentage),
//       payment_status: data.payment_status,
//       payment_type: data.payment_type,

//       services: data.items.map((item) => ({
//         service_id: Number(item.serviceId),
//         quantity: Number(item.quantity),
//         rate: Number(item.rate),
//         tax: Number(item.tax),
//         discount: Number(item.discount || 0),
//         individual_total: Number(item.amount),
//       })),
//     };

//     console.log("the payload:", payload);

//     mutation.mutate(isEditMode ? { id: id, data: payload } : payload, {
//       onSuccess: () => {
//         onSuccess?.();
//         if (!isEditMode) reset();
//       },
//       onSettled: () => endSubmit(),
//     });
//   };

//   if (clientsLoading || servicesLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }
//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-full">
//       <div className="space-y-4">
//         <div className="flex items-end justify-between gap-4">
//           <div className="w-full">
//             <Controller
//               name="customerName"
//               control={control}
//               rules={{ required: "Please select a customer" }}
//               render={({ field, fieldState: { error } }) => (
//                 <SelectField
//                   label="Customer"
//                   options={clientOptions}
//                   value={field.value || ""}
//                   onChange={(val) => field.onChange(val)}
//                   onBlur={field.onBlur}
//                   error={error?.message}
//                   placeholder="Select or add a customer"
//                 />
//               )}
//             />
//           </div>
//           <AddClientModel />
//         </div>

//         {selectedClient && (
//           <div className="flex gap-4 p-4 border rounded bg-background text-sm space-y-4 max-w-[700px]">
//             <div className="flex flex-col gap-2 w-[50%]">
//               <p>
//                 <span className="font-medium">Name:</span>{" "}
//                 {selectedClient?.client?.user?.name}
//               </p>
//               <p>
//                 <span className="font-medium">Email:</span>{" "}
//                 {selectedClient?.client?.user?.email}
//               </p>
//               <p>
//                 <span className="font-medium">Client Type:</span>{" "}
//                 {selectedClient?.client?.client_type}
//               </p>
//               {selectedClient?.client?.company && (
//                 <p>
//                   <span className="font-medium">Company:</span>{" "}
//                   {selectedClient?.client?.company}
//                 </p>
//               )}
//               <p>
//                 <span className="font-medium">Phone:</span>{" "}
//                 {selectedClient?.client?.phone}
//               </p>
//               <p>
//                 <span className="font-medium">Address:</span>{" "}
//                 {selectedClient?.client?.address}
//               </p>
//               <p>
//                 <span className="font-medium">City:</span>{" "}
//                 {selectedClient?.client?.city}
//               </p>
//             </div>

//             {/* Second Row */}
//             <div className="flex flex-col gap-4  w-[50%]">
//               <p>
//                 <span className="font-medium">Country:</span>{" "}
//                 {selectedClient?.client?.country}
//               </p>
//               <p>
//                 <span className="font-medium">Currency:</span>{" "}
//                 {selectedClient?.client?.currency || "MAD"}
//               </p>
//               {selectedClient?.client?.ice && (
//                 <p>
//                   <span className="font-medium">ICE:</span>{" "}
//                   {selectedClient?.client?.ice}
//                 </p>
//               )}
//               {selectedClient?.client?.siren && (
//                 <p>
//                   <span className="font-medium">SIREN:</span>{" "}
//                   {selectedClient?.client?.siren}
//                 </p>
//               )}
//               <p>
//                 <span className="font-medium">VAT:</span>{" "}
//                 {selectedClient?.client?.vat || "20%"}
//               </p>
//             </div>
//           </div>
//         )}

//         {isInvoice ? (
//           <>
//             <Controller
//               name="invoice_date"
//               control={control}
//               rules={{ required: "Invoice date is required" }}
//               render={({ field, fieldState: { error } }) => (
//                 <FormField
//                   id="invoice_date"
//                   label="Invoice Date*"
//                   type="date"
//                   value={field.value || ""}
//                   onChange={(e) => field.onChange(e.target.value)}
//                   onBlur={field.onBlur}
//                   error={error?.message}
//                 />
//               )}
//             />

//             <Controller
//               name="due_date"
//               control={control}
//               rules={{ required: "Due date is required" }}
//               render={({ field, fieldState: { error } }) => (
//                 <FormField
//                   id="due_date"
//                   label="Due Date*"
//                   type="date"
//                   value={field.value || ""}
//                   onChange={(e) => field.onChange(e.target.value)}
//                   onBlur={field.onBlur}
//                   error={error?.message}
//                 />
//               )}
//             />
//           </>
//         ) : (
//           <>
//             <Controller
//               name="quoteDate"
//               control={control}
//               rules={{ required: "Quote date is required" }}
//               render={({ field, fieldState: { error } }) => (
//                 <FormField
//                   id="quoteDate"
//                   label="Quote Date*"
//                   type="date"
//                   value={field.value || ""}
//                   onChange={(e) => field.onChange(e.target.value)}
//                   onBlur={field.onBlur}
//                   error={error?.message}
//                 />
//               )}
//             />

//             <Controller
//               name="description"
//               control={control}
//               render={({ field, fieldState: { error } }) => (
//                 <FormField
//                   id="description"
//                   label="Object"
//                   type="text"
//                   value={field.value || ""}
//                   placeholder="Type An Object"
//                   onChange={(e) => field.onChange(e.target.value)}
//                   onBlur={field.onBlur}
//                   error={error?.message}
//                 />
//               )}
//             />
//           </>
//         )}

//         <div className="mt-4">
//           <span className="text-sm font-medium  text-foreground mb-4">
//             Item Table
//           </span>
//           <div className="overflow-x-auto border rounded-md rounded-br-none">
//             <table className="w-full min-w-[500px] border-collapse">
//               <thead>
//                 <tr className="bg-background">
//                   <th className="p-2 text-left text-sm font-semibold text-foreground">
//                     ITEM DETAILS
//                   </th>
//                   <th className="p-2 text-right text-sm font-semibold text-foreground w-30">
//                     QUANTITY
//                   </th>
//                   <th className="p-2 text-right text-sm font-semibold text-foreground w-30">
//                     RATE
//                   </th>
//                   <th className="p-2 text-right text-sm font-semibold text-foreground w-30">
//                     TAX
//                   </th>
//                   <th className="p-2 text-right text-sm font-semibold text-foreground w-30">
//                     DISCOUNT
//                   </th>
//                   <th className="p-2 text-right text-sm font-semibold text-foreground w-30">
//                     AMOUNT
//                   </th>
//                   <th className="p-2 w-16"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {itemFields.map((field, index) => {
//                   const selectedService = watch(`items.${index}.serviceId`);
//                   return (
//                     <tr
//                       key={field.id}
//                       className="border-b border-border hover:bg-background"
//                     >
//                       <td className="p-2">
//                         <Controller
//                           name={`items.${index}.serviceId`}
//                           control={control}
//                           rules={{
//                             required: "Service is required",
//                             validate: (value) =>
//                               !!value || "Service is required",
//                           }}
//                           render={({ field, fieldState: { error } }) => (
//                             <ServiceSelect
//                               services={services}
//                               value={field.value || ""}
//                               onChange={(val) => {
//                                 const serviceId = Number(val);
//                                 field.onChange(serviceId);

//                                 const service = services.find(
//                                   (s) => Number(s.id) === serviceId
//                                 );
//                                 if (!service) return;

//                                 const unitPrice = Number(service.base_price);
//                                 setValue(`items.${index}.rate`, unitPrice);
//                                 setValue(
//                                   `items.${index}.description`,
//                                   service.description
//                                 );
//                                 setValue(`items.${index}.service`, serviceId);

//                                 const quantity = Number(
//                                   watch(`items.${index}.quantity`) || 1
//                                 );

//                                 const tax_rate = Number(service.tax_rate);
//                                 setValue(`items.${index}.tax_rate`, tax_rate);

//                                 const discount = Number(
//                                   watch(`items.${index}.discount`) || 0
//                                 );

//                                 const base = quantity * unitPrice;
//                                 const taxAmount = base * (tax_rate / 100);
//                                 const totalAfterTax = base + taxAmount;
//                                 const discountAmount =
//                                   totalAfterTax * (discount / 100);
//                                 const finalAmount =
//                                   totalAfterTax - discountAmount;

//                                 setValue(
//                                   `items.${index}.amount`,
//                                   Number(finalAmount.toFixed(2))
//                                 );
//                               }}
//                               error={error?.message}
//                               placeholder="Select a service"
//                             />
//                           )}
//                         />
//                         {selectedService && (
//                           <Textarea
//                             {...register(`items.${index}.description`)}
//                             placeholder="Enter service description"
//                             className="mt-2 w-full border border-border p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
//                             rows={2}
//                             value={watch(`items.${index}.description`) || ""}
//                             onChange={(e) =>
//                               setValue(
//                                 `items.${index}.description`,
//                                 e.target.value
//                               )
//                             }
//                           />
//                         )}
//                       </td>

//                       <td className="p-2">
//                         <FormField
//                           type="number"
//                           value={watch(`items.${index}.quantity`) ?? ""}
//                           {...register(`items.${index}.quantity`, {
//                             required: "Quantity is required",
//                             min: {
//                               value: 1,
//                               message: "Quantity must be at least 1",
//                             },
//                             valueAsNumber: true,
//                           })}
//                           error={errors.items?.[index]?.quantity?.message}
//                           onChange={(e) => {
//                             updateItem(index, "quantity", e.target.value);
//                             trigger(`items.${index}.quantity`);
//                           }}
//                         />
//                       </td>

//                       <td className="p-2">
//                         <FormField
//                           type="number"
//                           value={watch(`items.${index}.rate`) ?? ""}
//                           {...register(`items.${index}.rate`, {
//                             required: "Rate is required",
//                             min: {
//                               value: 0,
//                               message: "Rate cannot be negative",
//                             },
//                             valueAsNumber: true,
//                           })}
//                           error={errors.items?.[index]?.rate?.message}
//                           onChange={(e) => {
//                             updateItem(index, "rate", e.target.value);
//                             trigger(`items.${index}.rate`);
//                           }}
//                         />
//                       </td>

//                       <td className="p-2">
//                         <FormField
//                           type="number"
//                           value={
//                             watch(`items.${index}.tax_rate`) ??
//                             watch(`items.${index}.tax`)
//                           }
//                           {...register(`items.${index}.tax_rate`, {
//                             // required: "Tax is required",
//                             min: {
//                               value: 0,
//                               message: "Tax cannot be negative",
//                             },
//                             max: {
//                               value: 100,
//                               message: "Tax cannot exceed 100%",
//                             },
//                             valueAsNumber: true,
//                           })}
//                           error={errors.items?.[index]?.tax_rate?.message}
//                           onChange={(e) => {
//                             updateItem(index, "tax_rate", e.target.value);
//                             trigger(`items.${index}.tax_rate`);
//                           }}
//                         />
//                       </td>

//                       <td className="p-2">
//                         <FormField
//                           type="number"
//                           value={watch(`items.${index}.discount`) ?? ""}
//                           {...register(`items.${index}.discount`, {
//                             required: "discount is required",
//                             min: {
//                               value: 0,
//                               message: "discount cannot be negative",
//                             },
//                             max: {
//                               value: 100,
//                               message: "discount cannot exceed 100%",
//                             },
//                             valueAsNumber: true,
//                           })}
//                           error={errors.items?.[index]?.discount?.message}
//                           onChange={(e) => {
//                             updateItem(index, "discount", e.target.value);
//                             trigger(`items.${index}.discount`);
//                           }}
//                         />
//                       </td>
//                       <td className="p-2 text-right font-medium text-foreground">
//                         {(watch(`items.${index}.amount`) || 0).toFixed(2)}
//                       </td>

//                       <td className="p-2 text-center">
//                         <button
//                           type="button"
//                           onClick={() => deleteRow(index)}
//                           className="text-muted-foreground hover:text-red-600 transition-colors p-1"
//                           disabled={itemFields.length === 1}
//                         >
//                           <X size={20} />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//           <div className="flex flex-row items-center justify-between">
//             <Button
//               type="button"
//               onClick={addNewRow}
//               className="flex items-center gap-2 text-white cursor-pointer text-sm font-medium mt-3"
//             >
//               <Plus size={18} /> Add New Row
//             </Button>

//             <div className="border-border md:w-[50%] w-full px-2 rounded-bl-lg rounded-br-lg border-b border-x">
//               <div className="flex justify-between py-3 text-lg font-semibold">
//                 <span className="text-foreground">Total ( $ )</span>
//                 <span className="text-foreground">
//                   {calculateTotal().toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-4 w-full items-start space-between">
//           <div
//             className={`flex gap-4 items-end justify-between ${!isInvoice ? "w-full" : "w-[50%]"}`}
//           >
//             <div className="w-full">
//               <Controller
//                 name="old_projects"
//                 control={control}
//                 render={({ field, fieldState: { error } }) => (
//                   <SelectField_Search
//                     label="Project"
//                     options={ProjectOptions}
//                     value={field.value || []}
//                     onChange={field.onChange}
//                     customValue={watch("has_projects.title") || []}
//                     onCustomChange={(newCustom) =>
//                       setValue("has_projects.title", newCustom)
//                     }
//                     error={error?.message}
//                     placeholder="Select or add a project"
//                   />
//                 )}
//               />
//             </div>
//           </div>
//           {isInvoice && (
//             <div className="w-[50%]">
//               <Label htmlFor="payment" className="mb-1">
//                 Payment
//               </Label>
//               <div className="flex md:flex-row flex-col gap-4 items-end justify-between border border-border p-4 rounded-lg">
//                 <div className="w-full flex gap-4 items-center justify-between">
//                   <Controller
//                     name="payment_type"
//                     control={control}
//                     render={({ field, fieldState: { error } }) => (
//                       <SelectField
//                         id="payment_type"
//                         label="Payment Type"
//                         type="select"
//                         value={field.value || ""}
//                         options={[
//                           { value: "bank", label: "Bank" },
//                           { value: "cash", label: "Cash" },
//                           { value: "espace", label: "Espace" },
//                           { value: "stripe", label: "Stripe" },
//                         ]}
//                         onChange={(e) => field.onChange(e)}
//                         onBlur={field.onBlur}
//                         error={error?.message}
//                       />
//                     )}
//                   />

//                   <Controller
//                     name="payment_percentage"
//                     control={control}
//                     rules={{ required: "Amount is required" }}
//                     render={({ field, fieldState: { error } }) => (
//                       <FormField
//                         id="payment_percentage"
//                         label="Percentage Paid"
//                         min="1"
//                         max="100"
//                         type="number"
//                         value={field.value || ""}
//                         onChange={(e) => field.onChange(e.target.value)}
//                         onBlur={field.onBlur}
//                         error={error?.message}
//                       />
//                     )}
//                   />
//                   <Controller
//                     name="payment_status"
//                     control={control}
//                     rules={{ required: "Status is required" }}
//                     render={({ field, fieldState: { error } }) => (
//                       <SelectField
//                         id="payment_status"
//                         label="Payment Status"
//                         type="select"
//                         value={field.value || ""}
//                         options={[
//                           { value: "pending", label: "Pending" },
//                           { value: "paid", label: "Paid" },
//                         ]}
//                         onChange={(e) => field.onChange(e)}
//                         onBlur={field.onBlur}
//                         error={error?.message}
//                       />
//                     )}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="flex md:flex-row flex-col gap-4 items-start justify-between h-full">
//           <div className={`${isInvoice ? "w-[50%]" : "w-[40%]"}`}>
//             <div className="w-full">
//               <TextareaField
//                 className=" min-h-22"
//                 id="notes"
//                 label="Customer Notes"
//                 placeholder="Enter notes"
//                 value={watch("notes")}
//                 onChange={(e) => setValue("notes", e.target.value)}
//               />
//             </div>
//           </div>
//           <div className={`${isInvoice ? "w-[50%]" : "w-[40%]"}`}>
//             <TextareaField
//               id="terms"
//               label="Terms & Conditions"
//               className=" min-h-20 resize-none"
//               placeholder="Enter terms"
//               rows={4}
//               readonly
//               value={watch("terms")}
//               onChange={(e) => setValue("terms", e.target.value)}
//             />
//           </div>
//           {!isInvoice && (
//             <div className="w-[20%] h-full ">
//               <Controller
//                 name="attach_file"
//                 control={control}
//                 render={({ field }) => (
//                   <FileUploader
//                     name="Attach File"
//                     label="Attach File(s) to Quote"
//                     placeholder="Add Your Attach File"
//                     error={errors.media_files?.message}
//                     {...field}
//                   />
//                 )}
//               />
//             </div>
//           )}
//         </div>

//         <div className="flex md:flex-row flex-col justify-end gap-3 mt-8">
//           <Button
//             onClick={cancelFunction}
//             type="button"
//             className="px-6 py-2 bg-background border border-border text-foreground rounded font-medium text-sm hover:bg-background transition-colors"
//           >
//             Cancel
//           </Button>

//           <Button
//             onClick={handleSubmit((data) => onSubmit(data, "draft"))}
//             type="button"
//             disabled={isSubmitting}
//           >
//             {isEditMode ? "Update Draft" : "Save as Draft"}
//           </Button>

//           <Button
//             onClick={handleSubmit((data) =>
//               onSubmit(
//                 data,
//                 isInvoice
//                   ? "sent"
//                   : document?.client?.status === "confirmed"
//                     ? "confirmed"
//                     : "sent"
//               )
//             )}
//             type="button"
//             disabled={isSubmitting}
//           >
//             {isEditMode
//               ? isInvoice
//                 ? "Update & Resend"
//                 : "Update & Send"
//               : isInvoice
//                 ? "Send Invoice"
//                 : "Send Quote"}
//           </Button>
//         </div>
//       </div>
//     </form>
//   );
// }

/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import SelectField_Search from "@/Components/Form/SelectField_Search";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FileUploader from "@/components/Form/FileUploader";
import ServiceSelect from "@/Components/Invoice_Quotes/ServiceSelector";

import { terms } from "@/lib/Terms_Conditions.json";
import {
  useCreateDocument,
  useDocument,
  useNoInvoiceProject,
  useUpdateDocument,
} from "../hooks/useDocumentsQuery";
import { useClients } from "@/features/clients/hooks/useClientsQuery";
import { useServices } from "@/features/services/hooks/useServiceQuery";
import AddClientModel from "@/components/common/AddClientModel";
import TextareaField from "@/components/Form/TextareaField";

export function DocumentForm({ type, onSuccess }) {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const { id } = useParams();

  const { state } = useLocation();
  const clientId = state?.clientId;
  const cloneFromId = state?.cloneFromId;
  const quoteId = state?.quoteId;

  const isEditMode = !!id;
  const isCloneMode = !!cloneFromId;
  const isConvertMode = !!quoteId && type === "invoices";

  const documentId = quoteId ?? id ?? cloneFromId;
  const documentType = quoteId ? "quotes" : type;

  const { data: document } = useDocument(documentId, documentType);

  console.log(document);

  const isInvoice = type === "invoices";
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: services = [], isLoading: servicesLoading } = useServices();

  const createMutation = useCreateDocument(type);
  const updateMutation = useUpdateDocument(type);

  const mutation = isEditMode ? updateMutation : createMutation;

  const projects = document?.client?.has_projects
    ? JSON.parse(document.has_projects)
    : [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerName: clientId || "",
      ...(isInvoice
        ? {
            invoice_date: new Date().toISOString().split("T")[0],
            due_date: new Date().toISOString().split("T")[0],
          }
        : {
            quoteDate: new Date().toISOString().split("T")[0],
          }),
      notes: "",
      payment_percentage: "50",
      payment_status: "pending",
      payment_type: "",
      description: "",
      terms,
      old_projects: [],
      has_projects: { title: [] },
      items: [
        {
          serviceId: null,
          description: "",
          quantity: 1,
          rate: 0,
          tax: 0,
          discount: 0,
          amount: 0,
        },
      ],
    },
  });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: "items",
  });

  const {
    fields: has_projectFields,
    append: appendHas_project,
    remove: removeHas_project,
  } = useFieldArray({
    control,
    name: "has_projects.title",
  });

  const items = watch("items");

  useEffect(() => {
    if (document && (isEditMode || isCloneMode || isConvertMode)) {
      const doc = document;
      console.log(doc);
      let projectTitles = [];
      if (projects && projects.title && Array.isArray(projects.title)) {
        projectTitles = projects.title.filter((t) => t !== "");
      } else if (Array.isArray(projects) && projects.length > 0) {
        projectTitles = projects
          .map((p) => p.title || "")
          .filter((t) => t !== "");
      }

      // For convert mode, we're creating an invoice from a quote
      if (isConvertMode) {
        reset({
          customerName: doc.client?.id || doc.client_id || clientId,
          invoice_date: new Date().toISOString().split("T")[0],
          due_date: new Date().toISOString().split("T")[0],
          notes: doc.notes || "",
          terms: doc.terms || terms,
          payment_percentage: "50",
          payment_status: "pending",
          payment_type: doc.payment_type || "",
          description: doc?.description,
          has_projects: {
            title: projectTitles,
          },
          old_projects: doc?.old_projects,
          items:
            doc.quote_services?.map((s) => {
              const serviceDetails = services.find(
                (srv) => Number(srv.id) === Number(s.service_id)
              );

              return {
                serviceId: Number(s.service_id),
                description: serviceDetails?.description || "",
                quantity: s.quantity,
                rate: parseFloat(s.individual_total) / s.quantity || 0,
                tax: Number(serviceDetails?.tax_rate) || 0,
                discount: 0,
                amount: parseFloat(s.individual_total),
              };
            }) || [],
        });
      } else {
        // Original logic for edit and clone modes
        reset({
          customerName: doc.client?.id || doc.client_id || clientId,
          ...(isInvoice
            ? {
                invoice_date: doc.invoice_date,
                due_date: doc.due_date,
              }
            : {
                quoteDate: doc.quotation_date,
              }),
          notes: doc.notes || "",
          terms: doc.terms || terms,
          payment_percentage: "50",
          payment_status: "pending",
          payment_type: doc.payment_type,
          description: doc?.description,
          has_projects: {
            title: projectTitles,
          },
          old_projects: doc?.old_projects,
          items:
            (isInvoice ? doc.invoice_services : doc.quote_services)?.map(
              (s) => {
                const serviceDetails = services.find(
                  (srv) => Number(srv.id) === Number(s.service_id)
                );

                return {
                  serviceId: Number(s.service_id),
                  description: serviceDetails?.description || "",
                  quantity: s.quantity,
                  rate: parseFloat(s.individual_total) / s.quantity || 0,
                  tax: Number(serviceDetails?.tax_rate) || 0,
                  discount: 0,
                  amount: parseFloat(s.individual_total),
                };
              }
            ) || [],
        });
      }
    }
  }, [
    document,
    isEditMode,
    isCloneMode,
    isConvertMode,
    isInvoice,
    reset,
    services,
  ]);

  const clientOptions = clients?.map((c) => ({
    label: c.client?.user?.name || c.name || "Unknown Client",
    value: String(c.client?.id),
  }));

  const { data: AllProjects } = useNoInvoiceProject();
  console.log(AllProjects);

  // const AllProjects = [
  //   { id: 1, name: "Landing Page Redesign" },
  //   { id: 2, name: "E-commerce Dashboard" },
  //   { id: 3, name: "Mobile App API" },
  //   { id: 4, name: "Portfolio Website" },
  //   { id: 5, name: "Admin Panel Revamp" },//   { id: 6, name: "SaaS Auth System" },
  //   { id: 7, name: "Marketing Website" },
  //   { id: 8, name: "CRM Integration" },
  //   { id: 9, name: "Internal Tools" },
  //   { id: 10, name: "Blog Platform" },
  // ];

  const ProjectOptions = AllProjects?.map((p) => ({
    label: p.name || "Unknown Project",
    value: String(p.id),
  }));

  const selectedClientId = watch("customerName");

  const selectedClient = clients?.find(
    (c) => c.client?.id === Number(selectedClientId)
  );

  useEffect(() => {
    if (selectedClient) {
      const isMoroccan =
        selectedClient?.client?.country?.trim().toLowerCase() === "maroc";
      const defaultPaymentMethod = isMoroccan ? "bank" : "stripe";
      setValue("payment_type", defaultPaymentMethod);
    }
  }, [selectedClient, setValue]);

  useEffect(() => {
    const currentProjects = watch("has_projects");
    if (!currentProjects?.title || currentProjects.title.length === 0) {
      setValue("has_projects", { title: [] });
    }
  }, []);

  const addNewRow = () => {
    appendItem({
      service: "",
      serviceId: null,
      description: "",
      quantity: 1,
      rate: 0,
      tax: 0,
      discount: 0,
      amount: 0,
    });
  };

  const deleteRow = (index) => {
    if (itemFields.length > 1) {
      removeItem(index);
    }
  };

  const cancelFunction = () => {
    reset();
    navigate(`/${role}/${isInvoice ? "invoices" : "quotes"}`);
  };

  const updateItem = (index, field, value) => {
    setValue(`items.${index}.${field}`, Number(value));
    const quantity = Number(watch(`items.${index}.quantity`) || 1);
    const rate = Number(watch(`items.${index}.rate`) || 0);
    const tax = Number(watch(`items.${index}.tax_rate`) || 0);
    const discount = Number(watch(`items.${index}.discount`) || 0);
    const base = quantity * rate;
    const taxAmount = base * (tax / 100);
    const totalAfterTax = base + taxAmount;
    const discountAmount = totalAfterTax * (discount / 100);
    const finalAmount = totalAfterTax - discountAmount;

    setValue(`items.${index}.amount`, Number(finalAmount.toFixed(2)));
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // const onSubmit = async (data, status) => {
  //   if (isSubmitting || !startSubmit()) return;

  //   const payload = {
  //     client_id: Number(data.customerName),
  //     ...(isInvoice
  //       ? {
  //           invoice_date: data.invoice_date,
  //           due_date: data.due_date,
  //           status: status || "unpaid",
  //           balance_due: Number(calculateTotal().toFixed(2)),
  //           // Add quote reference if converting
  //           ...(isConvertMode && { quote_id: quoteId }),
  //         }
  //       : {
  //           quotation_date: data.quoteDate,
  //           status: status || "draft",
  //           description: data.description,
  //         }),

  //     total_amount: Number(calculateTotal().toFixed(2)),
  //     notes: data.notes || "",
  //     terms: data.terms || terms,
  //     has_projects: JSON.stringify({
  //       title: data.has_projects?.title || [],
  //     }),
  //     old_projects: data.old_projects,
  //     payment_percentage: Number(data.payment_percentage),
  //     payment_status: data.payment_status,
  //     payment_type: data.payment_type,

  //     services: data.items.map((item) => ({
  //       service_id: Number(item.serviceId),
  //       quantity: Number(item.quantity),
  //       rate: Number(item.rate),
  //       tax: Number(item.tax),
  //       discount: Number(item.discount || 0),
  //       individual_total: Number(item.amount),
  //     })),
  //   };

  //   console.log("the payload:", payload);

  //   mutation.mutate(isEditMode ? { id: id, data: payload } : payload, {
  //     onSuccess: () => {
  //       onSuccess?.();
  //       if (!isEditMode) reset();
  //     },
  //     onSettled: () => endSubmit(),
  //   });
  // };

  const onSubmit = async (data, status) => {
    if (isSubmitting || !startSubmit()) return;

    const payload = {
      client_id: Number(data.customerName),

      ...(isInvoice
        ? {
            invoice_date: data.invoice_date,
            due_date: data.due_date,
            status: status || "unpaid",
            balance_due: Number(calculateTotal().toFixed(2)),
            ...(isConvertMode && { quote_id: quoteId }),
          }
        : {
            quotation_date: data.quoteDate,
            status: status || "draft",
            description: data.description,
          }),

      total_amount: Number(calculateTotal().toFixed(2)),
      notes: data.notes || "",
      terms: data.terms || terms,

      has_projects: JSON.stringify({
        title: data.has_projects?.title || [],
      }),

      payment_percentage: Number(data.payment_percentage),
      payment_status: data.payment_status,
      payment_type: data.payment_type,

      services: data.items.map((item) => ({
        service_id: Number(item.serviceId),
        quantity: Number(item.quantity),
        rate: Number(item.rate),
        tax: Number(item.tax),
        discount: Number(item.discount || 0),
        individual_total: Number(item.amount),
      })),
    };

    if (isInvoice || (!isInvoice && !isEditMode)) {
      payload.old_projects = data.old_projects;
    }

    console.log("the payload:", payload);

    mutation.mutate(isEditMode ? { id, data: payload } : payload, {
      onSuccess: () => {
        onSuccess?.();
        if (!isEditMode) reset();
      },
      onSettled: () => endSubmit(),
    });
  };

  if (clientsLoading || servicesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-full">
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div className="w-full">
            <Controller
              name="customerName"
              control={control}
              rules={{ required: "Please select a customer" }}
              render={({ field, fieldState: { error } }) => (
                <SelectField
                  label="Customer"
                  options={clientOptions}
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val)}
                  onBlur={field.onBlur}
                  error={error?.message}
                  placeholder="Select or add a customer"
                />
              )}
            />
          </div>
          <AddClientModel />
        </div>

        {selectedClient && (
          <div className="flex gap-4 p-4 border rounded bg-background text-sm space-y-4 max-w-[700px]">
            <div className="flex flex-col gap-2 w-[50%]">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {selectedClient?.client?.user?.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {selectedClient?.client?.user?.email}
              </p>
              <p>
                <span className="font-medium">Client Type:</span>{" "}
                {selectedClient?.client?.client_type}
              </p>
              {selectedClient?.client?.company && (
                <p>
                  <span className="font-medium">Company:</span>{" "}
                  {selectedClient?.client?.company}
                </p>
              )}
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {selectedClient?.client?.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {selectedClient?.client?.address}
              </p>
              <p>
                <span className="font-medium">City:</span>{" "}
                {selectedClient?.client?.city}
              </p>
            </div>

            {/* Second Row */}
            <div className="flex flex-col gap-4  w-[50%]">
              <p>
                <span className="font-medium">Country:</span>{" "}
                {selectedClient?.client?.country}
              </p>
              <p>
                <span className="font-medium">Currency:</span>{" "}
                {selectedClient?.client?.currency || "MAD"}
              </p>
              {selectedClient?.client?.ice && (
                <p>
                  <span className="font-medium">ICE:</span>{" "}
                  {selectedClient?.client?.ice}
                </p>
              )}
              {selectedClient?.client?.siren && (
                <p>
                  <span className="font-medium">SIREN:</span>{" "}
                  {selectedClient?.client?.siren}
                </p>
              )}
              <p>
                <span className="font-medium">VAT:</span>{" "}
                {selectedClient?.client?.vat || "20%"}
              </p>
            </div>
          </div>
        )}

        {isInvoice ? (
          <>
            <Controller
              name="invoice_date"
              control={control}
              rules={{ required: "Invoice date is required" }}
              render={({ field, fieldState: { error } }) => (
                <FormField
                  id="invoice_date"
                  label="Invoice Date*"
                  type="date"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  error={error?.message}
                />
              )}
            />

            <Controller
              name="due_date"
              control={control}
              rules={{ required: "Due date is required" }}
              render={({ field, fieldState: { error } }) => (
                <FormField
                  id="due_date"
                  label="Due Date*"
                  type="date"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  error={error?.message}
                />
              )}
            />
          </>
        ) : (
          <>
            <Controller
              name="quoteDate"
              control={control}
              rules={{ required: "Quote date is required" }}
              render={({ field, fieldState: { error } }) => (
                <FormField
                  id="quoteDate"
                  label="Quote Date*"
                  type="date"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  error={error?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormField
                  id="description"
                  label="Object"
                  type="text"
                  value={field.value || ""}
                  placeholder="Type An Object"
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  error={error?.message}
                />
              )}
            />
          </>
        )}

        <div className="mt-4">
          <span className="text-sm font-medium  text-foreground mb-4">
            Item Table
          </span>
          <div className="overflow-x-auto border rounded-md rounded-br-none">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="bg-background">
                  <th className="p-2 text-left text-sm font-semibold text-foreground">
                    ITEM DETAILS
                  </th>
                  <th className="p-2 text-right text-sm font-semibold text-foreground w-30">
                    QUANTITY
                  </th>
                  <th className="p-2 text-right text-sm font-semibold text-foreground w-30">
                    RATE
                  </th>
                  <th className="p-2 text-right text-sm font-semibold text-foreground w-30">
                    TAX
                  </th>
                  <th className="p-2 text-right text-sm font-semibold text-foreground w-30">
                    DISCOUNT
                  </th>
                  <th className="p-2 text-right text-sm font-semibold text-foreground w-30">
                    AMOUNT
                  </th>
                  <th className="p-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {itemFields.map((field, index) => {
                  const selectedService = watch(`items.${index}.serviceId`);
                  return (
                    <tr
                      key={field.id}
                      className="border-b border-border hover:bg-background"
                    >
                      <td className="p-2">
                        <Controller
                          name={`items.${index}.serviceId`}
                          control={control}
                          rules={{
                            required: "Service is required",
                            validate: (value) =>
                              !!value || "Service is required",
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <ServiceSelect
                              services={services}
                              value={field.value || ""}
                              onChange={(val) => {
                                const serviceId = Number(val);
                                field.onChange(serviceId);

                                const service = services.find(
                                  (s) => Number(s.id) === serviceId
                                );
                                if (!service) return;

                                const unitPrice = Number(service.base_price);
                                setValue(`items.${index}.rate`, unitPrice);
                                setValue(
                                  `items.${index}.description`,
                                  service.description
                                );
                                setValue(`items.${index}.service`, serviceId);

                                const quantity = Number(
                                  watch(`items.${index}.quantity`) || 1
                                );

                                const tax_rate = Number(service.tax_rate);
                                setValue(`items.${index}.tax_rate`, tax_rate);

                                const discount = Number(
                                  watch(`items.${index}.discount`) || 0
                                );

                                const base = quantity * unitPrice;
                                const taxAmount = base * (tax_rate / 100);
                                const totalAfterTax = base + taxAmount;
                                const discountAmount =
                                  totalAfterTax * (discount / 100);
                                const finalAmount =
                                  totalAfterTax - discountAmount;

                                setValue(
                                  `items.${index}.amount`,
                                  Number(finalAmount.toFixed(2))
                                );
                              }}
                              error={error?.message}
                              placeholder="Select a service"
                            />
                          )}
                        />
                        {selectedService && (
                          <Textarea
                            {...register(`items.${index}.description`)}
                            placeholder="Enter service description"
                            className="mt-2 w-full border border-border p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                            rows={2}
                            value={watch(`items.${index}.description`) || ""}
                            onChange={(e) =>
                              setValue(
                                `items.${index}.description`,
                                e.target.value
                              )
                            }
                          />
                        )}
                      </td>

                      <td className="p-2">
                        <FormField
                          type="number"
                          value={watch(`items.${index}.quantity`) ?? ""}
                          {...register(`items.${index}.quantity`, {
                            required: "Quantity is required",
                            min: {
                              value: 1,
                              message: "Quantity must be at least 1",
                            },
                            valueAsNumber: true,
                          })}
                          error={errors.items?.[index]?.quantity?.message}
                          onChange={(e) => {
                            updateItem(index, "quantity", e.target.value);
                            trigger(`items.${index}.quantity`);
                          }}
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          type="number"
                          value={watch(`items.${index}.rate`) ?? ""}
                          {...register(`items.${index}.rate`, {
                            required: "Rate is required",
                            min: {
                              value: 0,
                              message: "Rate cannot be negative",
                            },
                            valueAsNumber: true,
                          })}
                          error={errors.items?.[index]?.rate?.message}
                          onChange={(e) => {
                            updateItem(index, "rate", e.target.value);
                            trigger(`items.${index}.rate`);
                          }}
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          type="number"
                          value={
                            watch(`items.${index}.tax_rate`) ??
                            watch(`items.${index}.tax`)
                          }
                          {...register(`items.${index}.tax_rate`, {
                            // required: "Tax is required",
                            min: {
                              value: 0,
                              message: "Tax cannot be negative",
                            },
                            max: {
                              value: 100,
                              message: "Tax cannot exceed 100%",
                            },
                            valueAsNumber: true,
                          })}
                          error={errors.items?.[index]?.tax_rate?.message}
                          onChange={(e) => {
                            updateItem(index, "tax_rate", e.target.value);
                            trigger(`items.${index}.tax_rate`);
                          }}
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          type="number"
                          value={watch(`items.${index}.discount`) ?? ""}
                          {...register(`items.${index}.discount`, {
                            required: "discount is required",
                            min: {
                              value: 0,
                              message: "discount cannot be negative",
                            },
                            max: {
                              value: 100,
                              message: "discount cannot exceed 100%",
                            },
                            valueAsNumber: true,
                          })}
                          error={errors.items?.[index]?.discount?.message}
                          onChange={(e) => {
                            updateItem(index, "discount", e.target.value);
                            trigger(`items.${index}.discount`);
                          }}
                        />
                      </td>
                      <td className="p-2 text-right font-medium text-foreground">
                        {(watch(`items.${index}.amount`) || 0).toFixed(2)}
                      </td>

                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => deleteRow(index)}
                          className="text-muted-foreground hover:text-red-600 transition-colors p-1"
                          disabled={itemFields.length === 1}
                        >
                          <X size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Button
              type="button"
              onClick={addNewRow}
              className="flex items-center gap-2 text-white cursor-pointer text-sm font-medium mt-3"
            >
              <Plus size={18} /> Add New Row
            </Button>

            <div className="border-border md:w-[50%] w-full px-2 rounded-bl-lg rounded-br-lg border-b border-x">
              <div className="flex justify-between py-3 text-lg font-semibold">
                <span className="text-foreground">Total ( $ )</span>
                <span className="text-foreground">
                  {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full items-start space-between">
          {(type === "invoices" || (type === "quotes" && !isEditMode)) && (
            <div
              className={`flex gap-4 items-end justify-between ${
                !isInvoice ? "w-full" : "w-[50%]"
              }`}
            >
              <div className="w-full">
                <Controller
                  name="old_projects"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectField_Search
                      label="Project"
                      options={ProjectOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      customValue={watch("has_projects.title") || []}
                      onCustomChange={(newCustom) =>
                        setValue("has_projects.title", newCustom)
                      }
                      error={error?.message}
                      placeholder="Select or add a project"
                    />
                  )}
                />
              </div>
            </div>
          )}
          {isInvoice && (
            <div className="w-[50%]">
              <Label htmlFor="payment" className="mb-1">
                Payment
              </Label>
              <div className="flex md:flex-row flex-col gap-4 items-end justify-between border border-border p-4 rounded-lg">
                <div className="w-full flex gap-4 items-center justify-between">
                  <Controller
                    name="payment_type"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <SelectField
                        id="payment_type"
                        label="Payment Type"
                        type="select"
                        value={field.value || ""}
                        options={[
                          { value: "bank", label: "Bank" },
                          { value: "cash", label: "Cash" },
                          { value: "espace", label: "Espace" },
                          { value: "stripe", label: "Stripe" },
                        ]}
                        onChange={(e) => field.onChange(e)}
                        onBlur={field.onBlur}
                        error={error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="payment_percentage"
                    control={control}
                    rules={{ required: "Amount is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <FormField
                        id="payment_percentage"
                        label="Percentage Paid"
                        min="1"
                        max="100"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                        error={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="payment_status"
                    control={control}
                    rules={{ required: "Status is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <SelectField
                        id="payment_status"
                        label="Payment Status"
                        type="select"
                        value={field.value || ""}
                        options={[
                          { value: "pending", label: "Pending" },
                          { value: "paid", label: "Paid" },
                        ]}
                        onChange={(e) => field.onChange(e)}
                        onBlur={field.onBlur}
                        error={error?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex md:flex-row flex-col gap-4 items-start justify-between h-full">
          <div className={`${isInvoice ? "w-[50%]" : "w-[40%]"}`}>
            <div className="w-full">
              <TextareaField
                className=" min-h-22"
                id="notes"
                label="Customer Notes"
                placeholder="Enter notes"
                value={watch("notes")}
                onChange={(e) => setValue("notes", e.target.value)}
              />
            </div>
          </div>
          <div className={`${isInvoice ? "w-[50%]" : "w-[40%]"}`}>
            <TextareaField
              id="terms"
              label="Terms & Conditions"
              className=" min-h-20 resize-none"
              placeholder="Enter terms"
              rows={4}
              readonly
              value={watch("terms")}
              onChange={(e) => setValue("terms", e.target.value)}
            />
          </div>
          {!isInvoice && (
            <div className="w-[20%] h-full ">
              <Controller
                name="attach_file"
                control={control}
                render={({ field }) => (
                  <FileUploader
                    name="Attach File"
                    label="Attach File(s) to Quote"
                    placeholder="Add Your Attach File"
                    error={errors.media_files?.message}
                    {...field}
                  />
                )}
              />
            </div>
          )}
        </div>

        <div className="flex md:flex-row flex-col justify-end gap-3 mt-8">
          <Button
            onClick={cancelFunction}
            type="button"
            className="px-6 py-2 bg-background border border-border text-foreground rounded font-medium text-sm hover:bg-background transition-colors"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit((data) => onSubmit(data, "draft"))}
            type="button"
            disabled={isSubmitting}
          >
            {isEditMode ? "Update Draft" : "Save as Draft"}
          </Button>

          <Button
            onClick={handleSubmit((data) =>
              onSubmit(
                data,
                isInvoice
                  ? "sent"
                  : document?.client?.status === "confirmed"
                    ? "confirmed"
                    : "sent"
              )
            )}
            type="button"
            disabled={isSubmitting}
          >
            {isEditMode
              ? isInvoice
                ? "Update & Resend"
                : "Update & Send"
              : isInvoice
                ? "Send Invoice"
                : "Send Quote"}
          </Button>
        </div>
      </div>
    </form>
  );
}
