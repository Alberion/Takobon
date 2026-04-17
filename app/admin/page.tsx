import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Takobon" };

export default function AdminPage() {
  return (
    <main className="min-h-screen px-4 py-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Admin
        </h1>
        {/* TODO: SeriesManager, UpcomingReleasesManager */}
      </div>
    </main>
  );
}
