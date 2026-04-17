import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cerca — Takobon" };

export default function SearchPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
        Cerca
      </h1>
      {/* TODO: SearchInput, SearchResults, TypeFilter */}
    </div>
  );
}
