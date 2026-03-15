"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const revenueData = [
  { month: "Sep", revenue: 105000 },
  { month: "Oct", revenue: 112000 },
  { month: "Nov", revenue: 18000 }, // the dip
  { month: "Dec", revenue: 125000 },
  { month: "Jan", revenue: 68000 },
  { month: "Feb", revenue: 82000 },
  { month: "Mar", revenue: 105000 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(220 70% 50%)", // nice blue
  },
};

export default function MarketingGrowth() {
  return (
    <div className="space-y-4 text-foreground w-full">
      <h2 className="text-xl font-normal tracking-tight text-foreground">
        Marketing & Growth
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-5 bg-background border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue Growth</CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly income over the last 7 months
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart
                accessibilityLayer
                data={revenueData}
                margin={{ left: 12, right: 12, top: 12, bottom: 8 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="4 4"
                  stroke="hsl(var(--border))"
                  opacity={0.4}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                  fontSize={12}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={(value) => `${value} 2025`}
                      valueFormatter={(value) =>
                        `$${Number(value).toLocaleString()}`
                      }
                    />
                  }
                />
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="var(--color-revenue)"
                  fillOpacity={0.25}
                  stroke="var(--color-revenue)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="space-y-4 md:col-span-3 lg:col-span-2">
          <Card className="border-border bg-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Offer Conversion</CardTitle>
              <p className="text-sm text-muted-foreground">
                Offer performance & lead tracking
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span>65% conversion rate</span>
                  <span className="text-muted-foreground">34 total</span>
                </div>
                <Progress value={65} className="h-2.5" />
                <div className="mt-2.5 flex justify-between text-xs text-muted-foreground">
                  <span>22 accepted</span>
                  <span>7 rejected</span>
                  <span>5 pending</span>
                </div>
              </div>

              {/* New Leads */}
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <div className="text-3xl font-bold">18</div>
                <div className="text-sm text-muted-foreground mt-1">
                  New Leads This Week
                </div>
              </div>

              {/* Revenue Trend */}
              <div className="rounded-lg border bg-background/30 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-emerald-400">↑</span>
                  <span className="text-lg font-semibold">+19.6%</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  vs last month
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
