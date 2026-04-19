import Link from "next/link";
import { type MissingGroup } from "@/lib/queries/collection";
import { CoverImage } from "@/components/takobon/shared/cover-image";
import { cn } from "@/lib/utils";

export function MissingGroupCard({ group }: { group: MissingGroup }) {
  const { series, items } = group;
  const displayTitle = series.title_it ?? series.title;

  return (
    <div className="takobon-card overflow-hidden">
      {/* Series header */}
      <Link href={`/series/${series.slug}`} className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle hover:bg-bg-subtle/50 transition-colors group">
        <div className="relative w-8 h-12 shrink-0 rounded-md overflow-hidden bg-bg-elevated border border-border-subtle">
          <CoverImage src={series.cover_url} alt={displayTitle} sizes="32px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate group-hover:text-indigo-300 transition-colors">
            {displayTitle}
          </p>
          <p className="text-xs text-text-tertiary">
            {items.length} {items.length === 1 ? "numero mancante" : "numeri mancanti"}
          </p>
        </div>
      </Link>

      {/* Missing items as number chips */}
      <div className="px-4 py-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/series/${series.slug}`}
            title={item.title ?? `#${item.number}`}
            className={cn(
              "inline-flex items-center font-mono text-xs px-2.5 py-1 rounded-lg border transition-all duration-150",
              "bg-state-missing/10 border-state-missing/30 text-state-missing hover:bg-state-missing/20"
            )}
          >
            #{String(item.number).padStart(3, "0")}
          </Link>
        ))}
      </div>
    </div>
  );
}
