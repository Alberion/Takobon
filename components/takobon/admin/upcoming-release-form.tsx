"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import { addUpcomingRelease } from "@/app/actions/admin";

type Series = { id: string; title: string; title_it: string | null; slug: string; type: string };

export function UpcomingReleaseForm({ series }: { series: Series[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [itemType, setItemType] = useState<"issue" | "volume">("volume");
  const [items, setItems] = useState<{ id: string; number: number; title: string | null }[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  async function loadItems(seriesId: string, type: "issue" | "volume") {
    if (!seriesId) { setItems([]); return; }
    setLoadingItems(true);
    const table = type === "volume" ? "volumes" : "issues";
    const res = await fetch(`/api/admin/items?series_id=${seriesId}&table=${table}`);
    const data = await res.json();
    setItems(data);
    setLoadingItems(false);
  }

  function handleSeriesChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedSeries(e.target.value);
    loadItems(e.target.value, itemType);
  }

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const t = e.target.value as "issue" | "volume";
    setItemType(t);
    loadItems(selectedSeries, t);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await addUpcomingRelease(fd);
      if (result?.error) setError(result.error);
      else { setSuccess(true); (e.target as HTMLFormElement).reset(); setItems([]); setSelectedSeries(""); }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="takobon-card p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-text-tertiary block mb-1">Serie</label>
          <select name="series_id_display" value={selectedSeries} onChange={handleSeriesChange}
            className="w-full h-10 px-3 rounded-xl border border-border-default bg-bg-elevated text-text-primary text-sm">
            <option value="">Seleziona serie...</option>
            {series.map((s) => (
              <option key={s.id} value={s.id}>{s.title_it ?? s.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-text-tertiary block mb-1">Tipo</label>
          <select name="item_type" value={itemType} onChange={handleTypeChange}
            className="w-full h-10 px-3 rounded-xl border border-border-default bg-bg-elevated text-text-primary text-sm">
            <option value="volume">Volume</option>
            <option value="issue">Numero</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-text-tertiary block mb-1">Numero/Volume</label>
          <select name="item_id" required
            className="w-full h-10 px-3 rounded-xl border border-border-default bg-bg-elevated text-text-primary text-sm">
            <option value="">{loadingItems ? "Caricamento..." : "Seleziona..."}</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                #{i.number}{i.title ? ` — ${i.title}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-text-tertiary block mb-1">Data uscita IT</label>
          <input type="date" name="expected_date"
            className="w-full h-10 px-3 rounded-xl border border-border-default bg-bg-elevated text-text-primary text-sm" />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-text-tertiary block mb-1">Confermata?</label>
          <select name="is_confirmed"
            className="w-full h-10 px-3 rounded-xl border border-border-default bg-bg-elevated text-text-primary text-sm">
            <option value="true">Sì</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-text-tertiary block mb-1">URL fonte (opzionale)</label>
          <input type="url" name="source_url" placeholder="https://..."
            className="w-full h-10 px-3 rounded-xl border border-border-default bg-bg-elevated text-text-primary text-sm placeholder:text-text-tertiary" />
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-green-400">Aggiunto!</p>}

      <button type="submit" disabled={isPending}
        className="flex items-center gap-2 h-9 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors cursor-pointer">
        {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
        Aggiungi uscita
      </button>
    </form>
  );
}
