"use client";

import { useTransition } from "react";
import { Check, Heart, Circle, X, Loader2 } from "lucide-react";
import { setItemStatus, type ItemStatus } from "@/app/actions/collection";
import { cn } from "@/lib/utils";

type Props = {
  itemType: "issue" | "volume";
  itemId: string;
  currentStatus: ItemStatus | null;
  seriesSlug: string;
};

const options: { status: ItemStatus; label: string; icon: typeof Check; active: string; idle: string }[] = [
  { status: "owned",   label: "Posseduto", icon: Check,  active: "bg-state-owned/15 text-state-owned border-state-owned/40",   idle: "text-text-tertiary hover:text-state-owned hover:border-state-owned/30" },
  { status: "wished",  label: "Wishlist",  icon: Heart,  active: "bg-state-wished/15 text-state-wished border-state-wished/40", idle: "text-text-tertiary hover:text-state-wished hover:border-state-wished/30" },
  { status: "missing", label: "Mancante", icon: Circle,  active: "bg-state-missing/15 text-state-missing border-state-missing/40", idle: "text-text-tertiary hover:text-state-missing hover:border-state-missing/30" },
];

export function ItemStatusSelector({ itemType, itemId, currentStatus, seriesSlug }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick(status: ItemStatus) {
    startTransition(async () => {
      // Clicking the active status removes it
      const next = currentStatus === status ? null : status;
      await setItemStatus(itemType, itemId, next, seriesSlug);
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      {isPending ? (
        <Loader2 className="size-3.5 text-text-tertiary animate-spin" />
      ) : (
        options.map(({ status, label, icon: Icon, active, idle }) => (
          <button
            key={status}
            onClick={() => handleClick(status)}
            aria-label={label}
            title={label}
            className={cn(
              "flex items-center justify-center size-7 rounded-lg border transition-all duration-150 cursor-pointer",
              currentStatus === status ? active : idle + " border-border-subtle"
            )}
          >
            <Icon className="size-3.5" strokeWidth={currentStatus === status ? 2.5 : 1.5} />
          </button>
        ))
      )}
    </div>
  );
}
