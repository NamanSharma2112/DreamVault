import { NextResponse } from "next/server";
import { scrapeUrl } from "@/lib/scraper";
import { z } from "zod";

const scrapeSchema = z.object({
  url: z.string().url("Invalid URL"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = scrapeSchema.parse(body);

    const data = await scrapeUrl(url);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Scrape error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }
    return NextResponse.json(
      {
        title: null,
        price: null,
        imageUrl: null,
        description: null,
        currency: null,
      },
      { status: 200 }
    );
  }
}
