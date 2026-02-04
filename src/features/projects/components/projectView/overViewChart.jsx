// import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

// const generateDailyTaskCount = (tasks, startDate, endDate) => {
//   const data = [];
//   // const current = new Date("2026-01-01");
//   const current = new Date(startDate);

//   const taskMap = {};

//   tasks?.forEach((task) => {
//     const isCompleted =
//       task.status === "done" ||
//       task.status === "completed" ||
//       task.percentage === 100;

//     if (isCompleted) {
//       const dateToUse =
//         task.updated_at || task.created_at || new Date().toISOString();
//       const dateKey = new Date(dateToUse).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       });
//       taskMap[dateKey] = (taskMap[dateKey] || 0) + 1;
//     }
//   });

//   while (current <= new Date(endDate)) {
//     const day = current.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });

//     data.push({
//       date: day,
//       completed: taskMap[day] || 0,
//     });

//     current.setDate(current.getDate() + 1);
//   }

//   return data;
// };

// const chartConfig = {
//   completed: {
//     label: "Completed Tasks",
//     color: "var(--chart-1)",
//   },
// };

// export function ChartBarDefault({ startDate, endDate, tasks }) {
//   const chartData =
//     startDate && endDate
//       ? generateDailyTaskCount(tasks, startDate, endDate)
//       : [];

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Completed Tasks</CardTitle>
//         <CardDescription>
//           {startDate && endDate
//             ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
//             : "No date range selected"}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer
//           config={chartConfig}
//           style={{ height: "300px", width: "100%" }}
//         >
//           <BarChart accessibilityLayer data={chartData}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tick={{ fontSize: 12 }}
//             />
//             <YAxis />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Bar dataKey="completed" fill="var(--color-completed)" radius={8} />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { format, parseISO } from "date-fns";

function generateDailyCompletedData(tasks, start, end) {
  if (!tasks?.length || !start || !end) {
    return [];
  }

  const startDt = new Date(start);
  const endDt = new Date(end);

  if (isNaN(startDt.getTime()) || isNaN(endDt.getTime())) {
    return [];
  }

  // Count completed tasks per day (using updated_at or fallback to created_at)
  const countByDay = {};

  tasks.forEach((task) => {
    const isDone =
      task.status === "done" ||
      task.status === "completed" ||
      task.percentage === 100;

    if (!isDone) return;

    const dateStr = task.updated_at || task.created_at;
    if (!dateStr) return;

    try {
      const date = parseISO(dateStr);
      if (date < startDt || date > endDt) return;

      const key = format(date, "MMM d");
      countByDay[key] = (countByDay[key] || 0) + 1;
    } catch {
      // skip invalid dates
    }
  });

  // Fill every day in range (even with zero)
  const data = [];
  const current = new Date(startDt);

  while (current <= endDt) {
    const key = format(current, "MMM d");
    data.push({
      date: key,
      completed: countByDay[key] || 0,
    });
    current.setDate(current.getDate() + 1);
  }

  return data;
}

const chartConfig = {
  completed: {
    label: "Completed Tasks",
    color: "hsl(var(--chart-1))",
  },
};

export function ChartBarDefault({ tasks, startDate, endDate, className }) {
  const data = generateDailyCompletedData(tasks, startDate, endDate);

  const titleDateRange =
    startDate && endDate && !isNaN(new Date(startDate).getTime())
      ? `${format(new Date(startDate), "MMM d, yyyy")} – ${format(
          new Date(endDate),
          "MMM d, yyyy",
        )}`
      : "No date range selected";

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Completed Tasks</CardTitle>
        <CardDescription className="text-muted-foreground">
          {titleDateRange}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-1">
        {data.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
            No completed tasks in selected period
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <ResponsiveContainer>
              <BarChart
                data={data}
                margin={{ top: 16, right: 8, left: -8, bottom: 0 }}
                accessibilityLayer
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.6}
                />

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickMargin={8}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  width={32}
                  tickMargin={4}
                />

                <Tooltip
                  cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `Date: ${value}`}
                      nameKey="completed"
                      hideIndicator
                    />
                  }
                />

                <Bar
                  dataKey="completed"
                  fill="var(--color-completed)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
