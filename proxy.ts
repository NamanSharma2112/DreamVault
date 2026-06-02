import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Completely bypass authentication checks for local offline development
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
