/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
// import {
//   AlertCircle,
//   File,
//   Upload,
//   X,
//   Image,
//   Video,
//   FileText,
// } from "lucide-react";
// import { useFileUpload } from "@/hooks/use-file-upload";
// import { Button } from "@/components/ui/button";
// import { useRegisterStore } from "@/hooks/registerStore";
// import { useEffect } from "react";
// import InputError from "../InputError";
// import { Label } from "../ui/label";

// export default function Component({ error, onChange, type, name, label }) {
//   const maxSizeMB = 10; // Increased to 10MB for videos
//   const maxSize = maxSizeMB * 1024 * 1024;
//   const registerStore = useRegisterStore();

//   const [
//     { files, isDragging, errors },
//     {
//       handleDragEnter,
//       handleDragLeave,
//       handleDragOver,
//       handleDrop,
//       openFileDialog,
//       removeFile,
//       getInputProps,
//     },
//   ] = useFileUpload({
//     accept: "*", // Accept all file types
//     maxSize,
//     multiple: true, // Enable multiple files
//   });

//   useEffect(() => {
//     if (files.length > 0) {
//       const fileArray = files.map((f) => f.file);
//       registerStore.setField("cv", fileArray);
//       onChange?.(fileArray);
//     } else {
//       registerStore.setField("cv", null);
//       onChange?.(null);
//     }
//   }, [files]);

//   // Helper function to get file icon based on type
//   const getFileIcon = (fileName) => {
//     const ext = fileName.split(".").pop()?.toLowerCase();

//     if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
//       return <Image className="size-5 text-blue-500" />;
//     }
//     if (["mp4", "avi", "mov", "wmv", "flv", "mkv"].includes(ext)) {
//       return <Video className="size-5 text-purple-500" />;
//     }
//     if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext)) {
//       return <FileText className="size-5 text-red-500" />;
//     }
//     return <File className="size-5 text-muted-foreground" />;
//   };

//   // Helper function to format file size
//   const formatFileSize = (bytes) => {
//     if (bytes < 1024) return bytes + " B";
//     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
//     return (bytes / (1024 * 1024)).toFixed(1) + " MB";
//   };

//   return (
//     <div className="flex flex-col gap-2 ">
//       <Label>{label}</Label>
//       <div className="relative ">
//         <div
//           onDragEnter={handleDragEnter}
//           onDragLeave={handleDragLeave}
//           onDragOver={handleDragOver}
//           onDrop={handleDrop}
//           data-dragging={isDragging || undefined}
//           className={`relative  bg-background flex min-h-[120px] flex-col items-center justify-center overflow-hidden rounded-xl border ${
//             error ? "border-destructive" : "border-border"
//           } p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50`}
//         >
//           <input
//             {...getInputProps()}
//             className="sr-only"
//             aria-label="Upload files"
//             multiple
//           />

//           {files.length > 0 ? (
//             <div className="w-full space-y-2">
//               {files.map((fileObj) => (
//                 <div
//                   key={fileObj.id}
//                   className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-accent/50"
//                 >
//                   <div className="flex items-center gap-3 flex-1 min-w-0">
//                     {getFileIcon(fileObj.file.name)}
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium truncate">
//                         {fileObj.file.name}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {formatFileSize(fileObj.file.size)}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     type="button"
//                     className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
//                     onClick={() => removeFile(fileObj.id)}
//                     aria-label={`Remove ${fileObj.file.name}`}
//                   >
//                     <X className="size-4" aria-hidden="true" />
//                   </button>
//                 </div>
//               ))}

//               <Button
//                 variant="outline"
//                 className="w-full mt-2"
//                 type="button"
//                 onClick={openFileDialog}
//               >
//                 <Upload
//                   className="-ms-1 size-4 opacity-60"
//                   aria-hidden="true"
//                 />
//                 Add More Files
//               </Button>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center  text-center">
//               {name === "Attach File" ? (
//                 <>
//                   <Upload className="size-10 mb-3 text-muted-foreground" />
//                   <p className="mb-1.5 text-sm font-medium">
//                     Add Your {name} Here
//                   </p>
//                   <p className="text-xs text-muted-foreground mb-4">
//                     Drag & drop files or click to browse
//                   </p>
//                 </>
//               ) : null}

//               <Button variant="outline" type="button" onClick={openFileDialog}>
//                 <Upload
//                   className="-ms-1 size-4 opacity-60"
//                   aria-hidden="true"
//                 />
//                 Choose Files
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {errors.length > 0 && (
//         <div
//           className="flex items-center gap-1 text-xs text-destructive"
//           role="alert"
//         >
//           <AlertCircle className="size-3 shrink-0" />
//           <span>{errors[0]}</span>
//         </div>
//       )}

//       {error && (
//         <InputError message={error} className="mt-2 text-destructive" />
//       )}
//     </div>
//   );
// }
// **************************************

"use client";

import {
  AlertCircle,
  File,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useRegisterStore } from "@/hooks/registerStore";
import { useEffect } from "react";
import InputError from "../InputError";
import { Label } from "../ui/label";

export default function FileUploadField({
  error,
  onChange,
  name = "file",
  label,
  accept = "*", // you can pass e.g. "image/*,.pdf,.docx"
  maxSizeMB = 10,
  multiple = true,
}) {
  const maxSize = maxSizeMB * 1024 * 1024;
  const registerStore = useRegisterStore();

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept,
    maxSize,
    multiple,
  });

  // useEffect(() => {
  //   if (files.length > 0) {
  //     const fileArray = files.map((f) => f.file);
  //     registerStore.setField("cv", fileArray); // ← keeping your field name
  //     onChange?.(fileArray);
  //   } else {
  //     registerStore.setField("cv", null);
  //     onChange?.(null);
  //   }
  // }, [files]);

  useEffect(() => {
    if (files.length > 0) {
      const fileArray = files.map((f) => {
        return {
          name: f.file.name,
          size: f.file.size,
          type: f.file.type,
          file: f.file,
        };
      });
      registerStore.setField("cv", fileArray);
      onChange?.(fileArray);
    } else {
      registerStore.setField("cv", null);
      onChange?.(null);
    }
  }, [files]);

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? "")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    }
    if (["mp4", "avi", "mov", "wmv", "flv", "mkv"].includes(ext ?? "")) {
      return <Video className="h-5 w-5 text-purple-500" />;
    }
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext ?? "")) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-muted-foreground" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "group relative rounded-lg border-2 border-dashed",
          error ? "border-destructive" : "border-border",
          isDragging ? "border-primary bg-primary/5" : "bg-background/50",
          "transition-colors hover:bg-accent/30 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "min-h-[140px] flex flex-col items-center justify-center p-6 text-center",
        )}
      >
        <input {...getInputProps()} className="sr-only" multiple={multiple} />

        {files.length > 0 ? (
          <div className="w-full space-y-3">
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {files.map((fileObj) => (
                <div
                  key={fileObj.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-md border bg-card px-3 py-2.5 text-sm shadow-sm",
                    "hover:bg-accent/60 transition-colors",
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(fileObj.file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {fileObj.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(fileObj.file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeFile(fileObj.id)}
                    aria-label={`Remove ${fileObj.file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={openFileDialog}
            >
              <Upload className="h-4 w-4" />
              Add more files
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-full bg-muted/50 p-3 mb-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">
              Drag & drop {multiple ? "files" : "a file"} here
            </p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              or click to browse (max {maxSizeMB} MB per file)
            </p>
            <Button variant="secondary" size="sm" onClick={openFileDialog}>
              Choose {multiple ? "Files" : "File"}
            </Button>
          </>
        )}
      </div>
      {/* Upload validation errors (from hook) */}
      {errors.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* Form-level error (e.g. from zod / react-hook-form) */}
      {error && <InputError message={error} className="text-sm" />}
    </div>
  );
}
