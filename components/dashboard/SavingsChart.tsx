"use client";

import { Card } from "@/components/ui/Card";
import { projectSavings } from "@/lib/finance";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

export function SavingsChart({
  currentSaved,
  monthlySaving,
}: {
  currentSaved: number;
  monthlySaving: number;
}) {
  // Project next 12 months
  const data = projectSavings(currentSaved, monthlySaving || 0, 12).map(
    (d) => {
      const date = new Date();
      date.setMonth(date.getMonth() + d.month);
      return {
        month: date.toLocaleDateString("en-US", { month: "short" }),
        amount: d.amount,
      };
    }
  );

  return (
    <Card className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-body-strong text-ink">12-Month Projection</h3>
        <span className="text-fine-print text-ink-muted-80">
          Based on {formatCurrency(monthlySaving)}/mo saving
        </span>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-hairline)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-ink-muted-48)" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-ink-muted-48)" }}
              tickFormatter={(val) => `₹${val / 1000}k`}
              dx={-10}
            />
            <Tooltip
              formatter={(value: any) => formatCurrency(value as number)}
              contentStyle={{
                borderRadius: "11px",
                border: "1px solid var(--color-hairline)",
                backgroundColor: "var(--color-canvas)",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAmount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
