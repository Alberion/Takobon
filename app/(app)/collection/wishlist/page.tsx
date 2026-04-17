import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search, Coins } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getWishlist } from "@/lib/queries/collection";
import { CollectionTabs } from "@/components/takobon/collection/collection-tabs";
import { WishlistItemRow } from "@/components/takobon/collection/wishlist-item-row";

export const metadata: Metadata = { title: "Wishlist — Takobon" };

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const items = await getWishlist(user.id);
  const totalValue = items.reduce((sum, i) => sum + i.estimatedPrice, 0);
  const isEmpty = items.length === 0;

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
          <p className="text-text-secondary text-sm">La tua wishlist è vuota.</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Search className="size-4" strokeWidth={1.5} />
            Esplora le serie
          </Link>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {/* Value summary */}
          {totalValue > 0 && (
            <div className="takobon-gold-surface rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="size-4 text-gold-400" strokeWidth={1.5} />
                <span className="text-xs text-gold-300 uppercase tracking-widest font-medium">Valore stimato wishlist</span>
              </div>
              <span className="font-mono text-sm font-semibold text-gold-400">
                {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(totalValue)}
              </span>
            </div>
          )}

          <p className="text-xs text-text-tertiary">{items.length} {items.length === 1 ? "elemento" : "elementi"}</p>

          <div className="space-y-2">
            {items.map((entry) => (
              <WishlistItemRow key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
