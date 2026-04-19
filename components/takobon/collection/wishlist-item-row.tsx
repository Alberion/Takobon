import Link from "next/link";
import { type WishlistEntry } from "@/lib/queries/collection";
import { CoverImage } from "@/components/takobon/shared/cover-image";

export function WishlistItemRow({ entry }: { entry: WishlistEntry }) {
  const { detail, estimatedPrice } = entry;
  const series = detail.series;
  const displaySeries = series.title_it ?? series.title;
  const href = `/series/${series.slug}/${entry.item_type}/${entry.item_id}`;

  return (
    <Link href={href} className="group block">
      <div className="takobon-card takobon-card-hover flex items-center gap-3 px-4 py-3">
        {/* Mini cover */}
        <div className="relative w-10 h-14 shrink-0 rounded-lg overflow-hidden bg-bg-elevated border border-border-subtle">
          <CoverImage src={detail.cover_url} alt={`${detail.series?.title ?? ""} #${detail.number}`} sizes="40px" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-xs text-text-tertiary truncate">{displaySeries}</p>
          <p className="text-sm text-text-primary font-medium truncate">
            {detail.title ?? `${entry.item_type === "volume" ? "Vol." : "N."} ${detail.number}`}
          </p>
          <p className="font-mono text-xs text-text-tertiary">
            #{String(detail.number).padStart(3, "0")}
          </p>
        </div>

        {/* Price */}
        {estimatedPrice > 0 && (
          <span className="font-mono text-xs text-gold-400 shrink-0">
            €{estimatedPrice.toFixed(2)}
          </span>
        )}
      </div>
    </Link>
  );
}
