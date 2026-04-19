"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import { addSeries } from "@/app/actions/admin";

type Publisher = { id: string; name: string; slug: string };

export function SeriesForm({ publishers }: { publishers: Publisher[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await addSeries(fd);
      if (result?.error) setError(result.error);
      else { setSuccess(`Serie aggiunta! Slug: ${result.slug}`); (e.target as HTMLFormElement).reset(); }
    });
  }

  const inputClass = "w-full h-10 px-3 rounded-xl border border-border-default bg-bg-elevated text-text-primary text-sm placeholder:text-text-tertiary";
  const labelClass = "text-[10px] uppercase tracking-widest text-text-tertiary block mb-1";

  return (
    <form onSubmit={handleSubmit} className="takobon-card p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Titolo originale *</label>
          <input name="title" required placeholder="Attack on Titan" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Titolo italiano</label>
          <input name="title_it" placeholder="L'Attacco dei Giganti" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tipo *</label>
          <select name="type" required className={inputClass}>
            <option value="manga">Manga</option>
            <option value="comic">Fumetto</option>
            <option value="graphic_novel">Graphic Novel</option>
            <option value="bd">BD</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Stato *</label>
          <select name="status" required className={inputClass}>
            <option value="ongoing">In corso</option>
            <option value="completed">Completa</option>
            <option value="cancelled">Cancellata</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Editore</label>
          <select name="publisher_slug" className={inputClass}>
            <option value="">Nessuno</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.slug}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Anno inizio</label>
          <input name="start_year" type="number" placeholder="2009" className={inputClass} />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>URL copertina</label>
          <input name="cover_url" type="url" placeholder="https://..." className={inputClass} />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Descrizione (italiano)</label>
          <textarea name="description_it" rows={3} placeholder="Breve descrizione della serie..."
            className="w-full px-3 py-2 rounded-xl border border-border-default bg-bg-elevated text-text-primary text-sm placeholder:text-text-tertiary resize-none" />
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-green-400">{success}</p>}

      <button type="submit" disabled={isPending}
        className="flex items-center gap-2 h-9 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors cursor-pointer">
        {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
        Aggiungi serie
      </button>
    </form>
  );
}
