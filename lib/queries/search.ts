import { createClient } from "@/lib/supabase/server";

export type SeriesResult = {
  id: string;
  title: string;
  title_it: string | null;
  type: string;
  status: string;
  start_year: number | null;
  cover_url: string | null;
  slug: string;
  genre: string[];
  publisher: { name: string } | null;
  owned: number;
  wished: number;
  missing: number;
};

async function enrichWithUserCounts(supabase: Awaited<ReturnType<typeof createClient>>, series: Omit<SeriesResult, "owned" | "wished" | "missing">[]): Promise<SeriesResult[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || series.length === 0) return series.map((s) => ({ ...s, owned: 0, wished: 0, missing: 0 }));

  const seriesIds = series.map((s) => s.id);

  // Fetch all collection items for these series in one query via volumes+issues
  const [{ data: volumes }, { data: issues }] = await Promise.all([
    supabase.from("volumes").select("id, series_id").in("series_id", seriesIds),
    supabase.from("issues").select("id, series_id").in("series_id", seriesIds),
  ]);

  const allItemIds = [...(volumes ?? []).map((v: any) => v.id), ...(issues ?? []).map((i: any) => i.id)];
  const itemToSeries = new Map<string, string>([
    ...(volumes ?? []).map((v: any) => [v.id, v.series_id] as [string, string]),
    ...(issues ?? []).map((i: any) => [i.id, i.series_id] as [string, string]),
  ]);

  const counts = new Map<string, { owned: number; wished: number; missing: number }>();
  for (const id of seriesIds) counts.set(id, { owned: 0, wished: 0, missing: 0 });

  if (allItemIds.length > 0) {
    const { data: userItems } = await supabase
      .from("user_collection_items")
      .select("item_id, status")
      .eq("user_id", user.id)
      .in("item_id", allItemIds);

    for (const item of userItems ?? []) {
      const sid = itemToSeries.get(item.item_id);
      if (!sid) continue;
      const c = counts.get(sid)!;
      if (item.status === "owned") c.owned++;
      else if (item.status === "wished") c.wished++;
      else if (item.status === "missing") c.missing++;
    }
  }

  return series.map((s) => ({ ...s, ...counts.get(s.id)! }));
}

export async function searchSeries(query: string): Promise<SeriesResult[]> {
  const supabase = await createClient();

  const base = supabase
    .from("series")
    .select("id, title, title_it, type, status, start_year, cover_url, slug, genre, publisher:publisher_id(name)")
    .eq("is_verified", true);

  const { data } = query.trim()
    ? await base.or(`title.ilike.%${query}%,title_it.ilike.%${query}%`).order("title").limit(40)
    : await base.order("title").limit(40);

  return enrichWithUserCounts(supabase, (data ?? []) as unknown as Omit<SeriesResult, "owned" | "wished" | "missing">[]);
}
