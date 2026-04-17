import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Library,
  CircleDashed,
  Heart,
  Coins,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/queries/dashboard";
import { StatCard } from "@/components/takobon/dashboard/stat-card";
import { RecentlyAdded } from "@/components/takobon/dashboard/recently-added";
import { EmptyCollection } from "@/components/takobon/dashboard/empty-collection";

export const metadata: Metadata = { title: "Dashboard — Takobon" };

function formatEur(value: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const stats = await getDashboardStats(user.id);
  const isEmpty = stats.totalOwned === 0;

  return (
    <div className="min-h-dvh pb-24">
      {/* Subtle top glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-700/8 rounded-full blur-[100px]" />

      <div className="relative space-y-8 pt-8">
        {/* Header */}
        <div className="px-4 space-y-0.5">
          <p className="text-xs uppercase tracking-widest text-text-tertiary font-medium">
            Il tuo archivio
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Collezione
          </h1>
        </div>

        {isEmpty ? (
          <EmptyCollection />
        ) : (
          <>
            {/* Stats grid */}
            <div className="px-4 space-y-3">
              {/* Collection value — gold, full width */}
              <StatCard
                label="Valore stimato"
                value={formatEur(stats.estimatedValue)}
                icon={Coins}
                variant="gold"
              />

              {/* 2-column grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Posseduti"
                  value={stats.totalOwned}
                  icon={BookOpen}
                  variant="owned"
                />
                <StatCard
                  label="Serie seguite"
                  value={stats.totalSeries}
                  icon={Library}
                  variant="default"
                />
                <StatCard
                  label="Mancanti"
                  value={stats.totalMissing}
                  icon={CircleDashed}
                  variant="missing"
                />
                <StatCard
                  label="Wishlist"
                  value={stats.totalWished}
                  icon={Heart}
                  variant="wished"
                />
              </div>
            </div>

            {/* Recently added */}
            <RecentlyAdded items={stats.recentlyAdded} />
          </>
        )}
      </div>
    </div>
  );
}
