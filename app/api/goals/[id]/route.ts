import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { goalUpdateSchema } from "@/lib/validations";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: goal, error } = await supabase
    .from("goals")
    .select(`*, items(id, title, price, savedAmount, status, imageUrl)`)
    .eq("id", params.id)
    .eq("userId", user.id)
    .single();

  if (error || !goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  return NextResponse.json(goal);
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
    const validated = goalUpdateSchema.parse(body);

    const { data: goal, error } = await supabase
      .from("goals")
      .update({
        ...validated,
        ...(validated.targetDate ? { targetDate: new Date(validated.targetDate).toISOString() } : {}),
        imageUrl: validated.imageUrl || null,
      })
      .eq("id", params.id)
      .eq("userId", user.id)
      .select(`*, items(id, title, price, savedAmount, status)`)
      .single();

    if (error) throw error;
    if (!goal) return NextResponse.json({ error: "Goal not found" }, { status: 404 });

    return NextResponse.json(goal);
  } catch (error: any) {
    console.error("Update goal error:", error);
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

  // Unlink items first to mimic Prisma's SET NULL behavior manually
  await supabase
    .from("items")
    .update({ goalId: null })
    .eq("goalId", params.id)
    .eq("userId", user.id);

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", params.id)
    .eq("userId", user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
