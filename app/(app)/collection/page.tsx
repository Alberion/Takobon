import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCollectionLibrary } from "@/lib/queries/collection";
import { CollectionTabs } from "@/components/takobon/collection/collection-tabs";
import { SeriesCollectionCard } from "@/components/takobon/collection/series-collection-card";

export const metadata: Metadata = { title: "Collezione — Takobon" };

export default async function CollectionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const library = await getCollectionLibrary(user.id);
  const isEmpty = library.length === 0;

  return (
    <div className="min-h-dvh pb-24">
      {/* Header */}
      <div className="px-4 pt-8 pb-0">
        <p className="text-xs uppercase tracking-widest text-text-tertiary font-medium">Il tuo archivio</p>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary mt-0.5">Collezione</h1>
      </div>

      <CollectionTabs />

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4">
          <p className="text-text-secondary text-sm">Non hai ancora aggiunto nessuna serie.</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Search className="size-4" strokeWidth={1.5} />
            Cerca una serie
          </Link>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          <p className="text-xs text-text-tertiary">
            {library.length} {library.length === 1 ? "serie" : "serie"}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {library.map((entry) => (
              <SeriesCollectionCard key={entry.series.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
