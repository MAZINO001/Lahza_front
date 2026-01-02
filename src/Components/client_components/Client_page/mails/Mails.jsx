import React from "react";
import { Mail, Clock, User, CheckCircle2, Send } from "lucide-react";
import { useEmailsById } from "@/features/clients/hooks/useClientsEmails";

export default function Mails({ currentId = 1 }) {
  const { data, isLoading } = useEmailsById(currentId);
  console.log(data);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const extractEmail = (emailString) => {
    const match = emailString.match(/<(.+?)>/);
    return match ? match[1] : emailString;
  };

  const extractName = (emailString) => {
    const match = emailString.match(/^"?([^"<]+)"?\s*</);
    return match ? match[1].trim() : null;
  };

  if (isLoading) {
    return (
      <div className="bg-background rounded-lg border border-border p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-border"></div>
          <span className="ml-3 text-muted-foreground">Loading emails...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-foreground" />
          <h2 className="text-base font-semibold text-foreground">
            System Mails
          </h2>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded-full">
          {data?.length || 0} emails
        </span>
      </div>

      <div className="divide-y divide-border">
        {data && data.length > 0 ? (
          data.map((mail) => {
            const fromEmail = mail?.new_values?.from?.[0];
            const fromName = fromEmail ? extractName(fromEmail) : null;
            const fromAddress = fromEmail ? extractEmail(fromEmail) : "Unknown";
            const toEmail = mail?.new_values?.to?.[0] || "Unknown";

            return (
              <div
                key={mail.id}
                className="p-4 hover:bg-background transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Send className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Sent
                          </span>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {mail.device}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(mail.created_at)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {mail?.new_values?.subject || "No Subject"}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium w-12">
                            From:
                          </span>
                          <div className="flex items-center gap-2">
                            {fromName && (
                              <span className="text-foreground font-medium">
                                {fromName}
                              </span>
                            )}
                            <span className="text-muted-foreground">
                              {fromAddress}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium w-12">
                            To:
                          </span>
                          <span className="text-foreground">{toEmail}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span className="capitalize">{mail.user_role}</span>
                        </div>
                        <span>•</span>
                        <span>ID: {mail.record_id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No emails found</p>
          </div>
        )}
      </div>
    </div>
  );
}
