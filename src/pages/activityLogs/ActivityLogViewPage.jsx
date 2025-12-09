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
} from "lucide-react";

import { TheActivityLogs } from "@/lib/mockData";
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

export default function ActivityLogViewPage() {
  const { id } = useParams();
  const { role } = useAuthContext();
  const log = TheActivityLogs.find((l) => l.id === Number(id));

  if (!log) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <h2 className="text-2xl font-bold mb-2">Log Not Found</h2>
        <Link to={`/${role}/logs`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Logs
          </Button>
        </Link>
      </div>
    );
  }

  const logId = `LOG-${String(log.id).padStart(4, "0")}`;
  const date = new Date(log.created_at);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, {
      description: text,
      duration: 3000,
    });
  };


  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="mb-4 flex items-center justify-between ">
        <Link
          to={`/${role}/logs`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Activity Logs
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4"></div>
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
                    {log.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{log.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {log.user.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCcw className="h-5 w-5" />
                Changes Made
              </CardTitle>
              <CardDescription>
                {Object.keys(log.changes || {}).length} field
                {Object.keys(log.changes || {}).length !== 1 ? "s" : ""}{" "}
                modified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {log.changes &&
                Object.entries(log.changes).map(([field, value]) => {
                  const oldVal = value.old ?? value;
                  const newVal = value.new ?? value;
                  const isSame = oldVal === newVal;

                  return (
                    <div key={field} className="space-y-2">
                      <p className="font-medium capitalize">
                        {field.replace(/_/g, " ")}
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div
                          className={`p-3 rounded-lg ${isSame ? "bg-muted" : "bg-red-50"}`}
                        >
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <XCircle className="h-4 w-4" />
                            Old
                          </div>
                          <p className="font-mono text-sm mt-1 break-all">
                            {String(oldVal) || "(empty)"}
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
                            {String(newVal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {(!log.changes || Object.keys(log.changes).length === 0) && (
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
                <p className="text-sm text-muted-foreground">Table</p>
                <Badge variant="outline" className="mt-1">
                  {log.table_name}
                </Badge>
              </div>
              {log.record_id && (
                <div>
                  <p className="text-sm text-muted-foreground">Record ID</p>
                  <p className="font-mono font-medium">#{log.record_id}</p>
                </div>
              )}
              {log.changes?.title && (
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">
                    {typeof log.changes.title === "object"
                      ? log.changes.title.new
                      : log.changes.title}
                  </p>
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
                    {log.ip_country === "XX" ? "Unknown" : log.ip_country}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Device</p>
                  <p className="font-medium">{log.device}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
