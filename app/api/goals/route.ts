import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { goalCreateSchema } from "@/lib/validations";

export async function GET() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: goals, error } = await supabase
    .from("goals")
    .select(`*, items(id, title, price, savedAmount, status, imageUrl)`)
    .eq("userId", user.id)
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(goals || []);
}

export async function POST(request: Request) {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = goalCreateSchema.parse(body);

    const { data: goal, error } = await supabase
      .from("goals")
      .insert({
        ...validated,
        targetDate: new Date(validated.targetDate).toISOString(),
        imageUrl: validated.imageUrl || null,
        userId: user.id,
      })
      .select(`*, items(id, title, price, savedAmount, status)`)
      .single();

    if (error) throw error;

    return NextResponse.json(goal, { status: 201 });
  } catch (error: any) {
    console.error("Create goal error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
