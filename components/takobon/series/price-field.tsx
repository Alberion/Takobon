"use client";

import { useState, useTransition } from "react";
import { PencilLine, Check, X } from "lucide-react";
import { updatePurchasePrice } from "@/app/actions/collection";
import { cn } from "@/lib/utils";

type Props = {
  itemType: "issue" | "volume";
  itemId: string;
  seriesSlug: string;
  coverPrice: number | null;
  initialPrice: number | null;
};

export function PriceField({ itemType, itemId, seriesSlug, coverPrice, initialPrice }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialPrice != null ? String(initialPrice) : "");
  const [saved, setSaved] = useState(initialPrice);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const parsed = value === "" ? null : parseFloat(value.replace(",", "."));
    if (parsed !== null && (isNaN(parsed) || parsed < 0)) return;
    startTransition(async () => {
      await updatePurchasePrice(itemType, itemId, parsed, seriesSlug);
      setSaved(parsed);
      setEditing(false);
    });
  }

  function handleCancel() {
    setValue(saved != null ? String(saved) : "");
    setEditing(false);
  }

  return (
    <div className="takobon-card px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-widest text-text-tertiary">Prezzo pagato</p>
          {!editing && (
            <p className="font-mono text-sm text-text-primary">
              {saved != null
                ? new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(saved)
                : coverPrice != null
                  ? <span className="text-text-tertiary">
                      {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(coverPrice)}
                      <span className="text-[10px] ml-1">(copertina)</span>
                    </span>
                  : <span className="text-text-tertiary">—</span>
              }
            </p>
          )}
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <PencilLine className="size-3.5" strokeWidth={1.5} />
            Modifica
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-text-tertiary">€</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel(); }}
                autoFocus
                placeholder={coverPrice != null ? coverPrice.toFixed(2) : "0.00"}
                className={cn(
                  "w-24 pl-6 pr-2 py-1.5 text-xs font-mono rounded-lg border bg-bg-elevated text-text-primary",
                  "border-indigo-500/40 focus:outline-none focus:border-indigo-400",
                  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                )}
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center justify-center size-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-colors cursor-pointer"
            >
              <Check className="size-3.5" strokeWidth={2} />
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center justify-center size-7 rounded-lg border border-border-subtle text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
            >
              <X className="size-3.5" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
