"use client";

import { useQuery } from "@tanstack/react-query";

export interface DashboardData {
  totalWishlistValue: number;
  totalSaved: number;
  statusCounts: {
    PENDING: number;
    SAVING: number;
    PURCHASED: number;
    CANCELLED: number;
  };
  topItems: Array<{
    id: string;
    title: string;
    price: number;
    savedAmount: number;
    priority: string;
    imageUrl: string | null;
    targetDate: string | null;
    status: string;
  }>;
  categoryBreakdown: Record<string, { count: number; totalValue: number }>;
  upcomingItems: Array<{
    id: string;
    title: string;
    price: number;
    savedAmount: number;
    targetDate: string;
    status: string;
  }>;
  activeGoals: Array<{
    id: string;
    title: string;
    targetAmount: number;
    savedAmount: number;
    targetDate: string;
    status: string;
  }>;
  goalsCount: number;
  itemsCount: number;
  user: {
    monthlyIncome: number | null;
    monthlySavings: number | null;
    monthlyExpenses: number | null;
    currency: string;
  } | null;
}

async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Failed to fetch dashboard");
  return res.json();
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });
}
