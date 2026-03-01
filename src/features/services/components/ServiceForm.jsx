// import React, { useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { useSubmitProtection } from "@/hooks/spamBlocker";
// import FormField from "@/components/Form/FormField";
// import SelectField from "@/components/Form/SelectField";
// import RichTextEditor from "@/components/Form/RichTextEditor";
// import ImageUploader from "@/components/Form/ImageUploader";
// import { useTranslation } from "react-i18next";
// import {
//   useService,
//   useCreateService,
//   useUpdateService,
// } from "@/features/services/hooks/useServicesData";

// export function ServiceForm({ serviceId, onSuccess }) {
//   const { data: service, isLoading: serviceLoading } = useService(serviceId);
//   const navigate = useNavigate();
//   const { role } = useAuthContext();
//   const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
//   const createMutation = useCreateService();
//   const updateMutation = useUpdateService();

//   const isEditMode = !!service?.id;
//   const mutation = isEditMode ? updateMutation : createMutation;
//   const { t } = useTranslation();

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors },
//     watch,
//   } = useForm({
//     defaultValues: service || {
//       name: "",
//       description: "",
//       base_price: "",
//       tax_rate: "0",
//       time: "1",
//       category: "",
//       status: "active",
//       image: null,
//     },
//   });

//   // Update form when service data loads
//   useEffect(() => {
//     if (service?.id) {
//       reset({
//         name: service.name || "",
//         description: service.description || "",
//         base_price: service.base_price || "",
//         tax_rate: String(service.tax_rate) || "0",
//         time: String(service.time) || "1",
//         category: service.category || "",
//         status: service.status || "active",
//         image: service.image || null,
//       });
//     }
//   }, [service, reset]);

//   const onSubmit = async (data) => {
//     if (isSubmitting || !startSubmit()) return;

//     try {
//       if (isEditMode) {
//         // UPDATE: Send as JSON or FormData with image
//         const updateData = {
//           name: data.name,
//           description: data.description,
//           base_price: Number(data.base_price).toFixed(2),
//           tax_rate: Number(data.tax_rate),
//           time: data.time,
//           category: data.category,
//           status: data.status,
//         };

//         if (data.image instanceof File) {
//           // New image uploaded - use FormData
//           const formData = new FormData();
//           Object.entries(updateData).forEach(([key, value]) => {
//             formData.append(key, value);
//           });
//           formData.append("image", data.image);

//           updateMutation.mutate(
//             { id: service.id, data: formData },
//             {
//               onSuccess: () => {
//                 onSuccess?.();
//               },
//               onSettled: () => endSubmit(),
//             },
//           );
//         } else if (data.image === null && service?.image) {
//           // User removed image
//           updateData.remove_image = true;
//           updateMutation.mutate(
//             { id: service.id, data: updateData },
//             {
//               onSuccess: () => {
//                 onSuccess?.();
//               },
//               onSettled: () => endSubmit(),
//             },
//           );
//         } else {
//           // No image change - send JSON
//           updateMutation.mutate(
//             { id: service.id, data: updateData },
//             {
//               onSuccess: () => {
//                 onSuccess?.();
//               },
//               onSettled: () => endSubmit(),
//             },
//           );
//         }
//       } else {
//         // CREATE: Use FormData
//         const formData = new FormData();

//         Object.keys(data).forEach((key) => {
//           if (key !== "image") {
//             if (key === "base_price") {
//               formData.append(key, Number(data[key]).toFixed(2));
//             } else if (key === "tax_rate") {
//               formData.append(key, Number(data[key]));
//             } else if (
//               data[key] !== undefined &&
//               data[key] !== null &&
//               data[key] !== ""
//             ) {
//               formData.append(key, data[key]);
//             }
//           }
//         });

//         if (data.image instanceof File) {
//           formData.append("image", data.image);
//         }

//         createMutation.mutate(formData, {
//           onSuccess: () => {
//             onSuccess?.();
//             reset();
//           },
//           onSettled: () => endSubmit(),
//         });
//       }
//     } catch (error) {
//       console.error("Form submission error:", error);
//       endSubmit();
//     }
//   };

//   const isLoading = mutation.isPending || serviceLoading;

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-4 p-4 sm:p-6 h-screen"
//     >
//       {serviceLoading && serviceId ? (
//         <div className="flex items-center justify-center h-full">
//           <p className="text-gray-500">
//             {t("services.form.loading_service")}
//           </p>
//         </div>
//       ) : (
//         <>
//           <Controller
//             name="name"
//             control={control}
//             rules={{ required: t("services.form.validation.name_required") }}
//             render={({ field }) => (
//               <FormField
//                 label={t("services.form.name_label")}
//                 placeholder={t("services.form.name_placeholder")}
//                 error={errors.name?.message}
//                 {...field}
//               />
//             )}
//           />

//           <div className="w-full flex gap-4">
//             <div className="w-[75%]">
//               <Controller
//                 name="description"
//                 control={control}
//                 rules={{
//                   required: t("services.form.validation.description_required"),
//                 }}
//                 render={({ field }) => (
//                   <RichTextEditor
//                     label={t("services.form.description_label")}
//                     placeholder={t("services.form.description_placeholder")}
//                     error={errors.description?.message}
//                     {...field}
//                   />
//                 )}
//               />
//             </div>
//             <div className="w-[25%]">
//               <Controller
//                 name="image"
//                 control={control}
//                 render={({ field }) => (
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                       {t("services.form.image_label")}
//                     </label>
//                     <ImageUploader
//                       value={service?.image}
//                       onChange={field.onChange}
//                       error={errors.image?.message}
//                     />
//                   </div>
//                 )}
//               />
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 w-full">
//             <div className="w-full">
//               <Controller
//                 name="base_price"
//                 control={control}
//                 rules={{
//                   required: t("services.form.validation.price_required"),
//                 }}
//                 render={({ field }) => (
//                   <FormField
//                     label={t("services.form.base_price_label")}
//                     type="number"
//                     step="0.01"
//                     error={errors.base_price?.message}
//                     {...field}
//                   />
//                 )}
//               />
//             </div>
//             <div className="w-full">
//           <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => navigate(`/${role}/services`)}
//             >
//               {t("services.form.cancel_button")}
//             </Button>

//             <Button type="submit" disabled={isLoading}>
//               {isLoading
//                 ? t("services.form.processing")
//                 : service?.id
//                   ? t("services.form.update_service")
//                   : t("services.form.create_service")}
//             </Button>
//           </div>
//         </>
//       )}
//     </form>
//   );
// }


import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/components/Form/FormField";
import SelectField from "@/components/Form/SelectField";
import RichTextEditor from "@/components/Form/RichTextEditor";
import ImageUploader from "@/components/Form/ImageUploader";
import { useTranslation } from "react-i18next";
import {
  useService,
  useCreateService,
  useUpdateService,
} from "@/features/services/hooks/useServicesData";

export function ServiceForm({ serviceId, onSuccess }) {
  const { data: service, isLoading: serviceLoading } = useService(serviceId);
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();

  const isEditMode = !!service?.id;
  const mutation = isEditMode ? updateMutation : createMutation;
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: service || {
      name: "",
      description: "",
      base_price: "",
      tax_rate: "0",
      time: "1",
      category: "",
      status: "active",
      image: null,
    },
  });

  // Update form when service data loads
  useEffect(() => {
    if (service?.id) {
      reset({
        name: service.name || "",
        description: service.description || "",
        base_price: service.base_price || "",
        tax_rate: String(service.tax_rate) || "0",
        time: String(service.time) || "1",
        category: service.category || "",
        status: service.status || "active",
        image: service.image || null,
      });
    }
  }, [service, reset]);

  const onSubmit = async (data) => {
    if (isSubmitting || !startSubmit()) return;

    try {
      if (isEditMode) {
        // UPDATE: Send as JSON or FormData with image
        const updateData = {
          name: data.name,
          description: data.description,
          base_price: Number(data.base_price).toFixed(2),
          tax_rate: Number(data.tax_rate),
          time: data.time,
          category: data.category,
          status: data.status,
        };

        if (data.image instanceof File) {
          // New image uploaded - use FormData
          const formData = new FormData();
          Object.entries(updateData).forEach(([key, value]) => {
            formData.append(key, value);
          });
          formData.append("image", data.image);

          updateMutation.mutate(
            { id: service.id, data: formData },
            {
              onSuccess: () => {
                onSuccess?.();
              },
              onSettled: () => endSubmit(),
            },
          );
        } else if (data.image === null && service?.image) {
          // User removed image
          updateData.remove_image = true;
          updateMutation.mutate(
            { id: service.id, data: updateData },
            {
              onSuccess: () => {
                onSuccess?.();
              },
              onSettled: () => endSubmit(),
            },
          );
        } else {
          // No image change - send JSON
          updateMutation.mutate(
            { id: service.id, data: updateData },
            {
              onSuccess: () => {
                onSuccess?.();
              },
              onSettled: () => endSubmit(),
            },
          );
        }
      } else {
        // CREATE: Use FormData
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
          if (key !== "image") {
            if (key === "base_price") {
              formData.append(key, Number(data[key]).toFixed(2));
            } else if (key === "tax_rate") {
              formData.append(key, Number(data[key]));
            } else if (
              data[key] !== undefined &&
              data[key] !== null &&
              data[key] !== ""
            ) {
              formData.append(key, data[key]);
            }
          }
        });

        if (data.image instanceof File) {
          formData.append("image", data.image);
        }

        createMutation.mutate(formData, {
          onSuccess: () => {
            onSuccess?.();
            reset();
          },
          onSettled: () => endSubmit(),
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      endSubmit();
    }
  };

  const isLoading = mutation.isPending || serviceLoading;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 sm:p-6 h-screen"
    >
      {serviceLoading && serviceId ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">
            {t("services.form.loading_service")}
          </p>
        </div>
      ) : (
        <>
          <Controller
            name="name"
            control={control}
            rules={{ required: t("services.form.validation.name_required") }}
            render={({ field }) => (
              <FormField
                label={t("services.form.name_label")}
                placeholder={t("services.form.name_placeholder")}
                error={errors.name?.message}
                {...field}
              />
            )}
          />

          <div className="w-full flex gap-4">
            <div className="w-[75%]">
              <Controller
                name="description"
                control={control}
                rules={{
                  required: t("services.form.validation.description_required"),
                }}
                render={({ field }) => (
                  <RichTextEditor
                    label={t("services.form.description_label")}
                    placeholder={t("services.form.description_placeholder")}
                    error={errors.description?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-[25%]">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t("services.form.image_label")}
                    </label>
                    <ImageUploader
                      value={service?.image}
                      onChange={field.onChange}
                      error={errors.image?.message}
                    />
                  </div>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="w-full">
              <Controller
                name="base_price"
                control={control}
                rules={{
                  required: t("services.form.validation.price_required"),
                }}
                render={({ field }) => (
                  <FormField
                    label={t("services.form.base_price_label")}
                    type="number"
                    step="0.01"
                    error={errors.base_price?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${role}/services`)}
            >
              {t("services.form.cancel_button")}
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? t("services.form.processing")
                : service?.id
                  ? t("services.form.update_service")
                  : t("services.form.create_service")}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}