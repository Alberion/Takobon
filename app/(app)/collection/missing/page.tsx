import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMissingItems } from "@/lib/queries/collection";
import { CollectionTabs } from "@/components/takobon/collection/collection-tabs";
import { MissingGroupCard } from "@/components/takobon/collection/missing-group-card";

export const metadata: Metadata = { title: "Mancanti — Takobon" };

export default async function MissingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const groups = await getMissingItems(user.id);
  const totalMissing = groups.reduce((sum, g) => sum + g.items.length, 0);
  const isEmpty = groups.length === 0;

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
          <p className="text-text-secondary text-sm">Nessun numero mancante. Ottimo lavoro!</p>
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
            {totalMissing} {totalMissing === 1 ? "numero mancante" : "numeri mancanti"} in {groups.length} {groups.length === 1 ? "serie" : "serie"}
          </p>
          <div className="space-y-3">
            {groups.map((group) => (
              <MissingGroupCard key={group.series.id} group={group} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
