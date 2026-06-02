"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GoalCreateInput, GoalUpdateInput } from "@/lib/validations";

export interface GoalItem {
  id: string;
  title: string;
  price: number;
  savedAmount: number;
  status: string;
  imageUrl?: string | null;
}

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  goalType: string;
  status: string;
  imageUrl?: string | null;
  items: GoalItem[];
  createdAt: string;
  updatedAt: string;
}

async function fetchGoals(): Promise<Goal[]> {
  const res = await fetch("/api/goals");
  if (!res.ok) throw new Error("Failed to fetch goals");
  return res.json();
}

async function fetchGoal(id: string): Promise<Goal> {
  const res = await fetch(`/api/goals/${id}`);
  if (!res.ok) throw new Error("Failed to fetch goal");
  return res.json();
}

async function createGoal(data: GoalCreateInput): Promise<Goal> {
  const res = await fetch("/api/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create goal");
  return res.json();
}

async function updateGoal({
  id,
  data,
}: {
  id: string;
  data: GoalUpdateInput;
}): Promise<Goal> {
  const res = await fetch(`/api/goals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update goal");
  return res.json();
}

async function deleteGoal(id: string): Promise<void> {
  const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete goal");
}

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: fetchGoals,
  });
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: ["goals", id],
    queryFn: () => fetchGoal(id),
    enabled: !!id,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
