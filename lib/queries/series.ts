import { createClient } from "@/lib/supabase/server";

export type SeriesDetail = {
  id: string;
  title: string;
  title_it: string | null;
  type: string;
  status: string;
  start_year: number | null;
  cover_url: string | null;
  slug: string;
  description_it: string | null;
  genre: string[];
  publisher: { name: string } | null;
};

export type IssueRow = {
  id: string;
  number: number;
  title: string | null;
  cover_url: string | null;
  cover_price_eur: number | null;
  release_date_it: string | null;
  userStatus: "owned" | "wished" | "missing" | null;
};

export type VolumeRow = IssueRow;

export async function getSeriesDetail(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: series } = await supabase
    .from("series")
    .select("id, title, title_it, type, status, start_year, cover_url, slug, description_it, genre, publisher:publisher_id(name)")
    .eq("slug", slug)
    .single();

  if (!series) return null;

  const isFollowing = user
    ? !!(await supabase
        .from("user_series_follows")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("series_id", series.id)
        .single()).data
    : false;

  // Fetch items
  const itemTable = series.type === "manga" || series.type === "graphic_novel" ? "volumes" : "issues";
  const { data: items } = await supabase
    .from(itemTable)
    .select("id, number, title, cover_url, cover_price_eur, release_date_it")
    .eq("series_id", series.id)
    .order("number");

  // Fetch user statuses for this series' items
  let statusMap = new Map<string, "owned" | "wished" | "missing">();
  if (user && items && items.length > 0) {
    const ids = items.map((i: any) => i.id);
    const { data: userItems } = await supabase
      .from("user_collection_items")
      .select("item_id, status")
      .eq("user_id", user.id)
      .eq("item_type", itemTable === "volumes" ? "volume" : "issue")
      .in("item_id", ids);

    statusMap = new Map(
      (userItems ?? []).map((u: any) => [u.item_id, u.status])
    );
  }

  const rows: IssueRow[] = (items ?? []).map((item: any) => ({
    id: item.id,
    number: item.number,
    title: item.title,
    cover_url: item.cover_url,
    cover_price_eur: item.cover_price_eur,
    release_date_it: item.release_date_it,
    userStatus: statusMap.get(item.id) ?? null,
  }));

  return {
    series: series as unknown as SeriesDetail,
    isFollowing,
    itemType: itemTable === "volumes" ? "volume" : "issue" as "issue" | "volume",
    items: rows,
  };
}
