"use client";

import { useTransition, useState } from "react";
import { Check, Heart, Circle, Trash2, Loader2, ChevronDown } from "lucide-react";
import { setAllItemsStatus, type ItemStatus } from "@/app/actions/collection";
import { cn } from "@/lib/utils";

type Props = {
  seriesId: string;
  itemType: "issue" | "volume";
  itemIds: string[];
  seriesSlug: string;
};

const actions: { status: ItemStatus | null; label: string; icon: typeof Check; style: string }[] = [
  { status: "owned",   label: "Tutti posseduti", icon: Check,  style: "text-state-owned  hover:bg-state-owned/10  hover:border-state-owned/30"  },
  { status: "wished",  label: "Tutti wishlist",  icon: Heart,  style: "text-state-wished hover:bg-state-wished/10 hover:border-state-wished/30" },
  { status: "missing", label: "Tutti mancanti",  icon: Circle, style: "text-state-missing hover:bg-state-missing/10 hover:border-state-missing/30" },
  { status: null,      label: "Rimuovi tutti",   icon: Trash2, style: "text-text-tertiary hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400" },
];

export function BulkStatusBar({ seriesId, itemType, itemIds, seriesSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handle(status: ItemStatus | null) {
    setOpen(false);
    startTransition(async () => {
      await setAllItemsStatus(seriesId, itemType, itemIds, status, seriesSlug);
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className={cn(
          "flex items-center gap-1.5 h-8 px-3 rounded-xl border border-border-subtle text-xs text-text-tertiary",
          "hover:text-text-secondary hover:border-border-default transition-colors cursor-pointer",
          isPending && "opacity-50"
        )}
      >
        {isPending
          ? <Loader2 className="size-3.5 animate-spin" />
          : <ChevronDown className={cn("size-3.5 transition-transform duration-150", open && "rotate-180")} strokeWidth={1.5} />
        }
        Azioni rapide
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 w-48 rounded-2xl border border-border-default bg-bg-surface shadow-xl shadow-black/30 overflow-hidden">
            {actions.map(({ status, label, icon: Icon, style }) => (
              <button
                key={String(status)}
                onClick={() => handle(status)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm border border-transparent transition-all duration-150 cursor-pointer",
                  style,
                  status === null && "border-t border-border-subtle mt-1"
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
