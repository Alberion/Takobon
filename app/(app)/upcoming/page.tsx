import type { Metadata } from "next";

export const metadata: Metadata = { title: "In uscita — Takobon" };

export default function UpcomingPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
        In uscita
      </h1>
      {/* TODO: UpcomingReleasesFeed */}
    </div>
  );
}
