import Link from "next/link";
import Image from "next/image";
import { BookOpen, BookMarked } from "lucide-react";
import { type SeriesResult } from "@/lib/queries/search";
import { cn } from "@/lib/utils";

const typeLabel: Record<string, string> = {
  comic: "Fumetto",
  manga: "Manga",
  graphic_novel: "Graphic Novel",
  bd: "BD",
};

const statusDot: Record<string, string> = {
  ongoing: "bg-state-owned",
  completed: "bg-text-tertiary",
  cancelled: "bg-semantic-error",
};

type Props = { series: SeriesResult };

export function SeriesCard({ series }: Props) {
  const displayTitle = series.title_it ?? series.title;

  return (
    <Link href={`/series/${series.slug}`} className="group block">
      <div className="takobon-card takobon-card-hover flex gap-4 p-4">
        {/* Cover */}
        <div className="relative w-14 h-20 shrink-0 rounded-lg overflow-hidden bg-bg-elevated border border-border-subtle">
          {series.cover_url ? (
            <Image
              src={series.cover_url}
              alt={displayTitle}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="size-5 text-text-tertiary" strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-text-primary leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
              {displayTitle}
            </h3>
            <BookMarked className="size-4 text-text-tertiary shrink-0 mt-0.5 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-tertiary">
              {series.publisher?.name ?? "—"}
            </span>
            <span className="text-text-tertiary/40">·</span>
            <span className={cn(
              "inline-flex items-center gap-1.5 text-xs",
              series.type === "manga" ? "text-indigo-400" : "text-text-secondary"
            )}>
              {typeLabel[series.type] ?? series.type}
            </span>
            {series.start_year && (
              <>
                <span className="text-text-tertiary/40">·</span>
                <span className="font-mono text-xs text-text-tertiary">{series.start_year}</span>
              </>
            )}
          </div>

          {/* Status + genres */}
          <div className="flex items-center gap-2">
            <span className={cn("size-1.5 rounded-full shrink-0", statusDot[series.status] ?? "bg-text-tertiary")} />
            <span className="text-xs text-text-tertiary capitalize">{series.status === "ongoing" ? "In corso" : series.status === "completed" ? "Completa" : "Cancellata"}</span>
            {series.genre.slice(0, 2).map((g) => (
              <span key={g} className="text-xs text-text-tertiary bg-bg-subtle px-2 py-0.5 rounded-full">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
