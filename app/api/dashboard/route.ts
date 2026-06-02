import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  const [{ data: items }, { data: goals }, { data: userData }] = await Promise.all([
    supabase.from("items").select("*").eq("userId", userId),
    supabase.from("goals").select("*, items(*)").eq("userId", userId),
    supabase.from("users").select("monthlyIncome, monthlySavings, monthlyExpenses, currency").eq("id", userId).single(),
  ]);

  const itemsList = items || [];
  const goalsList = goals || [];

  const totalWishlistValue = itemsList.reduce((sum, item) => sum + item.price, 0);
  const totalSaved = itemsList.reduce((sum, item) => sum + item.savedAmount, 0);

  const statusCounts = {
    PENDING: itemsList.filter((i) => i.status === "PENDING").length,
    SAVING: itemsList.filter((i) => i.status === "SAVING").length,
    PURCHASED: itemsList.filter((i) => i.status === "PURCHASED").length,
    CANCELLED: itemsList.filter((i) => i.status === "CANCELLED").length,
  };

  const priorityOrder = { DREAM: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const topItems = itemsList
    .filter((i) => i.status !== "PURCHASED" && i.status !== "CANCELLED")
    .sort((a, b) => (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3) - (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3))
    .slice(0, 5);

  const categoryBreakdown = itemsList.reduce((acc: any, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = { count: 0, totalValue: 0 };
    acc[cat].count++;
    acc[cat].totalValue += item.price;
    return acc;
  }, {});

  const now = new Date();
  const in90Days = new Date();
  in90Days.setDate(in90Days.getDate() + 90);

  const upcomingItems = itemsList
    .filter((i) => i.targetDate && new Date(i.targetDate) >= now && new Date(i.targetDate) <= in90Days && i.status !== "PURCHASED" && i.status !== "CANCELLED")
    .sort((a, b) => new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime());

  const activeGoals = goalsList.filter((g) => g.status === "ACTIVE");

  return NextResponse.json({
    totalWishlistValue,
    totalSaved,
    statusCounts,
    topItems,
    categoryBreakdown,
    upcomingItems,
    activeGoals,
    goalsCount: goalsList.length,
    itemsCount: itemsList.length,
    user: userData || null,
  });
}
