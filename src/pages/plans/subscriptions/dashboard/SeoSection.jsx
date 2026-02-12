// import React from 'react';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Search,
//   TrendingUp,
//   Globe,
//   Target,
//   BarChart3
// } from "lucide-react";

// export default function SeoSection() {
//   return (
//     <Card className="bg-linear-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800">
//       <CardHeader className="pb-4">
//         <div className="flex items-start justify-between">
//           <div>
//             <CardTitle className="text-lg flex items-center gap-2">
//               <Search className="h-5 w-5 text-blue-600" />
//               SEO Services
//             </CardTitle>
//             <CardDescription>Search engine optimization details</CardDescription>
//           </div>
//           <Badge className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800">
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
//               <Target className="h-4 w-4 text-muted-foreground" />
//               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                 Keywords
//               </span>
//             </div>
//             <p className="text-sm font-semibold">25</p>
//           </div>

//           <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
//             <div className="flex items-center gap-2">
//               <TrendingUp className="h-4 w-4 text-muted-foreground" />
//               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                 Ranking
//               </span>
//             </div>
//             <p className="text-sm font-semibold">Top 10</p>
//           </div>

//           <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
//             <div className="flex items-center gap-2">
//               <BarChart3 className="h-4 w-4 text-muted-foreground" />
//               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                 Reports
//               </span>
//             </div>
//             <p className="text-sm font-semibold">Monthly</p>
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
  Search,
  TrendingUp,
  Globe,
  Target,
  BarChart3,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parse } from "date-fns";

export default function SeoSection({ analyticsData }) {
  // Transform Google Analytics data into chart-friendly format
  const chartData = useMemo(() => {
    if (!analyticsData?.rows) return [];

    return analyticsData.rows.map((row) => {
      const date = row.dimensionValues?.[0]?.value || "";
      const formattedDate = date
        ? format(parse(date, "yyyyMMdd", new Date()), "MMM dd")
        : "";
      const activeUsers = parseInt(row.metricValues?.[0]?.value || 0);
      const sessions = parseInt(row.metricValues?.[1]?.value || 0);

      return {
        date: formattedDate,
        activeUsers,
        sessions,
      };
    });
  }, [analyticsData]);

  // Calculate stats
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        totalUsers: 0,
        totalSessions: 0,
        avgUsers: 0,
        avgSessions: 0,
        userTrend: 0,
        sessionTrend: 0,
      };
    }

    const totalUsers = chartData.reduce((sum, d) => sum + d.activeUsers, 0);
    const totalSessions = chartData.reduce((sum, d) => sum + d.sessions, 0);
    const avgUsers = Math.round(totalUsers / chartData.length);
    const avgSessions = Math.round(totalSessions / chartData.length);

    // Calculate trend (compare first half to second half)
    const midpoint = Math.floor(chartData.length / 2);
    const firstHalfUsers =
      chartData.slice(0, midpoint).reduce((sum, d) => sum + d.activeUsers, 0) /
      midpoint;
    const secondHalfUsers =
      chartData.slice(midpoint).reduce((sum, d) => sum + d.activeUsers, 0) /
      (chartData.length - midpoint);
    const userTrend = Math.round(
      ((secondHalfUsers - firstHalfUsers) / firstHalfUsers) * 100,
    );

    const firstHalfSessions =
      chartData.slice(0, midpoint).reduce((sum, d) => sum + d.sessions, 0) /
      midpoint;
    const secondHalfSessions =
      chartData.slice(midpoint).reduce((sum, d) => sum + d.sessions, 0) /
      (chartData.length - midpoint);
    const sessionTrend = Math.round(
      ((secondHalfSessions - firstHalfSessions) / firstHalfSessions) * 100,
    );

    return {
      totalUsers,
      totalSessions,
      avgUsers,
      avgSessions,
      userTrend,
      sessionTrend,
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 text-white p-3 rounded-lg shadow-xl border border-slate-700">
          <p className="text-sm font-medium">{payload[0].payload.date}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Users */}
        <Card className="border-slate-200 dark:border-slate-800 ">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Active Users
                </span>
              </div>
              {stats.userTrend !== 0 && (
                <div
                  className={`flex items-center gap-1 ${stats.userTrend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {stats.userTrend >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span className="text-xs font-semibold">
                    {Math.abs(stats.userTrend)}%
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {stats.totalUsers.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Avg. {stats.avgUsers.toLocaleString()} per day
            </p>
          </CardContent>
        </Card>

        {/* Sessions */}
        <Card className="border-slate-200 dark:border-slate-800 ">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Sessions
                </span>
              </div>
              {stats.sessionTrend !== 0 && (
                <div
                  className={`flex items-center gap-1 ${stats.sessionTrend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {stats.sessionTrend >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span className="text-xs font-semibold">
                    {Math.abs(stats.sessionTrend)}%
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {stats.totalSessions.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Avg. {stats.avgSessions.toLocaleString()} per day
            </p>
          </CardContent>
        </Card>

        {/* Avg Session Value */}
        <Card className="border-slate-200 dark:border-slate-800 ">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Engagement Rate
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {stats.totalUsers > 0
                ? Math.round((stats.totalSessions / stats.totalUsers) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Sessions per user
            </p>
          </CardContent>
        </Card>

        {/* Period */}
        <Card className="border-slate-200 dark:border-slate-800 ">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <BarChart3 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Period
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {chartData.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Days tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line Chart - Active Users Trend */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              User Activity Trend
            </CardTitle>
            <CardDescription>Daily active users over time</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    className="dark:stroke-slate-800"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 5 }}
                    activeDot={{ r: 7 }}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    name="Active Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Sessions Comparison */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Sessions Overview
            </CardTitle>
            <CardDescription>Daily sessions by date</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorSessions"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#a855f7"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    className="dark:stroke-slate-800"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="sessions"
                    fill="url(#colorSessions)"
                    radius={[8, 8, 0, 0]}
                    name="Sessions"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Table Summary */}
      {chartData.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base">Detailed Metrics</CardTitle>
            <CardDescription>Day-by-day breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                      Active Users
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                      Sessions
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">
                      Engagement
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-900 dark:text-slate-50">
                        {row.date}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                        {row.activeUsers.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                        {row.sessions.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                          {Math.round((row.sessions / row.activeUsers) * 100)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
