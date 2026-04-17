import type { Metadata } from "next";

export const metadata: Metadata = { title: "Collezione — Takobon" };

export default function CollectionPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
        La mia libreria
      </h1>
      {/* TODO: CollectionGrid, FilterBar */}
    </div>
  );
}
