import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";
import { type UpcomingItem } from "@/lib/queries/upcoming";
import { CoverImage } from "@/components/takobon/shared/cover-image";

export function UpcomingItemRow({ item }: { item: UpcomingItem }) {
  const seriesTitle = item.series?.title_it ?? item.series?.title ?? "Serie sconosciuta";
  const itemTitle = item.title ?? `#${item.number}`;
  const date = item.expected_date_it
    ? new Date(item.expected_date_it).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })
    : "Data da confermare";

  const href = item.series ? `/series/${item.series.slug}` : "#";

  return (
    <Link href={href} className="flex items-center gap-3 takobon-card px-4 py-3 hover:bg-bg-elevated/60 transition-colors group">
      {/* Cover */}
      <div className="relative w-10 h-14 shrink-0 rounded-lg overflow-hidden bg-bg-elevated border border-border-subtle">
        <CoverImage src={item.cover_url ?? item.series?.cover_url} alt={seriesTitle} sizes="40px" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate group-hover:text-indigo-300 transition-colors">
          {seriesTitle}
        </p>
        <p className="text-xs text-text-secondary truncate">{itemTitle}</p>
        <div className="flex items-center gap-1 mt-1">
          {item.is_confirmed
            ? <CheckCircle className="size-3 text-state-owned" strokeWidth={1.5} />
            : <Clock className="size-3 text-state-missing" strokeWidth={1.5} />
          }
          <span className={`text-[10px] ${item.is_confirmed ? "text-state-owned" : "text-state-missing"}`}>
            {date}
          </span>
        </div>
      </div>

      {/* Type badge */}
      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-bg-elevated border border-border-subtle text-text-tertiary shrink-0">
        {item.item_type === "issue" ? "Albo" : "Volume"}
      </span>
    </Link>
  );
}
