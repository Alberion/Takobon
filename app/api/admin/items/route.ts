import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const seriesId = searchParams.get("series_id");
  const table = searchParams.get("table") === "issues" ? "issues" : "volumes";

  if (!seriesId) return NextResponse.json([]);

  const supabase = await createClient();
  const { data } = await supabase
    .from(table)
    .select("id, number, title")
    .eq("series_id", seriesId)
    .order("number");

  return NextResponse.json(data ?? []);
}
