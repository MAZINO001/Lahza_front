import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const generateDailyTaskCount = (tasks, startDate, endDate) => {
  const data = [];
  // const current = new Date("2026-01-01");
  const current = new Date(startDate);

  const taskMap = {};

  tasks?.forEach((task) => {
    const isCompleted =
      task.status === "done" ||
      task.status === "completed" ||
      task.percentage === 100;

    if (isCompleted) {
      const dateToUse =
        task.updated_at || task.created_at || new Date().toISOString();
      const dateKey = new Date(dateToUse).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      taskMap[dateKey] = (taskMap[dateKey] || 0) + 1;
    }
  });

  while (current <= new Date(endDate)) {
    const day = current.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    data.push({
      date: day,
      completed: taskMap[day] || 0,
    });

    current.setDate(current.getDate() + 1);
  }

  return data;
};

const chartConfig = {
  completed: {
    label: "Completed Tasks",
    color: "var(--chart-1)",
  },
};

export function ChartBarDefault({ startDate, endDate, tasks }) {
  const chartData =
    startDate && endDate
      ? generateDailyTaskCount(tasks, startDate, endDate)
      : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed Tasks</CardTitle>
        <CardDescription>
          {startDate && endDate
            ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
            : "No date range selected"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          style={{ height: "300px", width: "100%" }}
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="completed" fill="var(--color-completed)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
