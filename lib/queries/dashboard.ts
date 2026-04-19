import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalOwned: number;
  totalSeries: number;
  totalMissing: number;
  totalWished: number;
  estimatedValue: number;
  recentlyAdded: RecentItem[];
};

export type RecentItem = {
  id: string;
  item_type: "issue" | "volume";
  item_id: string;
  added_at: string;
  cover_url: string | null;
  title: string | null;
  series_title: string | null;
  number: number | null;
};

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createClient();

  const { data: counts } = await supabase
    .from("user_collection_items")
    .select("status, purchase_price_eur, item_id, item_type")
    .eq("user_id", userId);

  const items = counts ?? [];

  const totalOwned = items.filter((i) => i.status === "owned").length;
  const totalMissing = items.filter((i) => i.status === "missing").length;
  const totalWished = items.filter((i) => i.status === "wished").length;

  const { count: totalSeries } = await supabase
    .from("user_series_follows")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Estimated value: purchase_price if set, else cover_price from catalog
  const ownedItems = items.filter((i) => i.status === "owned");
  const ownedIssueIds = ownedItems.filter((i) => i.item_type === "issue").map((i) => i.item_id);
  const ownedVolumeIds = ownedItems.filter((i) => i.item_type === "volume").map((i) => i.item_id);

  const [issuesRes, volumesRes] = await Promise.all([
    ownedIssueIds.length > 0
      ? supabase.from("issues").select("id, cover_price_eur").in("id", ownedIssueIds)
      : Promise.resolve({ data: [] }),
    ownedVolumeIds.length > 0
      ? supabase.from("volumes").select("id, cover_price_eur").in("id", ownedVolumeIds)
      : Promise.resolve({ data: [] }),
  ]);

  const coverPrices = new Map<string, number>([
    ...(issuesRes.data ?? []).map((i: any) => [i.id, i.cover_price_eur ?? 0] as [string, number]),
    ...(volumesRes.data ?? []).map((v: any) => [v.id, v.cover_price_eur ?? 0] as [string, number]),
  ]);

  const estimatedValue = ownedItems.reduce((sum, i) => {
    const price = i.purchase_price_eur ?? coverPrices.get(i.item_id) ?? 0;
    return sum + price;
  }, 0);

  // Recently added owned items (last 12)
  const { data: recent } = await supabase
    .from("user_collection_items")
    .select("id, item_type, item_id, added_at")
    .eq("user_id", userId)
    .eq("status", "owned")
    .order("added_at", { ascending: false })
    .limit(12);

  const recentlyAdded: RecentItem[] = [];

  if (recent && recent.length > 0) {
    const issueIds = recent.filter((r) => r.item_type === "issue").map((r) => r.item_id);
    const volumeIds = recent.filter((r) => r.item_type === "volume").map((r) => r.item_id);

    const [issuesRes, volumesRes] = await Promise.all([
      issueIds.length > 0
        ? supabase
            .from("issues")
            .select("id, title, number, cover_url, series:series_id(title)")
            .in("id", issueIds)
        : Promise.resolve({ data: [] }),
      volumeIds.length > 0
        ? supabase
            .from("volumes")
            .select("id, title, number, cover_url, series:series_id(title)")
            .in("id", volumeIds)
        : Promise.resolve({ data: [] }),
    ]);

    const issueMap = new Map((issuesRes.data ?? []).map((i: any) => [i.id, i]));
    const volumeMap = new Map((volumesRes.data ?? []).map((v: any) => [v.id, v]));

    for (const r of recent) {
      const item = r.item_type === "issue" ? issueMap.get(r.item_id) : volumeMap.get(r.item_id);
      if (item) {
        recentlyAdded.push({
          id: r.id,
          item_type: r.item_type,
          item_id: r.item_id,
          added_at: r.added_at,
          cover_url: item.cover_url ?? null,
          title: item.title ?? null,
          series_title: (item.series as any)?.title ?? null,
          number: item.number ?? null,
        });
      }
    }
  }

  return {
    totalOwned,
    totalSeries: totalSeries ?? 0,
    totalMissing,
    totalWished,
    estimatedValue,
    recentlyAdded,
  };
}
