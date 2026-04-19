import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Barcode, Tag } from "lucide-react";
import { getItemDetail } from "@/lib/queries/series";
import { ItemStatusSelector } from "@/components/takobon/series/item-status-selector";
import { PriceField } from "@/components/takobon/series/price-field";
import { PageHeader } from "@/components/takobon/nav/page-header";
import { CoverImage } from "@/components/takobon/shared/cover-image";

type Props = { params: Promise<{ slug: string; type: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, type, id } = await params;
  const item = await getItemDetail(slug, type as "issue" | "volume", id);
  if (!item) return { title: "Takobon" };
  const seriesTitle = item.series.title_it ?? item.series.title;
  const label = item.title ?? `${item.itemType === "volume" ? "Vol." : "N."} ${item.number}`;
  return { title: `${seriesTitle} — ${label} — Takobon` };
}

export default async function ItemPage({ params }: Props) {
  const { slug, type, id } = await params;

  if (type !== "issue" && type !== "volume") notFound();
  const item = await getItemDetail(slug, type, id);
  if (!item) notFound();

  const { series } = item;
  const displaySeries = series.title_it ?? series.title;
  const displayTitle = item.title ?? `${type === "volume" ? "Volume" : "Numero"} ${item.number}`;

  return (
    <div className="min-h-dvh pb-24">
      <PageHeader transparent />

      {/* Hero */}
      <div className="relative">
        {series.cover_url && (
          <div className="absolute inset-0 overflow-hidden">
            <Image src={series.cover_url} alt="" fill className="object-cover scale-110 blur-2xl opacity-15" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          </div>
        )}

        <div className="relative px-4 pt-8 pb-8 flex gap-5">
          {/* Cover */}
          <div className="relative w-28 h-[168px] shrink-0 rounded-xl overflow-hidden border border-border-default shadow-2xl shadow-black/50">
            <CoverImage src={item.cover_url ?? series.cover_url} alt={displayTitle} sizes="112px" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-3 pt-1">
            <div>
              <p className="text-xs text-indigo-400 uppercase tracking-widest font-medium truncate">
                {displaySeries}
              </p>
              <p className="text-text-tertiary font-mono text-xs mt-0.5">
                #{String(item.number).padStart(3, "0")}
              </p>
              <h1 className="text-lg font-semibold text-text-primary leading-tight mt-1">
                {displayTitle}
              </h1>
            </div>

            {/* Status selector */}
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-widest text-text-tertiary">Stato</p>
              <ItemStatusSelector
                itemType={item.itemType}
                itemId={item.id}
                currentStatus={item.userStatus}
                seriesSlug={series.slug}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 space-y-3">
        {/* Purchase price — only shown if owned */}
        {item.userStatus === "owned" && (
          <PriceField
            itemType={item.itemType}
            itemId={item.id}
            seriesSlug={series.slug}
            coverPrice={item.cover_price_eur}
            initialPrice={item.purchasePrice}
          />
        )}

        {/* Description */}
        {item.description && (
          <div className="takobon-card px-4 py-3 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-text-tertiary">Descrizione</p>
            <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="takobon-card divide-y divide-border-subtle overflow-hidden">
          {item.release_date_it && (
            <MetaRow icon={Calendar} label="Uscita IT" value={
              new Date(item.release_date_it).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })
            } />
          )}
          {item.cover_price_eur && (
            <MetaRow icon={Tag} label="Prezzo di copertina" value={
              new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(item.cover_price_eur)
            } />
          )}
          {item.isbn && (
            <MetaRow icon={Barcode} label="ISBN" value={item.isbn} mono />
          )}
          {series.publisher?.name && (
            <MetaRow icon={BookOpen} label="Editore" value={series.publisher.name} />
          )}
        </div>
      </div>
    </div>
  );
}

function MetaRow({ icon: Icon, label, value, mono }: {
  icon: typeof Calendar;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon className="size-4 text-text-tertiary shrink-0" strokeWidth={1.5} />
      <span className="text-xs text-text-tertiary flex-1">{label}</span>
      <span className={`text-xs text-text-primary ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
