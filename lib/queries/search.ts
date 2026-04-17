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
};

export async function searchSeries(query: string): Promise<SeriesResult[]> {
  const supabase = await createClient();

  if (!query.trim()) {
    const { data } = await supabase
      .from("series")
      .select("id, title, title_it, type, status, start_year, cover_url, slug, genre, publisher:publisher_id(name)")
      .eq("is_verified", true)
      .order("title")
      .limit(40);
    return (data ?? []) as unknown as SeriesResult[];
  }

  const { data } = await supabase
    .from("series")
    .select("id, title, title_it, type, status, start_year, cover_url, slug, genre, publisher:publisher_id(name)")
    .eq("is_verified", true)
    .or(`title.ilike.%${query}%,title_it.ilike.%${query}%`)
    .order("title")
    .limit(40);

  return (data ?? []) as unknown as SeriesResult[];
}
