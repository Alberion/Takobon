import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUpcomingReleases } from "@/lib/queries/upcoming";
import { UpcomingItemRow } from "@/components/takobon/upcoming/upcoming-item-row";

export const metadata: Metadata = { title: "In uscita — Takobon" };

export default async function UpcomingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const items = await getUpcomingReleases();
  const isEmpty = items.length === 0;

  // Group by month
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.expected_date_it
      ? new Date(item.expected_date_it).toLocaleDateString("it-IT", { month: "long", year: "numeric" })
      : "Data da confermare";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-dvh pb-24">
      {/* Header */}
      <div className="px-4 pt-8 pb-0">
        <p className="text-xs uppercase tracking-widest text-text-tertiary font-medium">Calendario</p>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary mt-0.5">In uscita</h1>
      </div>

      <div className="px-4 pt-5">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <p className="text-text-secondary text-sm">Nessuna uscita programmata al momento.</p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
            >
              <Search className="size-4" strokeWidth={1.5} />
              Esplora le serie
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([month, monthItems]) => (
              <div key={month} className="space-y-2">
                <h2 className="text-xs uppercase tracking-widest text-text-tertiary font-medium capitalize px-1">
                  {month}
                </h2>
                <div className="space-y-2">
                  {monthItems.map((item) => (
                    <UpcomingItemRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
