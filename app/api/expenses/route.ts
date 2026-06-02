import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { expenseCreateSchema } from "@/lib/validations";

export async function GET() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("userId", user.id)
    .order("expenseDate", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(expenses || []);
}

export async function POST(request: Request) {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = expenseCreateSchema.parse(body);

    const { data: expense, error } = await supabase
      .from("expenses")
      .insert({
        ...validated,
        expenseDate: new Date(validated.expenseDate).toISOString(),
        userId: user.id,
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    console.error("Create expense error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
