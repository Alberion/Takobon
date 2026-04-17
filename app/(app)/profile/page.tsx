import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/queries/dashboard";
import { computeBadges, getCollectorLevel } from "@/lib/badges";
import { LevelCard } from "@/components/takobon/profile/level-card";
import { BadgeGrid } from "@/components/takobon/profile/badge-grid";
import { ProfileSettings } from "@/components/takobon/profile/profile-settings";
import { logout } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Profilo — Takobon" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [stats, profileRow] = await Promise.all([
    getDashboardStats(user.id),
    supabase.from("users").select("username").eq("id", user.id).single(),
  ]);

  const username = profileRow.data?.username ?? null;
  const level = getCollectorLevel(stats.totalOwned);
  const badges = computeBadges(stats);
  const earnedCount = badges.filter((b) => b.earned).length;

  const joinedDate = new Date(user.created_at).toLocaleDateString("it-IT", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-dvh pb-24">

      {/* Tokyo neon hero header */}
      <div className="relative overflow-hidden px-4 pt-12 pb-8">
        {/* Neon glow blobs */}
        <div className="absolute top-0 left-1/4 w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-4 right-1/4 w-36 h-36 rounded-full bg-violet-600/15 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-cyan-600/10 blur-2xl pointer-events-none" />

        {/* Avatar with neon ring */}
        <div className="relative flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 blur-md opacity-60 scale-110" />
            <div className="relative w-20 h-20 rounded-full bg-bg-elevated border-2 border-indigo-500/50 flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.4)]">
              <span className="text-3xl font-bold text-indigo-300 select-none">
                {(username ?? user.email ?? "?")[0].toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Name + meta */}
        <div className="text-center space-y-0.5">
          {username && (
            <h1 className="text-xl font-semibold text-text-primary">{username}</h1>
          )}
          <p className="text-sm text-text-tertiary">{user.email}</p>
          <p className="text-xs text-text-tertiary">Collezionista dal {joinedDate}</p>
        </div>
      </div>

      <div className="px-4 space-y-4">

        {/* Level */}
        <LevelCard level={level} totalOwned={stats.totalOwned} />

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Albi",      value: stats.totalOwned,  glow: "shadow-[0_0_8px_rgba(99,102,241,0.3)]"  },
            { label: "Serie",     value: stats.totalSeries, glow: "shadow-[0_0_8px_rgba(139,92,246,0.25)]" },
            { label: "Wishlist",  value: stats.totalWished, glow: "" },
            { label: "Obiettivi", value: earnedCount,        glow: "shadow-[0_0_8px_rgba(245,158,11,0.2)]"  },
          ].map(({ label, value, glow }) => (
            <div key={label} className={`takobon-card py-3 flex flex-col items-center gap-0.5 ${glow}`}>
              <span className="font-mono text-lg font-semibold text-text-primary tabular-nums">{value}</span>
              <span className="text-[9px] text-text-tertiary uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>

        {/* Pokédex badges */}
        <BadgeGrid badges={badges} />

        {/* Settings */}
        <ProfileSettings currentEmail={user.email ?? ""} />

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-border-default text-text-secondary hover:text-semantic-error hover:border-semantic-error/40 transition-colors text-sm font-medium"
          >
            <LogOut className="size-4" strokeWidth={1.5} />
            Esci
          </button>
        </form>
      </div>
    </div>
  );
}
