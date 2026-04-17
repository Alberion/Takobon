import { createClient } from "@/lib/supabase/server";

export type UpcomingItem = {
  id: string;
  item_type: "issue" | "volume";
  item_id: string;
  expected_date_it: string | null;
  is_confirmed: boolean;
  source_url: string | null;
  title: string | null;
  number: number | null;
  cover_url: string | null;
  series: {
    id: string;
    title: string;
    title_it: string | null;
    slug: string;
    cover_url: string | null;
  } | null;
};

export async function getUpcomingReleases(): Promise<UpcomingItem[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("upcoming_releases")
    .select("id, item_type, item_id, expected_date_it, is_confirmed, source_url")
    .order("expected_date_it", { ascending: true })
    .limit(50);

  if (!data || data.length === 0) return [];

  const issueIds = data.filter((r) => r.item_type === "issue").map((r) => r.item_id);
  const volumeIds = data.filter((r) => r.item_type === "volume").map((r) => r.item_id);

  const [issuesRes, volumesRes] = await Promise.all([
    issueIds.length > 0
      ? supabase.from("issues").select("id, title, number, cover_url, series:series_id(id, title, title_it, slug, cover_url)").in("id", issueIds)
      : Promise.resolve({ data: [] }),
    volumeIds.length > 0
      ? supabase.from("volumes").select("id, title, number, cover_url, series:series_id(id, title, title_it, slug, cover_url)").in("id", volumeIds)
      : Promise.resolve({ data: [] }),
  ]);

  const issueMap = new Map((issuesRes.data ?? []).map((i: any) => [i.id, i]));
  const volumeMap = new Map((volumesRes.data ?? []).map((v: any) => [v.id, v]));

  return data.map((r) => {
    const item = r.item_type === "issue" ? issueMap.get(r.item_id) : volumeMap.get(r.item_id);
    return {
      ...r,
      title: item?.title ?? null,
      number: item?.number ?? null,
      cover_url: item?.cover_url ?? null,
      series: item?.series ?? null,
    };
  });
}
