"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ItemCreateInput, ItemUpdateInput } from "@/lib/validations";

export interface Item {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  imageUrl: string | null;
  sourceUrl: string | null;
  category: string;
  listType: string;
  priority: string;
  status: string;
  targetDate: string | null;
  savedAmount: number;
  notes: string | null;
  tags: string[];
  goalId: string | null;
  goal: { id: string; title: string } | null;
  createdAt: string;
  updatedAt: string;
}

async function fetchItems(): Promise<Item[]> {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

async function createItem(data: ItemCreateInput): Promise<Item> {
  const res = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
}

async function updateItem({
  id,
  data,
}: {
  id: string;
  data: ItemUpdateInput;
}): Promise<Item> {
  const res = await fetch(`/api/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}

async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete item");
}

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
