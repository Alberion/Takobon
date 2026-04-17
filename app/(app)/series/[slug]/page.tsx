import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { getSeriesDetail } from "@/lib/queries/series";
import { ItemStatusSelector } from "@/components/takobon/series/item-status-selector";
import { FollowButton } from "@/components/takobon/series/follow-button";
import { PageHeader } from "@/components/takobon/nav/page-header";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} — Takobon` };
}

const typeLabel: Record<string, string> = {
  comic: "Fumetto", manga: "Manga", graphic_novel: "Graphic Novel", bd: "BD",
};

const statusLabel: Record<string, string> = {
  ongoing: "In corso", completed: "Completa", cancelled: "Cancellata",
};

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;
  const data = await getSeriesDetail(slug);
  if (!data) notFound();

  const { series, isFollowing, itemType, items } = data;
  const displayTitle = series.title_it ?? series.title;
  const owned = items.filter((i) => i.userStatus === "owned").length;
  const total = items.length;

  return (
    <div className="min-h-dvh pb-24">
      <PageHeader transparent />

      {/* Hero */}
      <div className="relative">
        {/* Blurred background from cover */}
        {series.cover_url && (
          <div className="absolute inset-0 overflow-hidden">
            <Image src={series.cover_url} alt="" fill className="object-cover scale-110 blur-2xl opacity-20" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>
        )}

        <div className="relative px-4 pt-8 pb-6 flex gap-4">
          {/* Cover */}
          <div className="relative w-24 h-36 shrink-0 rounded-xl overflow-hidden border border-border-default shadow-xl shadow-black/40">
            {series.cover_url ? (
              <Image src={series.cover_url} alt={displayTitle} fill className="object-cover" sizes="96px" />
            ) : (
              <div className="absolute inset-0 bg-bg-elevated flex items-center justify-center">
                <BookOpen className="size-8 text-text-tertiary" strokeWidth={1} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-2 pt-1">
            <div>
              <p className="text-xs text-text-tertiary uppercase tracking-widest">
                {series.publisher?.name}
              </p>
              <h1 className="text-xl font-semibold text-text-primary leading-tight mt-0.5">
                {displayTitle}
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-tertiary flex-wrap">
              <span>{typeLabel[series.type] ?? series.type}</span>
              <span className="opacity-40">·</span>
              <span>{statusLabel[series.status] ?? series.status}</span>
              {series.start_year && (
                <>
                  <span className="opacity-40">·</span>
                  <span className="font-mono">{series.start_year}</span>
                </>
              )}
            </div>

            {total > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-tertiary">Completamento</span>
                  <span className="font-mono text-text-secondary">{owned}/{total}</span>
                </div>
                <div className="h-1 bg-bg-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: total > 0 ? `${(owned / total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            )}

            <FollowButton seriesId={series.id} seriesSlug={series.slug} isFollowing={isFollowing} />
          </div>
        </div>

        {/* Description */}
        {series.description_it && (
          <div className="relative px-4 pb-6">
            <p className="text-sm text-text-secondary leading-relaxed">{series.description_it}</p>
          </div>
        )}
      </div>

      {/* Items list */}
      <div className="px-4 space-y-1">
        <p className="text-xs uppercase tracking-widest text-text-tertiary font-medium pb-3">
          {itemType === "volume" ? "Volumi" : "Numeri"} · {total}
        </p>

        {items.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-text-secondary">Nessun numero disponibile ancora.</p>
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="takobon-card flex items-center gap-3 px-4 py-3"
          >
            {/* Mini cover */}
            <div className="relative w-8 h-12 shrink-0 rounded-md overflow-hidden bg-bg-elevated border border-border-subtle">
              {item.cover_url ? (
                <Image src={item.cover_url} alt={`#${item.number}`} fill className="object-cover" sizes="32px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-[8px] text-text-tertiary">#{item.number}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-text-tertiary shrink-0">
                  #{String(item.number).padStart(3, "0")}
                </span>
                <span className="text-sm text-text-primary truncate">
                  {item.title ?? `${itemType === "volume" ? "Volume" : "Numero"} ${item.number}`}
                </span>
              </div>
              {item.cover_price_eur && (
                <span className="font-mono text-xs text-text-tertiary">
                  € {item.cover_price_eur.toFixed(2)}
                </span>
              )}
            </div>

            {/* Status selector */}
            <ItemStatusSelector
              itemType={itemType}
              itemId={item.id}
              currentStatus={item.userStatus}
              seriesSlug={series.slug}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
