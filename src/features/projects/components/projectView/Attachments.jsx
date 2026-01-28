import FilePreview from "@/components/common/filePreviewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DownloadIcon,
  FileText,
  Paperclip,
  Loader2,
  File,
  FileIcon,
} from "lucide-react";
import { normalizeExistingFilesSync } from "@/utils/normalizeFiles";

export default function Attachments({
  logoFiles,
  mediaFiles,
  otherFiles,
  specificFiles,
  backendOrigin,
  downloadFile,
  normalizeExistingFiles,
  filesLoading,
}) {
  const getAllFilesCount = () => {
    const logoFilesCount = normalizeExistingFilesSync(logoFiles, "logo").length;
    const mediaFilesCount = normalizeExistingFilesSync(
      mediaFiles,
      "media_files",
    ).length;
    const otherFilesCount = normalizeExistingFilesSync(
      otherFiles,
      "other",
    ).length;
    const specificFilesCount = normalizeExistingFilesSync(
      specificFiles,
      "specification_file",
    ).length;
    return (
      logoFilesCount + mediaFilesCount + otherFilesCount + specificFilesCount
    );
  };

  const downloadAllFiles = async (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await downloadFile(file.url, file.name);
      if (i < files.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  };

  const renderFileField = (label, value, folder) => {
    if (filesLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading files...
          </span>
        </div>
      );
    }

    const files = normalizeExistingFilesSync(value, folder);

    if (files.length === 0) {
      return (
        <span className="text-sm text-muted-foreground">
          No files available
        </span>
      );
    }

    return (
      <div className="space-y-2">
        {files.map((file) => (
          <FilePreview
            file={{
              id: `${file.id}`,
              name: `${file.name}`,
              url: `${file.path}`,
              // add real size when oussama add it in BE
              size: "10080",
            }}
            onDownload={(url, name) => downloadFile(url, name)}
            backendOrigin={backendOrigin}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Paperclip className="w-5 h-5 text-primary" />
          Files & Attachments
          <Badge variant="secondary" className="ml-2">
            {getAllFilesCount()}
          </Badge>
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">
                    Media Files
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {
                      normalizeExistingFilesSync(mediaFiles, "media_files")
                        .length
                    }{" "}
                    files
                  </p>
                </div>
              </div>
              {normalizeExistingFilesSync(mediaFiles, "media_files").length >
                0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3"
                  onClick={() => {
                    const files = normalizeExistingFilesSync(
                      mediaFiles,
                      "media_files",
                    );
                    downloadAllFiles(files);
                  }}
                >
                  <DownloadIcon className="w-3 h-3 mr-1" />
                  Download All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {renderFileField("Media Files", mediaFiles, "media_files")}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">
                    Specification Files
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {
                      normalizeExistingFilesSync(
                        specificFiles,
                        "specification_file",
                      ).length
                    }{" "}
                    files
                  </p>
                </div>
              </div>
              {normalizeExistingFilesSync(specificFiles, "specification_file")
                .length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3"
                  onClick={() => {
                    const files = normalizeExistingFilesSync(
                      specificFiles,
                      "specification_file",
                    );
                    downloadAllFiles(files);
                  }}
                >
                  <DownloadIcon className="w-3 h-3 mr-1" />
                  Download All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {renderFileField(
              "Specification File",
              specificFiles,
              "specification_file",
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">Logo</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {normalizeExistingFilesSync(logoFiles, "logo").length} files
                  </p>
                </div>
              </div>
              {normalizeExistingFilesSync(logoFiles, "logo").length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3"
                  onClick={() => {
                    const files = normalizeExistingFilesSync(logoFiles, "logo");
                    downloadAllFiles(files);
                  }}
                >
                  <DownloadIcon className="w-3 h-3 mr-1" />
                  Download
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {renderFileField("Logo", logoFiles, "logo")}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">
                    Other Files
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {normalizeExistingFilesSync(otherFiles, "other").length}{" "}
                    files
                  </p>
                </div>
              </div>
              {normalizeExistingFilesSync(otherFiles, "other").length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3"
                  onClick={() => {
                    const files = normalizeExistingFilesSync(
                      otherFiles,
                      "other",
                    );
                    downloadAllFiles(files);
                  }}
                >
                  <DownloadIcon className="w-3 h-3 mr-1" />
                  Download All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {renderFileField("Other", otherFiles, "other")}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
