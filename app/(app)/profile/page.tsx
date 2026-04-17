import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profilo — Takobon" };

export default function ProfilePage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
        Profilo
      </h1>
      {/* TODO: UserStats, ActivitySummary, Settings */}
    </div>
  );
}
