"use client";

import { Card } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CategoryBreakdownProps {
  data: Record<string, { count: number; totalValue: number }>;
}

const COLORS = ["#0066cc", "#34c759", "#ff9f0a", "#5ac8fa", "#ff3b30", "#af52de", "#ff2d55"];

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const chartData = Object.entries(data)
    .map(([name, { totalValue }]) => ({
      name: name.charAt(0) + name.slice(1).toLowerCase().replace("_", " "),
      value: totalValue,
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <Card className="flex h-[300px] items-center justify-center text-ink-muted-48">
        No category data available
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <h3 className="mb-6 text-body-strong text-ink">Value by Category</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => formatCurrency(value as number)}
              contentStyle={{
                borderRadius: "11px",
                border: "1px solid var(--color-hairline)",
                backgroundColor: "var(--color-canvas)",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {chartData.slice(0, 4).map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-fine-print text-ink-muted-80">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
