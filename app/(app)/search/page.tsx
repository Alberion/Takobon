import type { Metadata } from "next";
import { Suspense } from "react";
import { searchSeries } from "@/lib/queries/search";
import { SeriesCard } from "@/components/takobon/search/series-card";
import { SearchInput } from "@/components/takobon/search/search-input";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Cerca — Takobon" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = await searchSeries(q);

  return (
    <div className="min-h-dvh pb-24">
      {/* Sticky search bar */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border-subtle px-4 py-3">
        <Suspense>
          <SearchInput />
        </Suspense>
      </div>

      <div className="px-4 pt-4 space-y-2">
        {/* Result count */}
        {q && (
          <p className="text-xs text-text-tertiary pb-2">
            {results.length} {results.length === 1 ? "risultato" : "risultati"} per{" "}
            <span className="text-text-secondary">"{q}"</span>
          </p>
        )}

        {!q && (
          <p className="text-xs uppercase tracking-widest text-text-tertiary pb-2 font-medium">
            Tutte le serie
          </p>
        )}

        {results.length === 0 && q && (
          <div className="py-16 text-center space-y-2">
            <p className="text-text-secondary text-sm">Nessuna serie trovata per "{q}"</p>
            <p className="text-text-tertiary text-xs">
              Prova con un altro termine o{" "}
              <span className="text-indigo-400">aggiungi tu la serie</span>.
            </p>
          </div>
        )}

        {results.map((series) => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="space-y-2 px-4 pt-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="takobon-card flex gap-4 p-4">
          <Skeleton className="w-14 h-20 rounded-lg" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
