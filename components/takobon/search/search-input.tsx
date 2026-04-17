"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const query = searchParams.get("q") ?? "";

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.value = query;
    }
  }, [query]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (timerRef.current) clearTimeout(timerRef.current);
    const val = e.target.value;
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (val) params.set("q", val);
      else params.delete("q");
      startTransition(() => router.replace(`${pathname}?${params}`));
    }, 300);
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = "";
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    startTransition(() => router.replace(`${pathname}?${params}`));
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
        {isPending
          ? <Loader2 className="size-4 text-text-tertiary animate-spin" />
          : <Search className="size-4 text-text-tertiary" strokeWidth={1.5} />
        }
      </div>
      <input
        ref={inputRef}
        type="search"
        defaultValue={query}
        onChange={handleChange}
        placeholder="Cerca serie, manga, autori..."
        autoFocus
        className="w-full h-12 bg-bg-elevated border border-border-default rounded-xl pl-11 pr-11 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-4 flex items-center text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
          aria-label="Cancella ricerca"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
