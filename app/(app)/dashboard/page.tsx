"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { SavingsChart } from "@/components/dashboard/SavingsChart";
import { QuickAdd } from "@/components/dashboard/QuickAdd";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, daysUntil, getProgressPercentage } from "@/lib/utils";
import { StatSkeleton, CardSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { calculateMonthlySaving } from "@/lib/finance";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const [name, setName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.name) {
        setName(user.user_metadata.name);
      }
    });
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <CardSkeleton className="lg:col-span-2" />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!data) return null;


  // Calculate total monthly saving needed for all active goals
  const totalMonthlyNeeded = data.activeGoals.reduce((sum, g) => {
    return sum + calculateMonthlySaving(g.targetAmount, g.savedAmount, g.targetDate);
  }, 0);

  const userSavingCapacity = data.user?.monthlySavings || 0;
  const savingGap = userSavingCapacity - totalMonthlyNeeded;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-display-md text-ink">
          {getGreeting()}{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-2 text-body text-ink-muted-80">
          Your financial overview and savings progress.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatsCards data={data} />
      </motion.div>

      {/* Quick Add Section */}
      <motion.div variants={itemVariants}>
        <QuickAdd />
      </motion.div>

      {/* Financial Health Banner */}
      <motion.div variants={itemVariants}>
        <Card variant={savingGap >= 0 ? "parchment" : "default"} padding="sm" className={savingGap < 0 ? "border-warning" : ""}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-body-strong text-ink">Savings Health</h3>
              <p className="text-caption text-ink-muted-80">
                You need {formatCurrency(totalMonthlyNeeded)}/mo to hit all your active goals.
              </p>
            </div>
            <div className="text-right">
              {userSavingCapacity > 0 ? (
                <Badge variant={savingGap >= 0 ? "success" : "warning"}>
                  {savingGap >= 0
                    ? `On track (₹${savingGap} surplus)`
                    : `Behind by ₹${Math.abs(savingGap)}/mo`}
                </Badge>
              ) : (
                <Link href="/settings">
                  <Badge variant="primary" className="cursor-pointer hover:bg-primary/20">
                    Set Monthly Income →
                  </Badge>
                </Link>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SavingsChart 
            currentSaved={data.totalSaved} 
            monthlySaving={userSavingCapacity || totalMonthlyNeeded} 
          />
        </div>
        <div>
          <CategoryBreakdown data={data.categoryBreakdown} />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Priority Items */}
        <Card className="flex flex-col">
          <div className="mb-4 flex items-center justify-between border-b border-hairline pb-4">
            <h3 className="text-body-strong text-ink">Top Priorities</h3>
            <Link href="/wishlist" className="text-caption text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="flex-1 space-y-4">
            {data.topItems.length > 0 ? (
              data.topItems.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="flex items-center justify-between">
                    <p className="text-body font-medium text-ink line-clamp-1">{item.title}</p>
                    <span className="text-caption-strong text-ink">{formatCurrency(item.price)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-fine-print text-ink-muted-48">
                    <span>{getProgressPercentage(item.savedAmount, item.price)}%</span>
                  </div>
                  <Progress 
                    value={item.savedAmount} 
                    max={item.price} 
                    size="sm" 
                    className="mt-1"
                  />
                </div>
              ))
            ) : (
              <p className="text-caption text-ink-muted-48 text-center py-4">No priority items found.</p>
            )}
          </div>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="flex flex-col">
          <div className="mb-4 flex items-center justify-between border-b border-hairline pb-4">
            <h3 className="text-body-strong text-ink">Upcoming Deadlines</h3>
            <Link href="/goals" className="text-caption text-primary hover:underline">
              View plan
            </Link>
          </div>
          <div className="flex-1 space-y-4">
            {data.upcomingItems.length > 0 ? (
              data.upcomingItems.slice(0, 5).map((item) => {
                const days = daysUntil(item.targetDate);
                return (
                  <div key={item.id} className="flex items-center justify-between rounded-[8px] p-2 hover:bg-canvas-parchment transition-colors">
                    <div>
                      <p className="text-body font-medium text-ink line-clamp-1">{item.title}</p>
                      <p className="text-fine-print text-ink-muted-48">
                        {formatCurrency(item.price - item.savedAmount)} remaining
                      </p>
                    </div>
                    <Badge variant={days < 14 ? "danger" : days < 30 ? "warning" : "default"}>
                      {days} days
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="text-caption text-ink-muted-48 text-center py-4">No upcoming deadlines in 90 days.</p>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
