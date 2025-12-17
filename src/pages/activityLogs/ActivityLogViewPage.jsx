/* eslint-disable no-unused-vars */
import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  User,
  Globe,
  Monitor,
  CheckCircle2,
  XCircle,
  Target,
  RefreshCcw,
  PlusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuthContext } from "@/hooks/AuthContext";
import { useLog } from "@/features/activityLogs/hooks/useLogsQuery";
import { formatId } from "@/lib/utils/formatId";

export default function ActivityLogViewPage() {
  const { id } = useParams();
  const { role } = useAuthContext();
  const { data: log, isLoading } = useLog(id);
  console.log(log);
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const logId = `LOG-${String(log?.id).padStart(4, "0")}`;
  const date = new Date(log?.created_at);
  const isCreated = log?.action === "created";
  const isUpdated = log?.action === "updated";

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, {
      description: text,
      duration: 3000,
    });
  };

  const formatFieldName = (field) => {
    return field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getDisplayChanges = () => {
    if (isCreated && log?.new_values) {
      const excludeFields = ["id", "created_at", "updated_at"];
      return Object.entries(log?.new_values)
        .filter(([field]) => !excludeFields.includes(field))
        .map(([field, value]) => ({
          field,
          oldValue: null,
          newValue: value,
        }));
    } else if (isUpdated && log?.changes && typeof log?.changes === "object") {
      return Object.entries(log?.changes).map(([field, value]) => ({
        field,
        oldValue: value.old ?? value,
        newValue: value.new ?? value,
      }));
    }
    return [];
  };

  const displayChanges = getDisplayChanges();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-4 flex items-center justify-between">
        <Link
          to={`/${role}/logs`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Activity Logs
        </Link>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(logId, "Log ID")}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10">
                    {log?.user_id}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{formatId(id, "USER")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isCreated ? (
                  <PlusCircle className="h-5 w-5" />
                ) : (
                  <RefreshCcw className="h-5 w-5" />
                )}
                {isCreated ? "Record Created" : "Changes Made"}
              </CardTitle>
              <CardDescription>
                {isCreated
                  ? `New ${log?.table_name.slice(0, -1)} created with ${displayChanges.length} fields`
                  : `${displayChanges.length} field${displayChanges.length !== 1 ? "s" : ""} modified`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayChanges.length > 0 ? (
                displayChanges.map(({ field, oldValue, newValue }) => {
                  const isSame = oldValue === newValue;
                  const formatValue = (val) => {
                    if (val === null || val === undefined) return "(empty)";
                    if (typeof val === "object") return JSON.stringify(val);
                    return String(val);
                  };

                  return (
                    <div key={field} className="space-y-2">
                      <p className="font-medium">{formatFieldName(field)}</p>
                      {isCreated ? (
                        <div className="p-3 rounded-lg bg-green-50">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Value
                          </div>
                          <p className="font-mono text-sm break-all">
                            {formatValue(newValue)}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div
                            className={`p-3 rounded-lg ${isSame ? "bg-muted" : "bg-red-50"}`}
                          >
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <XCircle className="h-4 w-4" />
                              Old
                            </div>
                            <p className="font-mono text-sm mt-1 break-all">
                              {formatValue(oldValue)}
                            </p>
                          </div>
                          <div
                            className={`p-3 rounded-lg ${isSame ? "bg-muted" : "bg-green-50"}`}
                          >
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              New
                            </div>
                            <p className="font-mono text-sm mt-1 break-all">
                              {formatValue(newValue)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground italic">
                  No changes recorded
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Target
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Action</p>
                <Badge
                  variant={isCreated ? "default" : "secondary"}
                  className="mt-1"
                >
                  {log?.action}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Table</p>
                <Badge variant="outline" className="mt-1">
                  {log?.table_name}
                </Badge>
              </div>
              {log?.record_id && (
                <div>
                  <p className="text-sm text-muted-foreground">Record ID</p>
                  <p className="font-mono font-medium">#{log?.record_id}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Location & Device
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">
                    {log?.ip_country === "XX" ? "Unknown" : log?.ip_country}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Device</p>
                  <p className="font-medium">{log?.device}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
