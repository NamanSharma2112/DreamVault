"use client";

import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { Heart, PiggyBank, Target, CalendarDays } from "lucide-react";
import type { DashboardData } from "@/hooks/useDashboard";
import { motion } from "framer-motion";

const cardColors = [
  { bg: "bg-primary/10", text: "text-primary", accent: "border-l-primary" },
  { bg: "bg-success/10", text: "text-success", accent: "border-l-success" },
  { bg: "bg-info/10", text: "text-info", accent: "border-l-info" },
  { bg: "bg-warning/10", text: "text-warning", accent: "border-l-warning" },
];

export function StatsCards({ data }: { data: DashboardData }) {
  const cards = [
    {
      title: "Total Target",
      value: formatCurrency(data.totalWishlistValue),
      icon: Target,
      desc: `${data.itemsCount} total items tracked`,
    },
    {
      title: "Total Saved",
      value: formatCurrency(data.totalSaved),
      icon: PiggyBank,
      desc: `${Math.round((data.totalSaved / (data.totalWishlistValue || 1)) * 100)}% of overall target`,
    },
    {
      title: "Active Goals",
      value: data.goalsCount.toString(),
      icon: Heart,
      desc: "Grouped savings targets",
    },
    {
      title: "Due Soon",
      value: data.upcomingItems.length.toString(),
      icon: CalendarDays,
      desc: "Deadlines in next 90 days",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card padding="md" className={`border-l-[3px] ${cardColors[i].accent}`}>
            <div className="flex items-center justify-between">
              <p className="text-caption text-ink-muted-48">{card.title}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${cardColors[i].bg}`}>
                <card.icon className={`h-[18px] w-[18px] ${cardColors[i].text}`} />
              </div>
            </div>
            <p className="mt-3 text-[28px] font-semibold tracking-tight text-ink">{card.value}</p>
            <p className="mt-1 text-fine-print text-ink-muted-48">{card.desc}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
