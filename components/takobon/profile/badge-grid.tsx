import { type Badge } from "@/lib/badges";
import { cn } from "@/lib/utils";

const rarityStyles: Record<Badge["rarity"], string> = {
  common:    "border-border-subtle bg-bg-elevated",
  rare:      "border-indigo-500/40 bg-indigo-500/10",
  epic:      "border-violet-500/40 bg-violet-500/10",
  legendary: "border-amber-500/40 bg-amber-500/10",
};

const rarityLabel: Record<Badge["rarity"], string> = {
  common:    "Comune",
  rare:      "Raro",
  epic:      "Epico",
  legendary: "Leggendario",
};

export function BadgeGrid({ badges }: { badges: Badge[] }) {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-text-primary">Obiettivi</h2>
        <span className="text-xs text-text-tertiary">{earned.length}/{badges.length} sbloccati</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {earned.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
        {locked.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}

function BadgeItem({ badge }: { badge: Badge }) {
  return (
    <div className={cn(
      "rounded-2xl border p-3 flex flex-col items-center gap-1.5 text-center transition-all",
      badge.earned ? rarityStyles[badge.rarity] : "border-border-subtle bg-bg-elevated opacity-35 grayscale"
    )}>
      <span className="text-2xl">{badge.icon}</span>
      <p className="text-[10px] font-medium text-text-primary leading-tight">{badge.name}</p>
      {badge.earned && (
        <span className={cn(
          "text-[9px] uppercase tracking-wide font-medium",
          badge.rarity === "legendary" ? "text-amber-400" :
          badge.rarity === "epic"      ? "text-violet-400" :
          badge.rarity === "rare"      ? "text-indigo-400" :
          "text-text-tertiary"
        )}>
          {rarityLabel[badge.rarity]}
        </span>
      )}
      {!badge.earned && (
        <p className="text-[9px] text-text-tertiary leading-tight">{badge.description}</p>
      )}
    </div>
  );
}
