import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — Takobon" };

export default function DashboardPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          La tua collezione
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Una panoramica del tuo archivio.
        </p>
      </div>
      {/* TODO: DashboardStats, RecentlyAdded, CollectionValue, GrowthChart */}
    </div>
  );
}
