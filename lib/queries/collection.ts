import { createClient } from "@/lib/supabase/server";

// ─────────────────────────────────────────────
// Shared helper: fetch items + series data
// ─────────────────────────────────────────────

async function fetchItemsWithSeries(userId: string, status?: "owned" | "wished" | "missing") {
  const supabase = await createClient();

  const query = supabase
    .from("user_collection_items")
    .select("id, item_type, item_id, status, added_at, purchase_price_eur")
    .eq("user_id", userId);

  if (status) query.eq("status", status);

  const { data: items } = await query.order("added_at", { ascending: false });
  if (!items || items.length === 0) return [];

  const issueIds = items.filter((i) => i.item_type === "issue").map((i) => i.item_id);
  const volumeIds = items.filter((i) => i.item_type === "volume").map((i) => i.item_id);

  const [issuesRes, volumesRes] = await Promise.all([
    issueIds.length > 0
      ? supabase.from("issues").select("id, number, title, cover_url, cover_price_eur, series:series_id(id, title, title_it, slug, cover_url, type, publisher:publisher_id(name))").in("id", issueIds)
      : Promise.resolve({ data: [] }),
    volumeIds.length > 0
      ? supabase.from("volumes").select("id, number, title, cover_url, cover_price_eur, series:series_id(id, title, title_it, slug, cover_url, type, publisher:publisher_id(name))").in("id", volumeIds)
      : Promise.resolve({ data: [] }),
  ]);

  const issueMap = new Map((issuesRes.data ?? []).map((i: any) => [i.id, { ...i, itemType: "issue" as const }]));
  const volumeMap = new Map((volumesRes.data ?? []).map((v: any) => [v.id, { ...v, itemType: "volume" as const }]));

  return items.map((item) => {
    const detail = item.item_type === "issue" ? issueMap.get(item.item_id) : volumeMap.get(item.item_id);
    return detail ? { ...item, detail } : null;
  }).filter(Boolean) as EnrichedItem[];
}

export type EnrichedItem = {
  id: string;
  item_type: "issue" | "volume";
  item_id: string;
  status: "owned" | "wished" | "missing";
  added_at: string;
  purchase_price_eur: number | null;
  detail: {
    id: string;
    number: number;
    title: string | null;
    cover_url: string | null;
    cover_price_eur: number | null;
    itemType: "issue" | "volume";
    series: {
      id: string;
      title: string;
      title_it: string | null;
      slug: string;
      cover_url: string | null;
      type: string;
      publisher: { name: string } | null;
    };
  };
};

// ─────────────────────────────────────────────
// Collection Library
// ─────────────────────────────────────────────

export type SeriesCollectionEntry = {
  series: EnrichedItem["detail"]["series"];
  owned: number;
  wished: number;
  missing: number;
  lastAdded: string;
};

export async function getCollectionLibrary(userId: string): Promise<SeriesCollectionEntry[]> {
  const items = await fetchItemsWithSeries(userId);

  const map = new Map<string, SeriesCollectionEntry>();
  for (const item of items) {
    const s = item.detail.series;
    if (!map.has(s.id)) {
      map.set(s.id, { series: s, owned: 0, wished: 0, missing: 0, lastAdded: item.added_at });
    }
    const entry = map.get(s.id)!;
    if (item.status === "owned") entry.owned++;
    else if (item.status === "wished") entry.wished++;
    else if (item.status === "missing") entry.missing++;
    if (item.added_at > entry.lastAdded) entry.lastAdded = item.added_at;
  }

  return Array.from(map.values()).sort((a, b) => b.lastAdded.localeCompare(a.lastAdded));
}

// ─────────────────────────────────────────────
// Wishlist
// ─────────────────────────────────────────────

export type WishlistEntry = EnrichedItem & { estimatedPrice: number };

export async function getWishlist(userId: string): Promise<WishlistEntry[]> {
  const items = await fetchItemsWithSeries(userId, "wished");
  return items.map((item) => ({
    ...item,
    estimatedPrice: item.purchase_price_eur ?? item.detail.cover_price_eur ?? 0,
  }));
}

// ─────────────────────────────────────────────
// Missing Tracker
// ─────────────────────────────────────────────

export type MissingGroup = {
  series: EnrichedItem["detail"]["series"];
  items: { id: string; number: number; title: string | null; cover_url: string | null }[];
};

export async function getMissingItems(userId: string): Promise<MissingGroup[]> {
  const items = await fetchItemsWithSeries(userId, "missing");

  const map = new Map<string, MissingGroup>();
  for (const item of items) {
    const s = item.detail.series;
    if (!map.has(s.id)) map.set(s.id, { series: s, items: [] });
    map.get(s.id)!.items.push({
      id: item.detail.id,
      number: item.detail.number,
      title: item.detail.title,
      cover_url: item.detail.cover_url,
    });
  }

  for (const group of map.values()) {
    group.items.sort((a, b) => a.number - b.number);
  }

  return Array.from(map.values());
}
