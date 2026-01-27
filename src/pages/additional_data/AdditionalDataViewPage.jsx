import { saveAs } from "file-saver";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Download,
  Copy,
  Loader2,
  DownloadIcon,
} from "lucide-react";
import { useAdditionalData } from "@/features/additional_data/hooks/useAdditionalDataQuery";
import { useAuthContext } from "@/hooks/AuthContext";
import { toast } from "sonner";
import { useMultipleFileSearch } from "@/features/additional_data/hooks/multipeSearchHook";
import api from "@/lib/utils/axios";
import FilePreview from "@/components/common/filePreviewer";

export default function AdditionalDataViewPage() {
  const { role } = useAuthContext();
  const navigate = useNavigate();

  const currentPath = window.location.pathname;
  const pathMatch = currentPath.match(/\/project\/(\d+)/);
  const projectId = pathMatch ? pathMatch[1] : null;

  const {
    data: additionalData,
    isLoading,
    error,
  } = useAdditionalData(projectId);

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

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error loading additional data</div>;
  if (!additionalData) {
    navigate(`/${role}/project/${projectId}/additional-data/new`);
    return null;
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, {
      duration: 3000,
    });
  };

  const backendOrigin = (() => {
    const base = import.meta.env.VITE_BACKEND_URL;
    const fallback = "http://localhost:8000";
    if (!base) return fallback;
    try {
      const url = new URL(base);
      const origin = `${url.protocol}//${url.host}`;
      return origin || fallback;
    } catch {
      const cleaned = String(base)
        .replace(/\/api\/?$/, "")
        .replace(/\/$/, "");
      if (/^https?:\/\//i.test(cleaned)) return cleaned;
      return fallback;
    }
  })();

  const normalizeExistingFiles = (result, folder) => {
    if (!result) return [];

    const list = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.files)
          ? result.files
          : result
            ? [result]
            : [];

    return list
      .map((item, index) => {
        const url =
          (typeof item === "string" ? item : null) ??
          item?.url ??
          item?.path ??
          item?.file_url ??
          item?.full_url ??
          item?.download_url ??
          item?.link ??
          "";

        const name =
          item?.name ??
          item?.original_name ??
          item?.filename ??
          item?.file_name ??
          (url ? String(url).split("/").pop() : "") ??
          `file-${index}`;

        let resolvedUrl = url;

        if (backendOrigin && folder) {
          resolvedUrl = `${backendOrigin}/storage/additionalData/${folder}/${name}`;
        }

        if (resolvedUrl && !/^https?:\/\//i.test(resolvedUrl)) {
          if (resolvedUrl.startsWith("/")) {
            resolvedUrl = `${backendOrigin}${resolvedUrl}`;
          } else if (backendOrigin) {
            resolvedUrl = `${backendOrigin}/${resolvedUrl}`;
          }
        }

        if (resolvedUrl) {
          resolvedUrl = String(resolvedUrl).replace(
            /\/storage\/public\//,
            "/storage/",
          );
        }

        if (
          resolvedUrl &&
          backendOrigin &&
          folder &&
          !resolvedUrl.includes("/storage/")
        ) {
          resolvedUrl = `${backendOrigin}/storage/additionalData/${folder}/${name}`;
        }

        if (!resolvedUrl && backendOrigin && folder && name) {
          resolvedUrl = `${backendOrigin}/storage/additionalData/${folder}/${name}`;
        }

        const id =
          item?.id ??
          item?.uuid ??
          item?.file_id ??
          `${name || "file"}-${index}`;

        return {
          id: String(id),
          url: resolvedUrl,
          name,
        };
      })
      .filter((f) => f.url);
  };

  const downloadFile = async (fileUrl, filename) => {
    if (!fileUrl) {
      toast.error("No file URL provided");
      return;
    }

    const safeFilename = filename || fileUrl.split("/").pop() || "download";

    try {
      const urlObj = new URL(fileUrl);
      let path = urlObj.pathname.replace(/^\/storage/, "/storage");
      const response = await api.get(path, {
        responseType: "blob",
      });

      saveAs(response.data, safeFilename);
      toast.success("file downloaded");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed");
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

    const files = normalizeExistingFiles(value, folder);

    if (files.length === 0) {
      return <span className="text-sm text-muted-foreground">None</span>;
    }

    return (
      <div className="space-y-2">
        {files.map((file) => (
          <FilePreview
            file={{
              id: `${file.id}`,
              name: `${file.name}`,
              url: `${file.url}`,
              // add real size when oussama add it in BE 
              size: "1000"
            }}
            onDownload={(url, name) => downloadFile(url, name)}
          />
        ))}
      </div>
    );
  };

  const AccountField = ({ label, value, onCopy }) => (
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2 p-2 rounded-md border border-border bg-slate-50 dark:bg-slate-950">
        <span className="text-sm truncate">{value || "N/A"}</span>
        {value && (
          <button
            onClick={onCopy}
            className="ml-auto p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded shrink-0 transition-colors"
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to={-1}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <Button
          onClick={() =>
            navigate(`/${role}/project/${projectId}/additional-data/edit`)
          }
          size="sm"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      <div className="flex gap-4 w-full h-full">
        <div className="w-[70%] h-full">
          {/* Account Information Card */}
          <Card className="border-border mb-4">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Host Accounts */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-foreground">
                  Host Accounts
                </h3>
                {(() => {
                  try {
                    const hostAcc = JSON.parse(additionalData.host_acc || "{}");
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <AccountField
                          label="Email"
                          value={hostAcc.email}
                          onCopy={() =>
                            copyToClipboard(hostAcc.email, "host email")
                          }
                        />
                        <AccountField
                          label="Password"
                          value={hostAcc.password ? "••••••••••••••••" : ""}
                          onCopy={() =>
                            copyToClipboard(hostAcc.password, "host password")
                          }
                        />
                      </div>
                    );
                  } catch {
                    return (
                      <div className="text-sm text-muted-foreground p-2 rounded border border-border">
                        Not provided
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Website Accounts */}
              <div className="pt-3 border-t border-border">
                <h3 className="text-sm font-semibold mb-3 text-foreground">
                  Website Accounts
                </h3>
                {(() => {
                  try {
                    const websiteAcc = JSON.parse(
                      additionalData.website_acc || "{}",
                    );
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <AccountField
                          label="Email"
                          value={websiteAcc.email}
                          onCopy={() =>
                            copyToClipboard(websiteAcc.email, "website email")
                          }
                        />
                        <AccountField
                          label="Password"
                          value={websiteAcc.password ? "••••••••••••••••" : ""}
                          onCopy={() =>
                            copyToClipboard(
                              websiteAcc.password,
                              "website password",
                            )
                          }
                        />
                      </div>
                    );
                  } catch {
                    return (
                      <div className="text-sm text-muted-foreground p-2 rounded border border-border">
                        Not provided
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Social Media */}
              <div className="pt-3 border-t border-border">
                <h3 className="text-sm font-semibold mb-3 text-foreground">
                  Social Media
                </h3>
                {(() => {
                  try {
                    const socialMedia = JSON.parse(
                      additionalData.social_media || "[]",
                    );
                    if (
                      !Array.isArray(socialMedia) ||
                      socialMedia.length === 0
                    ) {
                      return (
                        <div className="text-sm text-muted-foreground p-2 rounded border border-border">
                          Not provided
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-4">
                        {socialMedia.map((acc, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4 last:pb-0 border-b border-border last:border-0"
                          >
                            <AccountField
                              label="Link"
                              value={acc.link}
                              onCopy={() =>
                                copyToClipboard(acc.link, "social media link")
                              }
                            />
                            <AccountField
                              label="Email"
                              value={acc.email}
                              onCopy={() =>
                                copyToClipboard(acc.email, "social media email")
                              }
                            />
                            <AccountField
                              label="Password"
                              value={acc.password ? "••••••••••••••••" : ""}
                              onCopy={() =>
                                copyToClipboard(
                                  acc.password,
                                  "social media password",
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    );
                  } catch {
                    return (
                      <div className="text-sm text-muted-foreground p-2 rounded border border-border">
                        Not provided
                      </div>
                    );
                  }
                })()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-[30%] h-full">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg">Files & Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-between">
                    <span>Media Files</span>
                    <Button
                      className="cursor-pointer"
                      onClick={() => {
                        const files = normalizeExistingFiles(
                          mediaFiles,
                          "media_files",
                        );
                        files.forEach((f) => downloadFile(f.url, f.name));
                      }}
                    >
                      <DownloadIcon />
                    </Button>
                  </div>
                  {renderFileField("Media Files", mediaFiles, "media_files")}
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-between">
                    <span>Specification File</span>
                    <Button
                      className="cursor-pointer"
                      onClick={() => {
                        const files = normalizeExistingFiles(
                          specificFiles,
                          "specification_file",
                        );
                        files.forEach((f) => downloadFile(f.url, f.name));
                      }}
                    >
                      <DownloadIcon />
                    </Button>
                  </div>
                  {renderFileField(
                    "Specification File",
                    specificFiles,
                    "specification_file",
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-between">
                    <span>Logo</span>
                    <Button
                      className="cursor-pointer"
                      onClick={() => {
                        const files = normalizeExistingFiles(logoFiles, "logo");
                        files.forEach((f) => downloadFile(f.url, f.name));
                      }}
                    >
                      <DownloadIcon />
                    </Button>
                  </div>
                  {renderFileField("Logo", logoFiles, "logo")}
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-between">
                    <span>Other Files</span>
                    <Button
                      className="cursor-pointer"
                      onClick={() => {
                        const files = normalizeExistingFiles(
                          otherFiles,
                          "other",
                        );
                        files.forEach((f) => downloadFile(f.url, f.name));
                      }}
                    >
                      <DownloadIcon />
                    </Button>
                  </div>
                  {renderFileField("Other", otherFiles, "other")}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
