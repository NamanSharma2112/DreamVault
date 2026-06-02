import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { itemCreateSchema } from "@/lib/validations";

export async function GET() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: items, error } = await supabase
    .from("items")
    .select(`*, goal:goals(id, title)`)
    .eq("userId", user.id)
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Supabase joins arrays for 1-to-1 relations in JS, we need to unwrap it
  const formattedItems = items?.map(item => ({
    ...item,
    goal: Array.isArray(item.goal) ? item.goal[0] : item.goal
  })) || [];

  return NextResponse.json(formattedItems);
}

export async function POST(request: Request) {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = itemCreateSchema.parse(body);

    const { data: item, error } = await supabase
      .from("items")
      .insert({
        ...validated,
        targetDate: validated.targetDate ? new Date(validated.targetDate).toISOString() : null,
        goalId: validated.goalId || null,
        sourceUrl: validated.sourceUrl || null,
        imageUrl: validated.imageUrl || null,
        userId: user.id,
      })
      .select(`*, goal:goals(id, title)`)
      .single();

    if (error) throw error;

    return NextResponse.json({
      ...item,
      goal: Array.isArray(item.goal) ? item.goal[0] : item.goal
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create item error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
