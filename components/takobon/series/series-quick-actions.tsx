"use client";

import { useTransition } from "react";
import { Check, Heart, Circle, Trash2, Loader2 } from "lucide-react";
import { setAllItemsStatus, type ItemStatus } from "@/app/actions/collection";
import { cn } from "@/lib/utils";

type Props = {
  seriesId: string;
  seriesSlug: string;
  owned: number;
  wished: number;
  missing: number;
};

export function SeriesQuickActions({ seriesId, seriesSlug, owned, wished, missing }: Props) {
  const [isPending, startTransition] = useTransition();
  const hasAny = owned + wished + missing > 0;

  function handle(status: ItemStatus | null, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await setAllItemsStatus(seriesId, seriesSlug, status);
    });
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-2">
        <Loader2 className="size-4 text-text-tertiary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 pt-2 border-t border-border-subtle mt-2">
      <ActionBtn
        onClick={(e) => handle("owned", e)}
        active={owned > 0}
        activeStyle="bg-state-owned/15 text-state-owned border-state-owned/40"
        idleStyle="text-text-tertiary hover:text-state-owned hover:border-state-owned/30"
        label="Tutti posseduti"
        count={owned > 0 ? owned : undefined}
      >
        <Check className="size-3" strokeWidth={owned > 0 ? 2.5 : 1.5} />
      </ActionBtn>

      <ActionBtn
        onClick={(e) => handle("wished", e)}
        active={wished > 0}
        activeStyle="bg-state-wished/15 text-state-wished border-state-wished/40"
        idleStyle="text-text-tertiary hover:text-state-wished hover:border-state-wished/30"
        label="Tutti wishlist"
        count={wished > 0 ? wished : undefined}
      >
        <Heart className="size-3" strokeWidth={wished > 0 ? 2.5 : 1.5} />
      </ActionBtn>

      <ActionBtn
        onClick={(e) => handle("missing", e)}
        active={missing > 0}
        activeStyle="bg-state-missing/15 text-state-missing border-state-missing/40"
        idleStyle="text-text-tertiary hover:text-state-missing hover:border-state-missing/30"
        label="Tutti mancanti"
        count={missing > 0 ? missing : undefined}
      >
        <Circle className="size-3" strokeWidth={missing > 0 ? 2.5 : 1.5} />
      </ActionBtn>

      {hasAny && (
        <button
          onClick={(e) => handle(null, e)}
          title="Rimuovi tutti"
          className="ml-auto flex items-center justify-center size-6 rounded-lg border border-transparent text-text-tertiary hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-150 cursor-pointer"
        >
          <Trash2 className="size-3" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

function ActionBtn({
  children, onClick, active, activeStyle, idleStyle, label, count,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  active: boolean;
  activeStyle: string;
  idleStyle: string;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "flex items-center gap-1 h-6 px-2 rounded-lg border text-[10px] font-medium transition-all duration-150 cursor-pointer",
        active ? activeStyle : idleStyle + " border-border-subtle"
      )}
    >
      {children}
      {count !== undefined && <span className="font-mono tabular-nums">{count}</span>}
      {count === undefined && <span className="hidden sm:inline">{label.split(" ")[0]}</span>}
    </button>
  );
}
