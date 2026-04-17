"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  backHref?: string;
  transparent?: boolean;
};

export function PageHeader({ title, backHref, transparent = false }: Props) {
  const router = useRouter();

  function handleBack() {
    if (backHref) router.push(backHref);
    else router.back();
  }

  return (
    <header className={cn(
      "sticky top-0 z-10 flex items-center gap-3 h-14 px-4",
      transparent
        ? "bg-transparent"
        : "bg-background/90 backdrop-blur-md border-b border-border-subtle"
    )}>
      <button
        onClick={handleBack}
        className="flex items-center justify-center size-9 rounded-xl bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong transition-all duration-150 cursor-pointer shrink-0"
        aria-label="Indietro"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} />
      </button>
      {title && (
        <h1 className="text-sm font-medium text-text-primary truncate">{title}</h1>
      )}
    </header>
  );
}
