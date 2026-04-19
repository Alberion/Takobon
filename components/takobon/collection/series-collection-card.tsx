import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { type SeriesCollectionEntry } from "@/lib/queries/collection";
import { SeriesQuickActions } from "@/components/takobon/series/series-quick-actions";
import { cn } from "@/lib/utils";
import { HoloCard } from "./holo-card";
import { HoloCover } from "./holo-cover";

const typeLabel: Record<string, string> = {
  comic: "Fumetto", manga: "Manga", graphic_novel: "Graphic Novel", bd: "BD",
};

export function SeriesCollectionCard({ entry }: { entry: SeriesCollectionEntry }) {
  const { series, owned, wished, missing } = entry;
  const displayTitle = series.title_it ?? series.title;

  return (
    <Link href={`/series/${series.slug}`} className="group block">
      <HoloCard>
      <div className="takobon-card overflow-hidden">
        {/* Cover */}
        <HoloCover>
        <div className="relative aspect-[2/3] bg-bg-elevated">
          {series.cover_url ? (
            <Image
              src={series.cover_url}
              alt={displayTitle}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="size-8 text-text-tertiary" strokeWidth={1} />
            </div>
          )}

          {/* Scrim */}
          <div className="cover-scrim absolute inset-0 flex flex-col justify-end p-2.5">
            <p className="text-white text-xs font-medium leading-tight line-clamp-2">{displayTitle}</p>
            <p className="text-white/60 text-[10px] mt-0.5">{series.publisher?.name}</p>
          </div>

          {/* Type badge */}
          <div className="absolute top-2 left-2">
            <span className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded-md",
              series.type === "manga"
                ? "bg-indigo-500/80 text-white"
                : "bg-black/60 text-white/80"
            )}>
              {typeLabel[series.type] ?? series.type}
            </span>
          </div>
        </div>
        </HoloCover>

        {/* Stats row */}
        <div className="flex items-center justify-around py-2 px-2 border-t border-border-subtle">
          <Stat value={owned} color="text-state-owned" label="poss." />
          {wished > 0 && <Stat value={wished} color="text-state-wished" label="wish" />}
          {missing > 0 && <Stat value={missing} color="text-state-missing" label="manc." />}
        </div>

        {/* Quick actions */}
        <div className="px-2 pb-2">
          <SeriesQuickActions
            seriesId={series.id}
            seriesSlug={series.slug}
            owned={owned}
            wished={wished}
            missing={missing}
          />
        </div>
      </div>
      </HoloCard>
    </Link>
  );
}

function Stat({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={cn("font-mono text-sm font-semibold tabular-nums", color)}>{value}</span>
      <span className="text-[9px] text-text-tertiary uppercase tracking-wide">{label}</span>
    </div>
  );
}
