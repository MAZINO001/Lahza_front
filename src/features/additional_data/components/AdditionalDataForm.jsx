// import React, { useEffect, useState } from "react";
// import { useForm, Controller, useFieldArray } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { useSubmitProtection } from "@/hooks/spamBlocker";
// import FormField from "@/components/Form/FormField";
// import FileUploader from "@/components/Form/FileUploader";
// import { Loader2 } from "lucide-react";

// import {
//   useAdditionalData,
//   useCreateAdditionalData,
//   useUpdateAdditionalData,
// } from "@/features/additional_data/hooks/useAdditionalDataQuery";
// import { Minus, Plus } from "lucide-react";
// import { useMultipleFileSearch } from "../hooks/multipeSearchHook";
// import { normalizeExistingFiles } from "@/utils/normalizeFiles";

// export function AdditionalDataForm({ onSuccess, projectId }) {
//   const navigate = useNavigate();
//   const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
//   const { data: additionalData, isLoading } = useAdditionalData(projectId);
//   const [initialFilesLoading, setInitialFilesLoading] = useState(false);

//   const {
//     logoFiles,
//     mediaFiles,
//     otherFiles,
//     specificFiles,
//     isLoading: filesLoading,
//   } = useMultipleFileSearch(
//     "App\\Models\\ProjectAdditionalData",
//     additionalData?.id,
//   );

//   const createMutation = useCreateAdditionalData();
//   const updateMutation = useUpdateAdditionalData();
//   const mutation = additionalData?.id ? updateMutation : createMutation;
//   const isEditMode = !!additionalData?.id;

//   // State to hold initial files
//   const [initialLogoFiles, setInitialLogoFiles] = useState([]);
//   const [initialMediaFiles, setInitialMediaFiles] = useState([]);
//   const [initialOtherFiles, setInitialOtherFiles] = useState([]);
//   const [initialSpecificFiles, setInitialSpecificFiles] = useState([]);

//   // Load initial files when data is available
//   useEffect(() => {
//     const loadInitialFiles = async () => {
//       if (isEditMode && !filesLoading) {
//         setInitialFilesLoading(true);
//         try {
//           console.log("Loading initial files for edit mode:", {
//             logoFiles,
//             mediaFiles,
//             otherFiles,
//             specificFiles
//           });

//           const [logo, media, other, specific] = await Promise.all([
//             normalizeExistingFiles(logoFiles).catch(err => {
//               console.error("Error loading logo files:", err);
//               return [];
//             }),
//             normalizeExistingFiles(mediaFiles).catch(err => {
//               console.error("Error loading media files:", err);
//               return [];
//             }),
//             normalizeExistingFiles(otherFiles).catch(err => {
//               console.error("Error loading other files:", err);
//               return [];
//             }),
//             normalizeExistingFiles(specificFiles).catch(err => {
//               console.error("Error loading specific files:", err);
//               return [];
//             }),
//           ]);

//           console.log("Normalized files:", {
//             logo,
//             media,
//             other,
//             specific
//           });

//           setInitialLogoFiles(logo);
//           setInitialMediaFiles(media);
//           setInitialOtherFiles(other);
//           setInitialSpecificFiles(specific);
//         } catch (error) {
//           console.error("Error loading initial files:", error);
//         } finally {
//           setInitialFilesLoading(false);
//         }
//       }
//     };

//     loadInitialFiles();
//   }, [isEditMode, filesLoading, additionalData?.id, logoFiles, mediaFiles, otherFiles, specificFiles]);

//   const parseJSON = (str, fallback) => {
//     try {
//       return str ? JSON.parse(str) : fallback;
//     } catch {
//       return fallback;
//     }
//   };

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: additionalData
//       ? (() => {
//         const hostAcc = parseJSON(additionalData.host_acc, {});
//         const websiteAcc = parseJSON(additionalData.website_acc, {});
//         const socialMedia = parseJSON(additionalData.social_media, []);

//         return {
//           project_id: additionalData.project_id,
//           client_id: additionalData.client_id,
//           host_acc_email: hostAcc.email || "",
//           host_acc_password: hostAcc.password || "",
//           website_acc_email: websiteAcc.email || "",
//           website_acc_password: websiteAcc.password || "",
//           social_media:
//             socialMedia.length > 0
//               ? socialMedia
//               : [{ link: "", email: "", password: "" }],
//           media_files: additionalData.media_files || null,
//           specification_file: additionalData.specification_file || null,
//           logo: additionalData.logo || null,
//           other: additionalData.other || null,
//         };
//       })()
//       : {
//         project_id: projectId,
//         client_id: 2,
//         host_acc_email: "",
//         host_acc_password: "",
//         website_acc_email: "",
//         website_acc_password: "",
//         social_media: [{ link: "", email: "", password: "" }],
//         media_files: null,
//         specification_file: null,
//         logo: null,
//         other: null,
//       },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "social_media",
//   });

//   const onSubmit = (data) => {
//     if (isSubmitting || !startSubmit()) return;

//     const toArray = (value) => {
//       // Always return an array, even if value is undefined, null, or empty
//       if (!value || (Array.isArray(value) && value.length === 0)) return [];
//       return Array.isArray(value) ? value : [value];
//     };

//     const mediaFiles = toArray(data.media_files);
//     const specFiles = toArray(data.specification_file);
//     const logoFiles = toArray(data.logo);
//     const otherFiles = toArray(data.other);

//     const payload = {
//       project_id: Number(data.project_id),
//       host_acc: JSON.stringify({
//         email: data.host_acc_email,
//         password: data.host_acc_password,
//       }),
//       website_acc: JSON.stringify({
//         email: data.website_acc_email,
//         password: data.website_acc_password,
//       }),
//       social_media: JSON.stringify(
//         data.social_media.map((sm) => ({
//           link: sm.link,
//           email: sm.email,
//           password: sm.password,
//         }))
//       ),
//       // Always include all file fields explicitly, even when empty
//       media_files: mediaFiles,
//       specification_file: specFiles,
//       logo: logoFiles,
//       other: otherFiles,
//     };

//     // Ensure all file fields are present, even if data doesn't have them
//     if (!payload.hasOwnProperty('media_files')) payload.media_files = [];
//     if (!payload.hasOwnProperty('specification_file')) payload.specification_file = [];
//     if (!payload.hasOwnProperty('logo')) payload.logo = [];
//     if (!payload.hasOwnProperty('other')) payload.other = [];

//     console.log("Submitting payload:", payload);

//     if (isEditMode) {
//       updateMutation.mutate(
//         { id: additionalData.id, data: payload },
//         {
//           onSuccess: () => {
//             console.log("Update successful");
//             onSuccess?.();
//             endSubmit();
//           },
//           onError: (error) => {
//             console.error("Update error:", error);
//             endSubmit();
//           },
//         },
//       );
//     } else {
//       createMutation.mutate(payload, {
//         onSuccess: () => {
//           console.log("Create successful");
//           onSuccess?.();
//           reset();
//           endSubmit();
//         },
//         onError: (error) => {
//           console.error("Create error:", error);
//           endSubmit();
//         },
//       });
//     }
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     handleSubmit(onSubmit)(e);
//   };

//   return (
//     <form onSubmit={handleFormSubmit} className="space-y-4 p-4 min-h-screen">
//       <div className="flex w-full gap-4">
//         <div className="w-[50%]">
//           <Controller
//             name="host_acc_email"
//             control={control}
//             render={({ field }) => (
//               <FormField
//                 label="Host Account Email"
//                 placeholder="Enter host email..."
//                 error={errors.host_acc_email?.message}
//                 {...field}
//               />
//             )}
//           />
//         </div>
//         <div className="w-[50%]">
//           <Controller
//             name="host_acc_password"
//             control={control}
//             render={({ field }) => (
//               <FormField
//                 label="Host Account Password"
//                 type="password"
//                 placeholder="Enter host password..."
//                 error={errors.host_acc_password?.message}
//                 {...field}
//               />
//             )}
//           />
//         </div>
//       </div>

//       <div className="flex w-full gap-4">
//         <div className="w-[50%]">
//           <Controller
//             name="website_acc_email"
//             control={control}
//             render={({ field }) => (
//               <FormField
//                 label="Website Account Email"
//                 placeholder="Enter website email..."
//                 error={errors.website_acc_email?.message}
//                 {...field}
//               />
//             )}
//           />
//         </div>
//         <div className="w-[50%]">
//           <Controller
//             name="website_acc_password"
//             control={control}
//             render={({ field }) => (
//               <FormField
//                 label="Website Account Password"
//                 type="password"
//                 placeholder="Enter website password..."
//                 error={errors.website_acc_password?.message}
//                 {...field}
//               />
//             )}
//           />
//         </div>
//       </div>

//       <div className="flex flex-col gap-6">
//         {fields.map((item, index) => (
//           <div key={item.id} className="flex w-full gap-4 items-end">
//             <div className="w-1/3">
//               <Controller
//                 name={`social_media.${index}.link`}
//                 control={control}
//                 render={({ field }) => (
//                   <FormField
//                     label="Social Media Link"
//                     placeholder="Enter link..."
//                     className="w-full"
//                     {...field}
//                   />
//                 )}
//               />
//             </div>

//             <div className="w-1/3">
//               <Controller
//                 name={`social_media.${index}.email`}
//                 control={control}
//                 render={({ field }) => (
//                   <FormField
//                     label="Email"
//                     placeholder="Enter email..."
//                     className="w-full"
//                     {...field}
//                   />
//                 )}
//               />
//             </div>

//             <div className="w-1/3">
//               <Controller
//                 name={`social_media.${index}.password`}
//                 control={control}
//                 render={({ field }) => (
//                   <FormField
//                     label="Password"
//                     type="password"
//                     placeholder="Enter password..."
//                     className="w-full"
//                     {...field}
//                   />
//                 )}
//               />
//             </div>

//             <Button
//               type="button"
//               className="p-2"
//               onClick={() => fields.length > 1 && remove(index)}
//               disabled={fields.length === 1}
//             >
//               <Minus className="w-4 h-4" />
//             </Button>
//             <Button
//               type="button"
//               className="p-2"
//               onClick={() => append({ link: "", email: "", password: "" })}
//             >
//               <Plus className="w-4 h-4" />
//             </Button>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <Controller
//           name="media_files"
//           control={control}
//           render={({ field }) =>
//             filesLoading || initialFilesLoading ? (
//               <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/20">
//                 <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
//                 <span className="text-sm text-muted-foreground">
//                   {filesLoading ? "Loading media files..." : "Loading existing files..."}
//                 </span>
//               </div>
//             ) : (
//               (() => {
//                 console.log("Media Files FileUploader - initialFiles:", initialMediaFiles);
//                 return (
//                   <FileUploader
//                     key={`media_files-${initialMediaFiles.map((f) => f.id).join("-")}`}
//                     label="Media Files"
//                     name="Media Files"
//                     error={errors.media_files?.message}
//                     initialFiles={initialMediaFiles.map((f) => f.file)}
//                     {...field}
//                   />
//                 );
//               })()
//             )
//           }
//         />

//         <Controller
//           name="specification_file"
//           control={control}
//           render={({ field }) =>
//             filesLoading || initialFilesLoading ? (
//               <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/20">
//                 <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
//                 <span className="text-sm text-muted-foreground">
//                   {filesLoading ? "Loading specification files..." : "Loading existing files..."}
//                 </span>
//               </div>
//             ) : (
//               <FileUploader
//                 key={`specification_file-${initialSpecificFiles.map((f) => f.id).join("-")}`}
//                 label="Specification File"
//                 name="Specification File"
//                 error={errors.specification_file?.message}
//                 initialFiles={initialSpecificFiles.map((f) => f.file)}
//                 {...field}
//               />
//             )
//           }
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <Controller
//           name="logo"
//           control={control}
//           render={({ field }) =>
//             filesLoading || initialFilesLoading ? (
//               <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/20">
//                 <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
//                 <span className="text-sm text-muted-foreground">
//                   {filesLoading ? "Loading logo files..." : "Loading existing files..."}
//                 </span>
//               </div>
//             ) : (
//               <FileUploader
//                 key={`logo-${initialLogoFiles.map((f) => f.id).join("-")}`}
//                 label="Logo"
//                 name="Logo"
//                 error={errors.logo?.message}
//                 initialFiles={initialLogoFiles.map((f) => f.file)}
//                 {...field}
//               />
//             )
//           }
//         />

//         <Controller
//           name="other"
//           control={control}
//           render={({ field }) =>
//             filesLoading || initialFilesLoading ? (
//               <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/20">
//                 <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
//                 <span className="text-sm text-muted-foreground">
//                   {filesLoading ? "Loading other files..." : "Loading existing files..."}
//                 </span>
//               </div>
//             ) : (
//               <FileUploader
//                 key={`other-${initialOtherFiles.map((f) => f.id).join("-")}`}
//                 label="Other Files"
//                 name="Other Files"
//                 error={errors.other?.message}
//                 initialFiles={initialOtherFiles.map((f) => f.file)}
//                 {...field}
//               />
//             )
//           }
//         />
//       </div>

//       <div className="flex justify-end gap-3 pt-6">
//         <Button type="button" variant="outline" onClick={() => navigate(-1)}>
//           Cancel
//         </Button>
//         <Button type="submit" disabled={isSubmitting || mutation.isPending}>
//           {mutation.isPending
//             ? "Saving..."
//             : isEditMode
//               ? "Update Additional Data"
//               : "Create Additional Data"}
//         </Button>
//       </div>
//     </form>
//   );
// }

import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/components/Form/FormField";
import FileUploader from "@/components/Form/FileUploader";
import { Loader2 } from "lucide-react";

import {
  useAdditionalData,
  useCreateAdditionalData,
  useUpdateAdditionalData,
} from "@/features/additional_data/hooks/useAdditionalDataQuery";
import { Minus, Plus } from "lucide-react";
import { useMultipleFileSearch } from "../hooks/multipeSearchHook";
import { normalizeExistingFiles } from "@/utils/normalizeFiles";

export function AdditionalDataForm({ onSuccess, projectId }) {
  const navigate = useNavigate();
  const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
  const { data: additionalData, isLoading } = useAdditionalData(projectId);
  const [initialFilesLoading, setInitialFilesLoading] = useState(false);

  const {
    logoFiles,
    mediaFiles,
    otherFiles,
    specificFiles,
    isLoading: filesLoading,
  } = useMultipleFileSearch(
    "App\\Models\\ProjectAdditionalData",
    additionalData?.id,
  );

  const createMutation = useCreateAdditionalData();
  const updateMutation = useUpdateAdditionalData();
  const mutation = additionalData?.id ? updateMutation : createMutation;
  const isEditMode = !!additionalData?.id;

  // State to hold initial files
  const [initialLogoFiles, setInitialLogoFiles] = useState([]);
  const [initialMediaFiles, setInitialMediaFiles] = useState([]);
  const [initialOtherFiles, setInitialOtherFiles] = useState([]);
  const [initialSpecificFiles, setInitialSpecificFiles] = useState([]);

  // Load initial files when data is available
  useEffect(() => {
    const loadInitialFiles = async () => {
      if (isEditMode && !filesLoading) {
        setInitialFilesLoading(true);
        try {
          console.log("Loading initial files for edit mode:", {
            logoFiles,
            mediaFiles,
            otherFiles,
            specificFiles,
          });

          const [logo, media, other, specific] = await Promise.all([
            normalizeExistingFiles(logoFiles).catch((err) => {
              console.error("Error loading logo files:", err);
              return [];
            }),
            normalizeExistingFiles(mediaFiles).catch((err) => {
              console.error("Error loading media files:", err);
              return [];
            }),
            normalizeExistingFiles(otherFiles).catch((err) => {
              console.error("Error loading other files:", err);
              return [];
            }),
            normalizeExistingFiles(specificFiles).catch((err) => {
              console.error("Error loading specific files:", err);
              return [];
            }),
          ]);

          console.log("Normalized files:", {
            logo,
            media,
            other,
            specific,
          });

          setInitialLogoFiles(logo);
          setInitialMediaFiles(media);
          setInitialOtherFiles(other);
          setInitialSpecificFiles(specific);
        } catch (error) {
          console.error("Error loading initial files:", error);
        } finally {
          setInitialFilesLoading(false);
        }
      }
    };

    loadInitialFiles();
  }, [
    isEditMode,
    filesLoading,
    additionalData?.id,
    logoFiles,
    mediaFiles,
    otherFiles,
    specificFiles,
  ]);

  const parseJSON = (str, fallback) => {
    try {
      return str ? JSON.parse(str) : fallback;
    } catch {
      return fallback;
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: additionalData
      ? (() => {
          const hostAcc = parseJSON(additionalData.host_acc, {});
          const websiteAcc = parseJSON(additionalData.website_acc, {});
          const socialMedia = parseJSON(additionalData.social_media, []);

          return {
            project_id: additionalData.project_id,
            client_id: additionalData.client_id,
            host_acc_email: hostAcc.email || "",
            host_acc_password: hostAcc.password || "",
            website_acc_email: websiteAcc.email || "",
            website_acc_password: websiteAcc.password || "",
            social_media:
              socialMedia.length > 0
                ? socialMedia
                : [{ link: "", email: "", password: "" }],
            media_files: additionalData.media_files || null,
            specification_file: additionalData.specification_file || null,
            logo: additionalData.logo || null,
            other: additionalData.other || null,
          };
        })()
      : {
          project_id: projectId,
          client_id: 2,
          host_acc_email: "",
          host_acc_password: "",
          website_acc_email: "",
          website_acc_password: "",
          social_media: [{ link: "", email: "", password: "" }],
          media_files: null,
          specification_file: null,
          logo: null,
          other: null,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "social_media",
  });

  const onSubmit = (data) => {
    if (isSubmitting || !startSubmit()) return;

    // Helper function to clean file arrays
    const cleanFileArray = (value) => {
      // Convert to array and filter out null/undefined values
      let arr = Array.isArray(value) ? value : value ? [value] : [];

      // Filter out null, undefined, and non-File values
      return arr.filter((item) => {
        // Keep File instances only
        if (item instanceof File) {
          return true;
        }
        // Filter out everything else (null, undefined, objects without File data)
        return false;
      });
    };

    const mediaFiles = cleanFileArray(data.media_files);
    const specFiles = cleanFileArray(data.specification_file);
    const logoFiles = cleanFileArray(data.logo);
    const otherFiles = cleanFileArray(data.other);

    const payload = {
      project_id: Number(data.project_id),
      host_acc: JSON.stringify({
        email: data.host_acc_email,
        password: data.host_acc_password,
      }),
      website_acc: JSON.stringify({
        email: data.website_acc_email,
        password: data.website_acc_password,
      }),
      social_media: JSON.stringify(
        data.social_media.map((sm) => ({
          link: sm.link,
          email: sm.email,
          password: sm.password,
        })),
      ),
      // File fields now contain truly empty arrays when no files are present
      media_files: mediaFiles,
      specification_file: specFiles,
      logo: logoFiles,
      other: otherFiles,
    };

    console.log("Submitting payload:", payload);

    if (isEditMode) {
      updateMutation.mutate(
        { id: additionalData.id, data: payload },
        {
          onSuccess: () => {
            console.log("Update successful");
            onSuccess?.();
            endSubmit();
          },
          onError: (error) => {
            console.error("Update error:", error);
            endSubmit();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          console.log("Create successful");
          onSuccess?.();
          reset();
          endSubmit();
        },
        onError: (error) => {
          console.error("Create error:", error);
          endSubmit();
        },
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 p-4 min-h-screen">
      <div className="flex w-full gap-4">
        <div className="w-[50%]">
          <Controller
            name="host_acc_email"
            control={control}
            render={({ field }) => (
              <FormField
                label="Host Account Email"
                placeholder="Enter host email..."
                error={errors.host_acc_email?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className="w-[50%]">
          <Controller
            name="host_acc_password"
            control={control}
            render={({ field }) => (
              <FormField
                label="Host Account Password"
                type="password"
                placeholder="Enter host password..."
                error={errors.host_acc_password?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="w-[50%]">
          <Controller
            name="website_acc_email"
            control={control}
            render={({ field }) => (
              <FormField
                label="Website Account Email"
                placeholder="Enter website email..."
                error={errors.website_acc_email?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className="w-[50%]">
          <Controller
            name="website_acc_password"
            control={control}
            render={({ field }) => (
              <FormField
                label="Website Account Password"
                type="password"
                placeholder="Enter website password..."
                error={errors.website_acc_password?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {fields.map((item, index) => (
          <div key={item.id} className="flex w-full gap-4 items-end">
            <div className="w-1/3">
              <Controller
                name={`social_media.${index}.link`}
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Social Media Link"
                    placeholder="Enter link..."
                    className="w-full"
                    {...field}
                  />
                )}
              />
            </div>

            <div className="w-1/3">
              <Controller
                name={`social_media.${index}.email`}
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Email"
                    placeholder="Enter email..."
                    className="w-full"
                    {...field}
                  />
                )}
              />
            </div>

            <div className="w-1/3">
              <Controller
                name={`social_media.${index}.password`}
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Password"
                    type="password"
                    placeholder="Enter password..."
                    className="w-full"
                    {...field}
                  />
                )}
              />
            </div>

            <Button
              type="button"
              className="p-2"
              onClick={() => fields.length > 1 && remove(index)}
              disabled={fields.length === 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              className="p-2"
              onClick={() => append({ link: "", email: "", password: "" })}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="media_files"
          control={control}
          render={({ field }) =>
            filesLoading || initialFilesLoading ? (
              <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  {filesLoading
                    ? "Loading media files..."
                    : "Loading existing files..."}
                </span>
              </div>
            ) : (
              (() => {
                console.log(
                  "Media Files FileUploader - initialFiles:",
                  initialMediaFiles,
                );
                return (
                  <FileUploader
                    key={`media_files-${initialMediaFiles.map((f) => f.id).join("-")}`}
                    label="Media Files"
                    name="Media Files"
                    error={errors.media_files?.message}
                    initialFiles={initialMediaFiles.map((f) => f.file)}
                    {...field}
                  />
                );
              })()
            )
          }
        />

        <Controller
          name="specification_file"
          control={control}
          render={({ field }) =>
            filesLoading || initialFilesLoading ? (
              <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  {filesLoading
                    ? "Loading specification files..."
                    : "Loading existing files..."}
                </span>
              </div>
            ) : (
              <FileUploader
                key={`specification_file-${initialSpecificFiles.map((f) => f.id).join("-")}`}
                label="Specification File"
                name="Specification File"
                error={errors.specification_file?.message}
                initialFiles={initialSpecificFiles.map((f) => f.file)}
                {...field}
              />
            )
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="logo"
          control={control}
          render={({ field }) =>
            filesLoading || initialFilesLoading ? (
              <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  {filesLoading
                    ? "Loading logo files..."
                    : "Loading existing files..."}
                </span>
              </div>
            ) : (
              <FileUploader
                key={`logo-${initialLogoFiles.map((f) => f.id).join("-")}`}
                label="Logo"
                name="Logo"
                error={errors.logo?.message}
                initialFiles={initialLogoFiles.map((f) => f.file)}
                {...field}
              />
            )
          }
        />

        <Controller
          name="other"
          control={control}
          render={({ field }) =>
            filesLoading || initialFilesLoading ? (
              <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  {filesLoading
                    ? "Loading other files..."
                    : "Loading existing files..."}
                </span>
              </div>
            ) : (
              <FileUploader
                key={`other-${initialOtherFiles.map((f) => f.id).join("-")}`}
                label="Other Files"
                name="Other Files"
                error={errors.other?.message}
                initialFiles={initialOtherFiles.map((f) => f.file)}
                {...field}
              />
            )
          }
        />
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : isEditMode
              ? "Update Additional Data"
              : "Create Additional Data"}
        </Button>
      </div>
    </form>
  );
}
