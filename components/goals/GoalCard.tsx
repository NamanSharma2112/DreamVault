"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { formatCurrency, daysUntil, getProgressPercentage, cn } from "@/lib/utils";
import { Target, Calendar, ChevronRight } from "lucide-react";
import type { Goal } from "@/hooks/useGoals";
import { calculateMonthlySaving } from "@/lib/finance";
import Link from "next/link";
import { motion } from "framer-motion";

interface GoalCardProps {
  goal: Goal;
}

const statusBadge = {
  ACTIVE: { variant: "primary" as const, label: "Active" },
  COMPLETED: { variant: "success" as const, label: "Completed" },
  PAUSED: { variant: "warning" as const, label: "Paused" },
  CANCELLED: { variant: "danger" as const, label: "Cancelled" },
};

const typeIcons: Record<string, string> = {
  PURCHASE: "🛒",
  TRIP: "✈️",
  EMERGENCY_FUND: "🛡️",
  INVESTMENT: "📈",
  EXPERIENCE: "🎭",
  OTHER: "✨",
};

export function GoalCard({ goal }: GoalCardProps) {
  const progress = getProgressPercentage(goal.savedAmount, goal.targetAmount);
  const days = daysUntil(goal.targetDate);
  const monthlySaving = calculateMonthlySaving(
    goal.targetAmount,
    goal.savedAmount,
    goal.targetDate
  );
  const badge = statusBadge[goal.status as keyof typeof statusBadge] || statusBadge.ACTIVE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/goals/${goal.id}`}>
        <Card hover className="group relative overflow-hidden h-full flex flex-col justify-between">
          {goal.imageUrl && (
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10" />
              <img src={goal.imageUrl} alt={goal.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          )}
          
          <div className={cn("relative z-20", goal.imageUrl && "text-white h-full flex flex-col")}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-[11px] text-xl shadow-sm backdrop-blur-sm",
                  goal.imageUrl ? "bg-white/10 border border-white/20" : "bg-canvas-parchment"
                )}>
                  {typeIcons[goal.goalType] || "✨"}
                </div>
                <div>
                  <h3 className={cn("text-body-strong transition-colors truncate", goal.imageUrl ? "text-white" : "text-ink group-hover:text-primary")}>
                    {goal.title}
                  </h3>
                  <p className={cn("text-fine-print", goal.imageUrl ? "text-white/80" : "text-ink-muted-48")}>
                    {goal.items?.length || 0} item{(goal.items?.length || 0) !== 1 ? "s" : ""} linked
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={badge.variant}>{badge.label}</Badge>
                <ChevronRight className={cn("h-4 w-4 transition-transform group-hover:translate-x-0.5", goal.imageUrl ? "text-white/60" : "text-ink-muted-48")} />
              </div>
            </div>

            <div className="mt-8 flex items-end justify-between">
              <div>
                <p className={cn("text-fine-print uppercase tracking-wider font-medium", goal.imageUrl ? "text-white/70" : "text-ink-muted-48")}>Progress</p>
                <p className={cn("text-tagline mt-1", goal.imageUrl ? "text-white" : "text-ink")}>
                  {formatCurrency(goal.savedAmount)}
                </p>
              </div>
              <div className="text-right">
                <p className={cn("text-fine-print uppercase tracking-wider font-medium", goal.imageUrl ? "text-white/70" : "text-ink-muted-48")}>Target</p>
                <p className={cn("text-body-strong mt-1", goal.imageUrl ? "text-white/90" : "text-ink-muted-80")}>
                  {formatCurrency(goal.targetAmount)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Progress
                value={goal.savedAmount}
                max={goal.targetAmount}
                size="md"
                showLabel={false}
                color={progress >= 100 ? "success" : progress >= 50 ? "primary" : "warning"}
              />
            </div>

            <div className={cn("mt-5 pt-4 border-t flex items-center justify-between text-fine-print", goal.imageUrl ? "border-white/10 text-white/70" : "border-hairline text-ink-muted-48")}>
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-3.5 w-3.5" />
                <span className={days < 30 && days > 0 ? (goal.imageUrl ? "text-warning" : "text-warning") : days < 0 ? (goal.imageUrl ? "text-danger" : "text-danger") : ""}>
                  {days > 0
                    ? `${days} days left`
                    : days === 0
                    ? "Due today"
                    : `${Math.abs(days)} days overdue`}
                </span>
              </div>
              {goal.status === "ACTIVE" && monthlySaving > 0 && (
                <div className="flex items-center gap-1.5 font-medium">
                  <Target className="h-3.5 w-3.5" />
                  {formatCurrency(monthlySaving)}/mo needed
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
