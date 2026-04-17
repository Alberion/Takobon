import Link from "next/link";
import { BookOpen } from "lucide-react";

export function EmptyCollection() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Atmospheric glow */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl scale-150" />
        <div className="relative w-20 h-20 rounded-2xl bg-bg-elevated border border-border-default flex items-center justify-center">
          <BookOpen className="size-8 text-indigo-400" strokeWidth={1.5} />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-text-primary mb-2">
        Il tuo archivio è vuoto
      </h2>
      <p className="text-sm text-text-secondary max-w-xs leading-relaxed mb-8">
        Aggiungi la tua prima serie e inizia a costruire la tua collezione.
      </p>

      <Link
        href="/search"
        className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors duration-150 cursor-pointer"
      >
        Cerca una serie
      </Link>
    </div>
  );
}
