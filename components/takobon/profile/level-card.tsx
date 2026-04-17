import { type CollectorLevel } from "@/lib/badges";
import { cn } from "@/lib/utils";

const rarityColors: Record<number, string> = {
  1: "from-zinc-600 to-zinc-500",
  2: "from-indigo-600 to-indigo-400",
  3: "from-violet-600 to-purple-400",
  4: "from-amber-600 to-yellow-400",
  5: "from-orange-600 to-amber-400",
  6: "from-rose-600 to-pink-400",
  7: "from-yellow-500 to-amber-300",
};

export function LevelCard({ level, totalOwned }: { level: CollectorLevel; totalOwned: number }) {
  const gradient = rarityColors[level.level] ?? rarityColors[1];
  const pct = level.xpForNext ? Math.min(100, Math.round((level.xp / level.xpForNext) * 100)) : 100;

  return (
    <div className="takobon-card px-5 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-text-tertiary font-medium">Livello {level.level}</p>
          <p className={cn("text-xl font-semibold bg-gradient-to-r bg-clip-text text-transparent", gradient)}>
            {level.title}
          </p>
        </div>
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br text-2xl font-bold text-white shadow-lg", gradient)}>
          {level.level}
        </div>
      </div>

      {level.xpForNext !== null ? (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-text-tertiary">
            <span>{level.xp} / {level.xpForNext} albi</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", gradient)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-text-tertiary">
            {level.xpForNext - level.xp} albi al livello {level.level + 1}
          </p>
        </div>
      ) : (
        <p className="text-xs text-text-tertiary">Hai raggiunto il livello massimo con {totalOwned} albi!</p>
      )}
    </div>
  );
}
