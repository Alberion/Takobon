"use client";

import { useTransition } from "react";
import { Trash2, CheckCircle2, Clock } from "lucide-react";
import { deleteUpcomingRelease } from "@/app/actions/admin";

type Item = {
  id: string;
  item_type: string;
  expected_date_it: string | null;
  is_confirmed: boolean;
  source_url: string | null;
  item: any;
};

export function UpcomingReleaseList({ items }: { items: Item[] }) {
  const [isPending, startTransition] = useTransition();

  if (items.length === 0) {
    return <p className="text-xs text-text-tertiary px-1">Nessuna uscita programmata.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const seriesTitle = item.item?.series?.title_it ?? item.item?.series?.title ?? "—";
        const label = item.item ? `#${item.item.number}${item.item.title ? ` — ${item.item.title}` : ""}` : "—";

        return (
          <div key={item.id} className="takobon-card flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-tertiary truncate">{seriesTitle}</p>
              <p className="text-sm text-text-primary font-medium truncate">{label}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {item.expected_date_it && (
                  <span className="font-mono text-xs text-text-tertiary">
                    {new Date(item.expected_date_it).toLocaleDateString("it-IT")}
                  </span>
                )}
                {item.is_confirmed
                  ? <CheckCircle2 className="size-3 text-state-owned" strokeWidth={2} />
                  : <Clock className="size-3 text-text-tertiary" strokeWidth={1.5} />
                }
              </div>
            </div>
            <button
              onClick={() => startTransition(() => deleteUpcomingRelease(item.id))}
              disabled={isPending}
              className="text-text-tertiary hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
