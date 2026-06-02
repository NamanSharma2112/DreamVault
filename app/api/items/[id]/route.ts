import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { itemUpdateSchema } from "@/lib/validations";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: item, error } = await supabase
    .from("items")
    .select(`*, goal:goals(id, title)`)
    .eq("id", params.id)
    .eq("userId", user.id)
    .single();

  if (error || !item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...item,
    goal: Array.isArray(item.goal) ? item.goal[0] : item.goal
  });
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = itemUpdateSchema.parse(body);

    const { data: item, error } = await supabase
      .from("items")
      .update({
        ...validated,
        targetDate: validated.targetDate ? new Date(validated.targetDate).toISOString() : null,
        goalId: validated.goalId || null,
        sourceUrl: validated.sourceUrl || null,
        imageUrl: validated.imageUrl || null,
      })
      .eq("id", params.id)
      .eq("userId", user.id)
      .select(`*, goal:goals(id, title)`)
      .single();

    if (error) throw error;
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    return NextResponse.json({
      ...item,
      goal: Array.isArray(item.goal) ? item.goal[0] : item.goal
    });
  } catch (error: any) {
    console.error("Update item error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", params.id)
    .eq("userId", user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
