import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { getMonthlyViolations } from "~/lib/functions/dashboard";

export function Overview() {
  // Fetch monthly violations data
  const { data, isLoading, error } = useQuery({
    queryKey: ["monthlyViolations"],
    queryFn: () => getMonthlyViolations(),
  });

  // If loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <p className="text-muted-foreground">Loading data...</p>
      </div>
    );
  }

  // If error, show an error state
  if (error) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <p className="text-destructive">Failed to load data</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
