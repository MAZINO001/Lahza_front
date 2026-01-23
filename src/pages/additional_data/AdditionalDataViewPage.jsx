import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Download, Copy, Loader2 } from "lucide-react";
import { useAdditionalData } from "@/features/additional_data/hooks/useAdditionalDataQuery";
import { useDownloadFile } from "@/features/additional_data/hooks/useAdditionalDataQuery";
import { useAuthContext } from "@/hooks/AuthContext";
import { toast } from "sonner";

export default function AdditionalDataViewPage() {
  const { role } = useAuthContext();
  const navigate = useNavigate();
  const downloadFile = useDownloadFile();

  const currentPath = window.location.pathname;
  const pathMatch = currentPath.match(/\/project\/(\d+)/);
  const projectId = pathMatch ? pathMatch[1] : null;

  const {
    data: additionalData,
    isLoading,
    error,
  } = useAdditionalData(projectId);

  console.log(additionalData);

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

  const handleDownload = (type, fileable_type, fileable_id) => {
    downloadFile.mutate({
      type,
      fileable_type,
      fileable_id,
    });
  };

  const renderFileField = (label, value) => {
    if (!value)
      return <span className="text-sm text-muted-foreground">None</span>;

    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          Available
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          disabled={downloadFile.isPending}
          onClick={() => handleDownload(value, label)}
        >
          {downloadFile.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
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
      <div className="flex gap-4 w-full">
        <div className="w-[70%]">
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
        <div className="w-[30%]">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg">Files & Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Media Files
                  </p>
                  {renderFileField("Media Files", additionalData.media_files)}
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Specification File
                  </p>
                  {renderFileField(
                    "Specification File",
                    additionalData.specification_file,
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Logo
                  </p>
                  {renderFileField("Logo", additionalData.logo)}
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Other Files
                  </p>
                  {renderFileField("Other", additionalData.other)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
