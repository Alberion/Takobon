import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/queries/dashboard";
import { computeBadges, getCollectorLevel } from "@/lib/badges";
import { LevelCard } from "@/components/takobon/profile/level-card";
import { BadgeGrid } from "@/components/takobon/profile/badge-grid";
import { logout } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Profilo — Takobon" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const stats = await getDashboardStats(user.id);
  const level = getCollectorLevel(stats.totalOwned);
  const badges = computeBadges(stats);
  const earnedCount = badges.filter((b) => b.earned).length;

  const joinedDate = new Date(user.created_at).toLocaleDateString("it-IT", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-dvh pb-24">
      {/* Header */}
      <div className="px-4 pt-8 pb-0">
        <p className="text-xs uppercase tracking-widest text-text-tertiary font-medium">Il tuo spazio</p>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary mt-0.5">Profilo</h1>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Identity card */}
        <div className="takobon-card px-5 py-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <User className="size-6 text-indigo-400" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user.email}</p>
            <p className="text-xs text-text-tertiary mt-0.5">Membro dal {joinedDate}</p>
          </div>
        </div>

        {/* Level */}
        <LevelCard level={level} totalOwned={stats.totalOwned} />

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Posseduti",  value: stats.totalOwned },
            { label: "Serie",      value: stats.totalSeries },
            { label: "Wishlist",   value: stats.totalWished },
            { label: "Obiettivi",  value: earnedCount },
          ].map(({ label, value }) => (
            <div key={label} className="takobon-card py-3 flex flex-col items-center gap-0.5">
              <span className="font-mono text-lg font-semibold text-text-primary tabular-nums">{value}</span>
              <span className="text-[9px] text-text-tertiary uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>

        {/* Badges */}
        <BadgeGrid badges={badges} />

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-border-default text-text-secondary hover:text-semantic-error hover:border-semantic-error/50 transition-colors text-sm font-medium"
          >
            <LogOut className="size-4" strokeWidth={1.5} />
            Esci
          </button>
        </form>
      </div>
    </div>
  );
}
