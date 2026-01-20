import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCertifications } from "../../hooks/useSettingsAgencyInfoQuery";
import { ExternalLink, Award, Calendar } from "lucide-react";

export function CertificationsView() {
  const { data: certifications, isLoading, error } = useCertifications();

  console.log(certifications);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-gray-500">Loading certifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-red-600">Error loading certifications</div>
      </div>
    );
  }

  if (!certifications || certifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No certifications available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex h-48">
                {cert.preview_image && (
                  <div className="w-1/2 bg-gray-100 overflow-hidden">
                    <img
                      src={
                        // cert.preview_image || "https://picsum.photos/600/400"
                        "https://picsum.photos/600/400"
                      }
                      alt={cert.title || "Certification"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Info Section - 50% */}
                <div className="w-1/2 p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-gray-900 leading-tight">
                      {cert.title || "Unnamed Certification"}
                    </h3>

                    {cert.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {cert.description}
                      </p>
                    )}

                    {cert.issued_by && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Award className="w-3.5 h-3.5" />
                        <span>{cert.issued_by}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      {cert.issued_at && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            Issued:{" "}
                            {new Date(cert.issued_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {cert.expires_at && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            Expires:{" "}
                            {new Date(cert.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors mt-3 w-fit"
                    >
                      View Credential
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
