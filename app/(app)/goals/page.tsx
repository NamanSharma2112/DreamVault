"use client";

import { useState } from "react";
import { useGoals } from "@/hooks/useGoals";
import { GoalCard } from "@/components/goals/GoalCard";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const [activeTab, setActiveTab] = useState("ACTIVE");

  const filteredGoals = goals?.filter((g) => {
    if (activeTab === "ALL") return true;
    return g.status === activeTab;
  }) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-md text-ink">Savings Goals</h1>
          <p className="mt-2 text-body text-ink-muted-80">
            Group your items and track large savings targets.
          </p>
        </div>
        {/* We'll link to a create goal modal or page. For now, let's assume a modal or another page. 
            Let's create a quick create goal button that redirects to a new page or opens a modal. 
            For simplicity in this spec, we will link to /goals/new which we need to create. */}
        <Link href="/goals/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Goal
          </Button>
        </Link>
      </div>

      <div className="flex overflow-x-auto pb-2">
        <Tabs
          tabs={[
            { id: "ACTIVE", label: "Active" },
            { id: "COMPLETED", label: "Completed" },
            { id: "ALL", label: "All Goals" },
          ]}
          defaultTab="ACTIVE"
          onChange={setActiveTab}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[18px] border border-hairline bg-canvas-parchment p-8 text-center">
          <h3 className="text-tagline text-ink">No goals found</h3>
          <p className="mt-2 max-w-md text-body text-ink-muted-80">
            Create a goal to group related purchases, like a "Trip to Europe" or "Emergency Fund".
          </p>
          <Link href="/goals/new" className="mt-6">
            <Button variant="secondary">Create your first goal</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
