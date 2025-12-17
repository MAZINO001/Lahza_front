import { Link, Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Download, ExternalLink, Copy } from "lucide-react";
import { useAdditionalData } from "@/features/additional_data/hooks/useAdditionalDataQuery";
import { useAuthContext } from "@/hooks/AuthContext";
import { toast } from "sonner";

export default function AdditionalDataViewPage() {
  const { role } = useAuthContext();
  const navigate = useNavigate();

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, {
      description: text,
      duration: 3000,
    });
  };
  const currentPath = window.location.pathname;
  const pathMatch = currentPath.match(/\/project\/(\d+)/);
  const projectId = pathMatch ? pathMatch[1] : null;

  const {
    data: additionalData,
    isLoading,
    error,
  } = useAdditionalData(projectId);

  console.log(additionalData);
  console.log(error);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading additional data</div>;
  if (!additionalData) {
    navigate(`/${role}/project/${projectId}/additional-data/new`);
    return null;
  }

  const renderFileField = (label, value) => {
    if (!value) return <span className="text-muted-foreground">None</span>;

    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary">Available</Badge>
        {value.startsWith("http") ? (
          <Button size="sm" variant="outline" asChild>
            <a href={value} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link
            to={-1}
            className="flex items-center gap-2 text-md text-muted-foreground hover:text-foreground transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
        <Button
          onClick={() =>
            navigate(`/${role}/project/${projectId}/additional-data/edit`)
          }
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Host Accounts
                </label>
                <div className="mt-1 space-y-2">
                  {(() => {
                    try {
                      const hostAcc = JSON.parse(
                        additionalData.host_acc || "{}"
                      );
                      return (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                          <div className="p-2 bg-gray-40 rounded-md border flex-1 flex items-center justify-between min-w-0">
                            <div className="truncate">
                              <strong>Email:</strong> {hostAcc.email || "N/A"}
                            </div>
                            <Copy
                              className="w-4 h-4 cursor-pointer shrink-0 ml-2"
                              onClick={() =>
                                copyToClipboard(hostAcc.email, "host email")
                              }
                            />
                          </div>
                          <div className="p-2 bg-gray-40 rounded-md border flex-1 flex items-center justify-between min-w-0">
                            <div className="truncate">
                              <strong>Password:</strong>{" "}
                              {hostAcc.password || "N/A"}
                            </div>
                            <Copy
                              className="w-4 h-4 cursor-pointer shrink-0 ml-2"
                              onClick={() =>
                                copyToClipboard(
                                  hostAcc.password,
                                  "host password"
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    } catch {
                      return (
                        <div className="p-2 bg-gray-40 rounded-md border">
                          Not provided
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Website Accounts
                </label>
                <div className="mt-1 space-y-2">
                  {(() => {
                    try {
                      const websiteAcc = JSON.parse(
                        additionalData.website_acc || "{}"
                      );
                      return (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                          <div className="p-2 bg-gray-40 rounded-md border flex-1 flex items-center justify-between min-w-0">
                            <div className="truncate">
                              <strong>Email:</strong>{" "}
                              {websiteAcc.email || "N/A"}
                            </div>
                            <Copy
                              className="w-4 h-4 cursor-pointer shrink-0 ml-2"
                              onClick={() =>
                                copyToClipboard(
                                  websiteAcc.email,
                                  "website email"
                                )
                              }
                            />
                          </div>
                          <div className="p-2 bg-gray-40 rounded-md border flex-1 flex items-center justify-between min-w-0">
                            <div className="truncate">
                              <strong>Password:</strong>{" "}
                              {websiteAcc.password || "N/A"}
                            </div>
                            <Copy
                              className="w-4 h-4 cursor-pointer shrink-0 ml-2"
                              onClick={() =>
                                copyToClipboard(
                                  websiteAcc.password,
                                  "website password"
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    } catch {
                      return (
                        <div className="p-2 bg-gray-40 rounded-md border">
                          Not provided
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Social Media
                </label>
                <div className="mt-1 space-y-2">
                  {(() => {
                    try {
                      const socialMedia = JSON.parse(
                        additionalData.social_media || "[]"
                      );
                      if (
                        !Array.isArray(socialMedia) ||
                        socialMedia.length === 0
                      ) {
                        return (
                          <div className="p-2 bg-gray-40 rounded-md border">
                            Not provided
                          </div>
                        );
                      }
                      return socialMedia.map((acc, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col lg:flex-row items-start gap-4 w-full"
                        >
                          <div className="p-2 bg-gray-40 rounded-md border flex-1 flex items-center justify-between min-w-0">
                            <div className="truncate">
                              <strong>Link:</strong> {acc.link || "N/A"}
                            </div>
                            <Copy
                              className="w-4 h-4 cursor-pointer shrink-0 ml-2"
                              onClick={() =>
                                copyToClipboard(acc.link, "social media link")
                              }
                            />
                          </div>
                          <div className="p-2 bg-gray-40 rounded-md border flex-1 flex items-center justify-between min-w-0">
                            <div className="truncate">
                              <strong>Email:</strong> {acc.email || "N/A"}
                            </div>
                            <Copy
                              className="w-4 h-4 cursor-pointer shrink-0 ml-2"
                              onClick={() =>
                                copyToClipboard(acc.email, "social media email")
                              }
                            />
                          </div>
                          <div className="p-2 bg-gray-40 rounded-md border flex-1 flex items-center justify-between min-w-0">
                            <div className="truncate">
                              <strong>Password:</strong> {acc.password || "N/A"}
                            </div>
                            <Copy
                              className="w-4 h-4 cursor-pointer shrink-0 ml-2"
                              onClick={() =>
                                copyToClipboard(
                                  acc.password,
                                  "social media password"
                                )
                              }
                            />
                          </div>
                        </div>
                      ));
                    } catch {
                      return (
                        <div className="p-2 bg-gray-40 rounded-md border">
                          Not provided
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={"mt-4"}>
          <CardHeader>
            <CardTitle>Files & Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Media Files
                </label>
                <div className="mt-1">
                  {renderFileField("Media Files", additionalData.media_files)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Specification File
                </label>
                <div className="mt-1">
                  {renderFileField(
                    "Specification File",
                    additionalData.specification_file
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Logo
                </label>
                <div className="mt-1">
                  {renderFileField("Logo", additionalData.logo)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Other files
                </label>
                <div className="mt-1">
                  {renderFileField("Other", additionalData.other)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
