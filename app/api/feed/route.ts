import { NextResponse } from "next/server";
import { loadPortalFeed } from "@/lib/supabase";

export async function GET() {
  const payload = await loadPortalFeed();
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
    }
  });
}
