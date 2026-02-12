// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Server,
//   Database,
//   Mail,
//   HardDrive,
//   Globe,
//   Shield
// } from "lucide-react";

// export default function WebHostingSection() {
//   return (
//     <Card className="bg-linear-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800">
//       <CardHeader className="pb-4">
//         <div className="flex items-start justify-between">
//           <div>
//             <CardTitle className="text-lg flex items-center gap-2">
//               <Server className="h-5 w-5 text-green-600" />
//               Web Hosting
//             </CardTitle>
//             <CardDescription>Hosting and server details</CardDescription>
//           </div>
//           <Badge className="bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800">
//             Active
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
//             <div className="flex items-center gap-2">
//               <Globe className="h-4 w-4 text-muted-foreground" />
//               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                 Domain
//               </span>
//             </div>
//             <p className="text-sm font-semibold">lahza.com</p>
//           </div>

//           <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
//             <div className="flex items-center gap-2">
//               <HardDrive className="h-4 w-4 text-muted-foreground" />
//               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                 Storage
//               </span>
//             </div>
//             <p className="text-sm font-semibold">50 GB</p>
//           </div>

//           <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
//             <div className="flex items-center gap-2">
//               <Mail className="h-4 w-4 text-muted-foreground" />
//               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                 Email
//               </span>
//             </div>
//             <p className="text-sm font-semibold">10 Accounts</p>
//           </div>

//           <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
//             <div className="flex items-center gap-2">
//               <Shield className="h-4 w-4 text-muted-foreground" />
//               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                 SSL
//               </span>
//             </div>
//             <p className="text-sm font-semibold">Enabled</p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  Database,
  Mail,
  HardDrive,
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  Zap,
  Calendar,
  Activity,
  Lock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format, parseISO } from "date-fns";

export default function WebHostingSection({ hostingData }) {
  if (!hostingData) return null;

  const {
    domain,
    status,
    plan,
    ipAddress,
    createdAt,
    expiresAt,
    autoRenew,
    resources = {},
    databases = [],
    emails = [],
    ssl = {},
    backups = {},
    uptime = "0%",
  } = hostingData;

  // Parse storage values
  const parseStorage = (str) => {
    if (!str) return 0;
    const num = parseFloat(str);
    const unit = str.replace(/[0-9.]/g, "");
    const multipliers = { GB: 1024, MB: 1, TB: 1024 * 1024 };
    return num * (multipliers[unit] || 1);
  };

  const diskUsedMB = parseStorage(resources.diskUsed);
  const diskLimitMB = parseStorage(resources.diskLimit);
  const diskUsagePercent = (diskUsedMB / diskLimitMB) * 100;

  const bandwidthUsedMB = parseStorage(resources.bandwidthUsed);
  const bandwidthLimitMB = parseStorage(resources.bandwidthLimit);
  const bandwidthUsagePercent = (bandwidthUsedMB / bandwidthLimitMB) * 100;

  const databaseSize = databases.reduce(
    (sum, db) => sum + parseStorage(db.size),
    0,
  );
  const emailsCount = emails.length;

  // Status colors
  const getStatusColor = (percent) => {
    if (percent < 60) return "text-emerald-600 dark:text-emerald-400";
    if (percent < 80) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressColor = (percent) => {
    if (percent < 60) return "bg-emerald-500";
    if (percent < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  const formatDate = (dateStr) => {
    try {
      return format(parseISO(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const daysUntilExpire = useMemo(() => {
    try {
      const expDate = parseISO(expiresAt);
      const today = new Date();
      const diff = expDate - today;
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    } catch {
      return null;
    }
  }, [expiresAt]);

  const isExpiringSoon = daysUntilExpire && daysUntilExpire < 30;
  const isExpired = daysUntilExpire && daysUntilExpire < 0;

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                  <Server className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{domain}</CardTitle>
                  <CardDescription className="text-base">
                    {plan}
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 font-semibold px-3 py-1.5 capitalize">
                {status}
              </Badge>
              {autoRenew && (
                <Badge variant="outline" className="text-xs">
                  Auto-renewing
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* {isExpired && (
        <Card className="border-2 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">
                  Hosting Expired
                </p>
                <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                  Your hosting expired on {formatDate(expiresAt)}. Please renew
                  immediately to restore service.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {isExpiringSoon && !isExpired && (
        <Card className="border-2 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Expiring Soon
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                  Your hosting expires in {daysUntilExpire} days (
                  {formatDate(expiresAt)}). Renew now to avoid disruption.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* IP Address */}
        <Card className="border-slate-200 dark:border-slate-800 ">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                IP Address
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50 font-mono">
              {ipAddress || "N/A"}
            </p>
          </CardContent>
        </Card>

        {/* Created Date */}
        <Card className="border-slate-200 dark:border-slate-800 ">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Created
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {formatDate(createdAt)}
            </p>
          </CardContent>
        </Card>

        {/* Expires */}
        <Card className="border-slate-200 dark:border-slate-800 ">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${isExpiringSoon ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}
              >
                <Calendar
                  className={`h-4 w-4 ${isExpiringSoon ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Expires
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {formatDate(expiresAt)}
            </p>
            {daysUntilExpire && (
              <p
                className={`text-xs mt-1 ${isExpiringSoon ? "text-amber-600 dark:text-amber-400 font-semibold" : "text-muted-foreground"}`}
              >
                {daysUntilExpire} days remaining
              </p>
            )}
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card className="border-slate-200 dark:border-slate-800 ">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Uptime
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {uptime}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Excellent reliability
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Disk Usage */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <CardTitle className="text-base">Disk Storage</CardTitle>
                  <CardDescription>Space utilization</CardDescription>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={getStatusColor(diskUsagePercent)}
              >
                {diskUsagePercent.toFixed(1)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Progress value={diskUsagePercent} className="h-2" />
              <div className="flex justify-between mt-3 text-sm">
                <span className="text-muted-foreground">
                  {resources.diskUsed} / {resources.diskLimit}
                </span>
                <span
                  className={`font-semibold ${getStatusColor(diskUsagePercent)}`}
                >
                  {(diskLimitMB - diskUsedMB).toFixed(1)}MB free
                </span>
              </div>
            </div>
            {databaseSize > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-muted-foreground">
                  Databases: {(databaseSize / 1024).toFixed(1)}GB
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bandwidth Usage */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <CardTitle className="text-base">Bandwidth</CardTitle>
                  <CardDescription>Transfer usage</CardDescription>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={getStatusColor(bandwidthUsagePercent)}
              >
                {bandwidthUsagePercent.toFixed(1)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Progress value={bandwidthUsagePercent} className="h-2" />
              <div className="flex justify-between mt-3 text-sm">
                <span className="text-muted-foreground">
                  {resources.bandwidthUsed} / {resources.bandwidthLimit}
                </span>
                <span
                  className={`font-semibold ${getStatusColor(bandwidthUsagePercent)}`}
                >
                  {(bandwidthLimitMB - bandwidthUsedMB).toFixed(1)}MB available
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SSL Certificate */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <CardTitle className="text-base">SSL Certificate</CardTitle>
                  <CardDescription>Security & encryption</CardDescription>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Issuer:</span>
                <span className="font-semibold ml-2">
                  {ssl.issuer || "N/A"}
                </span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Expires:</span>
                <span className="font-semibold ml-2">
                  {formatDate(ssl.expiresAt)}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Backups & Resources */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <div>
                <CardTitle className="text-base">System Health</CardTitle>
                <CardDescription>Performance metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">CPU Usage</span>
                <span
                  className={`font-semibold text-sm ${getStatusColor(parseFloat(resources.cpuUsage || 0))}`}
                >
                  {resources.cpuUsage || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">RAM Usage</span>
                <span className="font-semibold text-sm">
                  {resources.ramUsage || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-sm text-muted-foreground">
                  Last Backup
                </span>
                <span className="font-semibold text-sm">
                  {formatDate(backups.lastBackup)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Frequency</span>
                <span className="font-semibold text-sm capitalize">
                  {backups.frequency || "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emails & Databases */}
      {(emailsCount > 0 || databases.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Email Accounts */}
          {emailsCount > 0 && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  <div>
                    <CardTitle className="text-base">Email Accounts</CardTitle>
                    <CardDescription>
                      {emailsCount} active account{emailsCount !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {emails.map((email, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                        {email.address}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2 shrink-0">
                        {email.storage}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Databases */}
          {databases.length > 0 && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <CardTitle className="text-base">Databases</CardTitle>
                    <CardDescription>
                      {databases.length} database
                      {databases.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {databases.map((db, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                        {db.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2 shrink-0">
                        {db.size}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
