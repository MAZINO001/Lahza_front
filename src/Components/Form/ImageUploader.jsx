import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import InputError from "../InputError";

export default function ImageUploader({ error, onChange, value }) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

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
    accept: "image/*",
    maxSize,
  });

  const previewUrl = files[0]?.preview || value || null;
  const fileName = files[0]?.file.name || null;

  useEffect(() => {
    if (files.length > 0) {
      onChange?.(files[0].file);
    } else {
      onChange?.(null);
    }
  }, [files, onChange]);

  return (
    <div className="flex flex-col gap-2 ">
      <div className="relative">
        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className={`relative flex h-45 flex-col items-center justify-center overflow-hidden rounded-xl border ${error ? "border-destructive" : "border-border"} p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50 bg-background`}
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload service image"
          />
          {previewUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              {typeof previewUrl === "string" &&
              previewUrl.startsWith("blob:") ? (
                <img
                  src={previewUrl}
                  alt="Service preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {fileName || "Image uploaded"}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
                aria-hidden="true"
              >
                <ImageIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">
                Drop service image here
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF or WEBP (max. {maxSizeMB}MB)
              </p>
              <Button
                variant="outline"
                className="mt-4"
                type="button"
                onClick={openFileDialog}
              >
                <UploadIcon
                  className="-ms-1 size-4 opacity-60"
                  aria-hidden="true"
                />
                Select Image
              </Button>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              onClick={() => {
                removeFile(files[0]?.id);
                onChange?.(null);
              }}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-xs text-destructive"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
      {error && (
        <InputError message={error} className="mt-2 text-destructive" />
      )}
    </div>
  );
}
