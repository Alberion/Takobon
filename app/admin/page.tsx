import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UpcomingReleaseForm } from "@/components/takobon/admin/upcoming-release-form";
import { SeriesForm } from "@/components/takobon/admin/series-form";
import { UpcomingReleaseList } from "@/components/takobon/admin/upcoming-release-list";

export const metadata: Metadata = { title: "Admin — Takobon" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect("/dashboard");

  const [{ data: upcoming }, { data: publishers }, { data: series }] = await Promise.all([
    supabase
      .from("upcoming_releases")
      .select("id, item_type, item_id, expected_date_it, is_confirmed, source_url")
      .order("expected_date_it", { ascending: true }),
    supabase.from("publishers").select("id, name, slug").order("name"),
    supabase.from("series").select("id, title, title_it, slug, type").eq("is_verified", true).order("title").limit(200),
  ]);

  // Enrich upcoming with item titles
  const enriched = await Promise.all((upcoming ?? []).map(async (u) => {
    const table = u.item_type === "volume" ? "volumes" : "issues";
    const { data: item } = await supabase
      .from(table)
      .select("number, title, series:series_id(title_it, title)")
      .eq("id", u.item_id)
      .single();
    return { ...u, item };
  }));

  return (
    <main className="min-h-screen px-4 py-8 bg-background pb-24">
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Admin</h1>

        {/* Upcoming releases */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-text-tertiary font-medium">Prossime uscite</h2>
          <UpcomingReleaseForm series={series ?? []} />
          <UpcomingReleaseList items={enriched} />
        </section>

        {/* Add series */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-text-tertiary font-medium">Aggiungi serie</h2>
          <SeriesForm publishers={publishers ?? []} />
        </section>
      </div>
    </main>
  );
}
