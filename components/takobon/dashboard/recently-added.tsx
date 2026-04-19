import Link from "next/link";
import { type RecentItem } from "@/lib/queries/dashboard";
import { CoverImage } from "@/components/takobon/shared/cover-image";

type Props = {
  items: RecentItem[];
};

export function RecentlyAdded({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-sm uppercase tracking-widest text-text-tertiary font-medium px-4">
        Aggiunti di recente
      </h2>
      <div className="grid grid-cols-3 gap-3 px-4 sm:grid-cols-4 md:grid-cols-6">
        {items.map((item) => (
          <CoverCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function CoverCard({ item }: { item: RecentItem }) {
  const href = item.series_title
    ? `/series/${encodeURIComponent(item.series_title.toLowerCase().replace(/\s+/g, "-"))}/${item.item_type}/${item.item_id}`
    : "#";

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-bg-elevated border border-border-default takobon-card-hover">
        <CoverImage
          src={item.cover_url}
          alt={item.series_title ?? item.title ?? `#${item.number}`}
          sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        {/* Scrim with title */}
        <div className="cover-scrim absolute inset-0 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="font-mono text-[10px] text-white leading-tight line-clamp-2">
            {item.title ?? `#${item.number}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
