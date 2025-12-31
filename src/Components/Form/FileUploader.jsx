// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";

// import { useFileUpload } from "@/hooks/use-file-upload";
// import { Button } from "@/components/ui/button";
// import { useRegisterStore } from "@/hooks/registerStore";
// import { useEffect } from "react";
// import InputError from "../InputError";
// import { Label } from "../ui/label";

// export default function Component({ error, onChange, type, name, label }) {
//   // Add onChange prop
//   const maxSizeMB = 2;
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
//     accept: ".pdf,.doc,.docx,.txt,.rtf",
//     maxSize,
//   });

//   const previewUrl = files[0]?.preview || null;
//   const fileName = files[0]?.file.name || null;

//   useEffect(() => {
//     if (files.length > 0) {
//       registerStore.setField("cv", files[0].file);
//       onChange?.(files[0].file);
//     } else {
//       registerStore.setField("cv", null);
//       onChange?.(null);
//     }
//   }, [files]);
//   return (
//     <div className="flex flex-col gap-2">
//       <Label>{label}</Label>
//       <div className="relative">
//         <div
//           onDragEnter={handleDragEnter}
//           onDragLeave={handleDragLeave}
//           onDragOver={handleDragOver}
//           onDrop={handleDrop}
//           data-dragging={isDragging || undefined}
//           className={`relative flex h-30 flex-col items-center justify-center overflow-hidden rounded-xl border ${error ? "border-destructive" : "border-border"} p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50`}
//         >
//           <input
//             {...getInputProps()}
//             className="sr-only"
//             aria-label="Upload CV file"
//           />
//           {previewUrl ? (
//             <div className="absolute inset-0 flex items-center justify-center p-4">
//               <p>{files[0]?.file?.name}</p>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
//               <p className="mb-1.5 text-sm font-medium">Add Your {name} Here</p>
//               <Button
//                 variant="outline"
//                 className="mt-4"
//                 type="button"
//                 onClick={openFileDialog}
//               >
//                 <UploadIcon
//                   className="-ms-1 size-4 opacity-60"
//                   aria-hidden="true"
//                 />
//                 Choose Your Files
//               </Button>
//             </div>
//           )}
//         </div>

//         {previewUrl && (
//           <div className="absolute top-4 right-4">
//             <button
//               type="button"
//               className="z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
//               onClick={() => removeFile(files[0]?.id)}
//               aria-label="Remove image"
//             >
//               <XIcon className="size-4" aria-hidden="true" />
//             </button>
//           </div>
//         )}
//       </div>
//       {errors.length > 0 && (
//         <div
//           className="flex items-center gap-1 text-xs text-destructive"
//           role="alert"
//         >
//           <AlertCircleIcon className="size-3 shrink-0" />
//           <span>{errors[0]}</span>
//         </div>
//       )}
//       {error && (
//         <InputError message={error} className="mt-2 text-destructive" />
//       )}
//     </div>
//   );
// }
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import {
  AlertCircle,
  File,
  Upload,
  X,
  Image,
  Video,
  FileText,
} from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useRegisterStore } from "@/hooks/registerStore";
import { useEffect } from "react";
import InputError from "../InputError";
import { Label } from "../ui/label";

export default function Component({ error, onChange, type, name, label }) {
  const maxSizeMB = 10; // Increased to 10MB for videos
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
    accept: "*", // Accept all file types
    maxSize,
    multiple: true, // Enable multiple files
  });

  useEffect(() => {
    if (files.length > 0) {
      const fileArray = files.map((f) => f.file);
      registerStore.setField("cv", fileArray);
      onChange?.(fileArray);
    } else {
      registerStore.setField("cv", null);
      onChange?.(null);
    }
  }, [files]);

  // Helper function to get file icon based on type
  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
      return <Image className="size-5 text-blue-500" />;
    }
    if (["mp4", "avi", "mov", "wmv", "flv", "mkv"].includes(ext)) {
      return <Video className="size-5 text-purple-500" />;
    }
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext)) {
      return <FileText className="size-5 text-red-500" />;
    }
    return <File className="size-5 text-muted-foreground" />;
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="relative">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className={`relative flex min-h-[120px] flex-col items-center justify-center overflow-hidden rounded-xl border ${
            error ? "border-destructive" : "border-border"
          } p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50`}
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload files"
            multiple
          />

          {files.length > 0 ? (
            <div className="w-full space-y-2">
              {files.map((fileObj) => (
                <div
                  key={fileObj.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(fileObj.file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {fileObj.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(fileObj.file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
                    onClick={() => removeFile(fileObj.id)}
                    aria-label={`Remove ${fileObj.file.name}`}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full mt-2"
                type="button"
                onClick={openFileDialog}
              >
                <Upload
                  className="-ms-1 size-4 opacity-60"
                  aria-hidden="true"
                />
                Add More Files
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center  text-center">
              {name === "Attach File" ? (
                <>
                  <Upload className="size-10 mb-3 text-muted-foreground" />
                  <p className="mb-1.5 text-sm font-medium">
                    Add Your {name} Here
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Drag & drop files or click to browse
                  </p>
                </>
              ) : null}

              <Button variant="outline" type="button" onClick={openFileDialog}>
                <Upload
                  className="-ms-1 size-4 opacity-60"
                  aria-hidden="true"
                />
                Choose Files
              </Button>
            </div>
          )}
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-xs text-destructive"
          role="alert"
        >
          <AlertCircle className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {error && (
        <InputError message={error} className="mt-2 text-destructive" />
      )}
    </div>
  );
}
