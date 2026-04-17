import { type Badge } from "@/lib/badges";
import { cn } from "@/lib/utils";

const rarityStyles: Record<Badge["rarity"], string> = {
  common:    "border-border-subtle bg-bg-elevated",
  rare:      "border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_12px_rgba(99,102,241,0.2)]",
  epic:      "border-violet-500/50 bg-violet-500/10 shadow-[0_0_12px_rgba(139,92,246,0.25)]",
  legendary: "border-amber-500/50 bg-amber-500/10 shadow-[0_0_16px_rgba(245,158,11,0.3)]",
};

const rarityLabel: Record<Badge["rarity"], string> = {
  common: "Comune", rare: "Raro", epic: "Epico", legendary: "Leggendario",
};

const rarityTextColor: Record<Badge["rarity"], string> = {
  common: "text-text-tertiary",
  rare: "text-indigo-400",
  epic: "text-violet-400",
  legendary: "text-amber-400",
};

export function BadgeGrid({ badges }: { badges: Badge[] }) {
  const earned = badges.filter((b) => b.earned);
  const nextLocked = badges.find((b) => !b.earned);

  if (earned.length === 0 && !nextLocked) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs uppercase tracking-widest text-text-tertiary font-medium">Obiettivi</h2>
        <span className="text-xs text-text-tertiary">{earned.length}/{badges.length} sbloccati</span>
      </div>

      {earned.length === 0 ? (
        <p className="text-xs text-text-tertiary px-1">Aggiungi il tuo primo fumetto per sbloccare il primo obiettivo.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {earned.map((badge) => (
            <EarnedBadge key={badge.id} badge={badge} />
          ))}

          {/* Next locked — Pokédex silhouette */}
          {nextLocked && <SilhouetteBadge badge={nextLocked} />}
        </div>
      )}
    </div>
  );
}

function EarnedBadge({ badge }: { badge: Badge }) {
  return (
    <div className={cn(
      "rounded-2xl border p-3 flex flex-col items-center gap-1.5 text-center transition-all",
      rarityStyles[badge.rarity]
    )}>
      <span className="text-2xl">{badge.icon}</span>
      <p className="text-[10px] font-medium text-text-primary leading-tight">{badge.name}</p>
      <span className={cn("text-[9px] uppercase tracking-wide font-medium", rarityTextColor[badge.rarity])}>
        {rarityLabel[badge.rarity]}
      </span>
    </div>
  );
}

function SilhouetteBadge({ badge }: { badge: Badge }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-3 flex flex-col items-center gap-1.5 text-center relative overflow-hidden">
      {/* Blurred icon silhouette */}
      <span className="text-2xl blur-sm brightness-0 invert opacity-20 select-none">{badge.icon}</span>
      <p className="text-[10px] font-medium text-text-tertiary leading-tight">???</p>
      <p className="text-[9px] text-text-tertiary leading-tight opacity-70 line-clamp-2">{badge.description}</p>
    </div>
  );
}
