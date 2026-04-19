"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ItemStatus = "owned" | "wished" | "missing";

export async function setItemStatus(
  itemType: "issue" | "volume",
  itemId: string,
  status: ItemStatus | null, // null = remove from collection
  seriesSlug: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non autenticato" };

  if (status === null) {
    await supabase
      .from("user_collection_items")
      .delete()
      .eq("user_id", user.id)
      .eq("item_type", itemType)
      .eq("item_id", itemId);
  } else {
    await supabase
      .from("user_collection_items")
      .upsert({
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
        status,
      }, { onConflict: "user_id,item_type,item_id" });

    // Auto-follow the series when adding to collection
    const { data: series } = await supabase
      .from("series")
      .select("id")
      .eq("slug", seriesSlug)
      .single();
    if (series) {
      await supabase
        .from("user_series_follows")
        .upsert({ user_id: user.id, series_id: series.id }, { onConflict: "user_id,series_id" });
    }
  }

  revalidatePath(`/series/${seriesSlug}`);
  revalidatePath("/dashboard");
  revalidatePath("/collection");
  revalidatePath("/collection/wishlist");
  revalidatePath("/collection/missing");
}

export async function setAllItemsStatus(
  seriesId: string,
  seriesSlug: string,
  status: ItemStatus | null,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non autenticato" };

  // Resolve item type and IDs from series
  const { data: series } = await supabase
    .from("series")
    .select("type")
    .eq("id", seriesId)
    .single();

  if (!series) return { error: "Serie non trovata" };

  const table = series.type === "manga" || series.type === "graphic_novel" ? "volumes" : "issues";
  const itemType = table === "volumes" ? "volume" : "issue";

  const { data: items } = await supabase
    .from(table)
    .select("id")
    .eq("series_id", seriesId);

  const itemIds = (items ?? []).map((i: { id: string }) => i.id);
  if (itemIds.length === 0) return { error: "Nessun volume trovato" };

  if (status === null) {
    await supabase
      .from("user_collection_items")
      .delete()
      .eq("user_id", user.id)
      .eq("item_type", itemType)
      .in("item_id", itemIds);
  } else {
    await supabase
      .from("user_collection_items")
      .upsert(
        itemIds.map((id) => ({ user_id: user.id, item_type: itemType, item_id: id, status })),
        { onConflict: "user_id,item_type,item_id" }
      );
    // Auto-follow the series
    await supabase
      .from("user_series_follows")
      .upsert({ user_id: user.id, series_id: seriesId }, { onConflict: "user_id,series_id" });
  }

  revalidatePath(`/series/${seriesSlug}`);
  revalidatePath("/dashboard");
  revalidatePath("/collection");
  revalidatePath("/collection/wishlist");
  revalidatePath("/collection/missing");
}

export async function updatePurchasePrice(
  itemType: "issue" | "volume",
  itemId: string,
  price: number | null,
  seriesSlug: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non autenticato" };

  await supabase
    .from("user_collection_items")
    .update({ purchase_price_eur: price })
    .eq("user_id", user.id)
    .eq("item_type", itemType)
    .eq("item_id", itemId);

  revalidatePath(`/series/${seriesSlug}`);
  revalidatePath("/collection");
  revalidatePath("/collection/wishlist");
}

export async function followSeries(seriesId: string, seriesSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non autenticato" };

  await supabase
    .from("user_series_follows")
    .upsert({ user_id: user.id, series_id: seriesId }, { onConflict: "user_id,series_id" });

  revalidatePath(`/series/${seriesSlug}`);
  revalidatePath("/dashboard");
}

export async function unfollowSeries(seriesId: string, seriesSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non autenticato" };

  await supabase
    .from("user_series_follows")
    .delete()
    .eq("user_id", user.id)
    .eq("series_id", seriesId);

  revalidatePath(`/series/${seriesSlug}`);
  revalidatePath("/dashboard");
}
