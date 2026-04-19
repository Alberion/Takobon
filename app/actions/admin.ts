"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Non autorizzato");
  }
  return supabase;
}

export async function addUpcomingRelease(formData: FormData) {
  const supabase = await requireAdmin();

  const itemType = formData.get("item_type") as "issue" | "volume";
  const itemId = formData.get("item_id") as string;
  const expectedDate = formData.get("expected_date") as string;
  const isConfirmed = formData.get("is_confirmed") === "true";
  const sourceUrl = formData.get("source_url") as string;

  const { error } = await supabase.from("upcoming_releases").insert({
    item_type: itemType,
    item_id: itemId,
    expected_date_it: expectedDate || null,
    is_confirmed: isConfirmed,
    source_url: sourceUrl || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/upcoming");
  return { success: true };
}

export async function deleteUpcomingRelease(id: string) {
  const supabase = await requireAdmin();
  await supabase.from("upcoming_releases").delete().eq("id", id);
  revalidatePath("/upcoming");
}

export async function addSeries(formData: FormData) {
  const supabase = await requireAdmin();

  const slug = (formData.get("title") as string)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const publisherSlug = formData.get("publisher_slug") as string;
  const { data: publisher } = await supabase
    .from("publishers")
    .select("id")
    .eq("slug", publisherSlug)
    .single();

  const { error } = await supabase.from("series").insert({
    title: formData.get("title") as string,
    title_it: formData.get("title_it") as string || null,
    type: formData.get("type") as string,
    publisher_id: publisher?.id ?? null,
    description_it: formData.get("description_it") as string || null,
    status: formData.get("status") as string,
    start_year: formData.get("start_year") ? Number(formData.get("start_year")) : null,
    cover_url: formData.get("cover_url") as string || null,
    slug,
    is_verified: true,
  });

  if (error) return { error: error.message };
  revalidatePath("/search");
  return { success: true, slug };
}
