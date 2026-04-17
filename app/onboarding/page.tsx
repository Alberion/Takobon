"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";

const GENRES = [
  { id: "manga",         label: "Manga" },
  { id: "marvel",        label: "Marvel" },
  { id: "dc",            label: "DC Comics" },
  { id: "bonelli",       label: "Bonelli" },
  { id: "graphic_novel", label: "Graphic Novel" },
  { id: "bd",            label: "Bande Dessinée" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-4 bg-bg-base">
      <div className="w-full max-w-sm space-y-8">

        {/* Step 1 — Interests */}
        {step === 1 && (
          <>
            <div className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <BookOpen className="size-7 text-indigo-400" strokeWidth={1.5} />
                </div>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                Benvenuto su Takobon
              </h1>
              <p className="text-sm text-text-secondary">
                Cosa collezzioni? Scegli i tuoi interessi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => toggle(g.id)}
                  className={`relative h-12 rounded-xl border text-sm font-medium transition-all duration-150 ${
                    selected.has(g.id)
                      ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-300"
                      : "bg-bg-elevated border-border-default text-text-secondary hover:border-indigo-500/30"
                  }`}
                >
                  {selected.has(g.id) && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-indigo-400" strokeWidth={2} />
                  )}
                  {g.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={selected.size === 0}
              className="w-full h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              Continua
              <ArrowRight className="size-4" strokeWidth={2} />
            </button>
          </>
        )}

        {/* Step 2 — Done */}
        {step === 2 && (
          <>
            <div className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-state-owned/20 border border-state-owned/30 flex items-center justify-center">
                  <Sparkles className="size-7 text-state-owned" strokeWidth={1.5} />
                </div>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                Tutto pronto!
              </h1>
              <p className="text-sm text-text-secondary">
                Il tuo archivio ti aspetta. Inizia cercando la tua prima serie.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/search"
                className="w-full h-12 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <BookOpen className="size-4" strokeWidth={1.5} />
                Cerca una serie
              </Link>
              <Link
                href="/dashboard"
                className="w-full h-12 rounded-xl border border-border-default text-text-secondary hover:text-text-primary hover:border-indigo-500/30 transition-colors flex items-center justify-center text-sm font-medium"
              >
                Vai alla dashboard
              </Link>
            </div>
          </>
        )}

        {/* Step indicator */}
        <div className="flex justify-center gap-2">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? "w-6 bg-indigo-500" : "w-1.5 bg-border-subtle"}`} />
          ))}
        </div>
      </div>
    </main>
  );
}
