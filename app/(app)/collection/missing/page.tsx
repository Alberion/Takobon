import type { Metadata } from "next";

export const metadata: Metadata = { title: "Numeri mancanti — Takobon" };

export default function MissingPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
        Numeri mancanti
      </h1>
      {/* TODO: MissingBySeriesList */}
    </div>
  );
}
