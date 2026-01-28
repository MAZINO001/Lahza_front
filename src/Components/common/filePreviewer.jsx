"use client";

import { useState } from "react";
import { FileIcon, DownloadIcon, FileText } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

export default function FilePreview({ file, onDownload, backendOrigin }) {
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return "image";
    } else if (extension === "pdf") {
      return "pdf";
    }
    return "other";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 10) / 10 + " " + sizes[i];
  };

  const getFileExtension = (fileName) => {
    return fileName.split(".").pop().toUpperCase();
  };

  const getImageDimensions = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: null, height: null });
      };
      img.src = src;
    });
  };

  const handleOpenChange = async (open) => {
    if (open && !previewData) {
      setIsLoading(true);
      const fileType = getFileType(file.name);

      if (fileType === "image") {
        const dimensions = await getImageDimensions(filePreviewUrl);
        setPreviewData({
          type: "image",
          dimensions,
        });
      } else if (fileType === "pdf") {
        setPreviewData({
          type: "pdf",
        });
      }

      setIsLoading(false);
    }
  };

  const fileType = getFileType(file.name);
  const extension = getFileExtension(file.name);
  const fileSize = file.size ? formatFileSize(file.size) : "Unknown";

  const filePreviewUrl = `${backendOrigin}/storage/${file.url}`;
  return (
    <HoverCard onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 bg-accent p-1 rounded-lg cursor-pointer hover:bg-accent/80 transition-colors">
          <div>
            {fileType === "pdf" ? (
              <FileText className="w-5 h-5 text-red-500" />
            ) : (
              <FileIcon className="w-5 h-5" />
            )}
          </div>
          <span className="text-xs text-muted-foreground truncate flex-1">
            {file.name}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(filePreviewUrl, file.name);
            }}
          >
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="w-80 p-0 bg-background border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-6 h-48">
            <div className="animate-spin rounded-full h-8 w-8 border border-muted border-t-primary" />
          </div>
        ) : fileType === "image" ? (
          <div className="space-y-3 p-4">
            {/* Image Preview */}
            <div className="aspect-video overflow-hidden rounded-md bg-muted border border-border/50">
              <img
                alt={file.name}
                className="h-full w-full object-cover"
                src={filePreviewUrl}
              />
            </div>

            {/* File Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                {file.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {previewData?.dimensions?.width &&
                previewData?.dimensions?.height
                  ? `${previewData.dimensions.width} × ${previewData.dimensions.height} · ${fileSize} · ${extension}`
                  : `${fileSize} · ${extension}`}
              </p>
            </div>
          </div>
        ) : fileType === "pdf" ? (
          <div className="space-y-3 p-4">
            {/* PDF Preview */}
            <div className="aspect-video overflow-hidden rounded-md bg-linear-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border border-border/50 flex items-center justify-center">
              <FileText className="w-16 h-16 text-red-500 opacity-50" />
            </div>

            {/* PDF Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                {file.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {fileSize} · {extension}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {/* Generic File Preview */}
            <div className="aspect-video overflow-hidden rounded-md bg-muted border border-border/50 flex items-center justify-center">
              <FileIcon className="w-16 h-16 text-muted-foreground opacity-50" />
            </div>

            {/* File Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                {file.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {fileSize} · {extension}
              </p>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
