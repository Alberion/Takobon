import { type CollectorLevel } from "@/lib/badges";
import { cn } from "@/lib/utils";

const levelConfig: Record<number, { gradient: string; glow: string; shadow: string }> = {
  1: { gradient: "from-zinc-500 to-zinc-400",     glow: "from-zinc-500 to-zinc-400",     shadow: "shadow-[0_0_16px_rgba(113,113,122,0.3)]"  },
  2: { gradient: "from-indigo-600 to-indigo-400", glow: "from-indigo-600 to-indigo-400", shadow: "shadow-[0_0_20px_rgba(99,102,241,0.5)]"    },
  3: { gradient: "from-violet-600 to-purple-400", glow: "from-violet-600 to-purple-400", shadow: "shadow-[0_0_20px_rgba(139,92,246,0.5)]"    },
  4: { gradient: "from-cyan-600 to-teal-400",     glow: "from-cyan-600 to-teal-400",     shadow: "shadow-[0_0_20px_rgba(8,145,178,0.45)]"   },
  5: { gradient: "from-fuchsia-600 to-pink-400",  glow: "from-fuchsia-600 to-pink-400",  shadow: "shadow-[0_0_20px_rgba(192,38,211,0.5)]"   },
  6: { gradient: "from-rose-600 to-orange-400",   glow: "from-rose-600 to-orange-400",   shadow: "shadow-[0_0_20px_rgba(225,29,72,0.45)]"   },
  7: { gradient: "from-yellow-400 to-amber-300",  glow: "from-yellow-400 to-amber-300",  shadow: "shadow-[0_0_24px_rgba(251,191,36,0.6)]"   },
};

export function LevelCard({ level, totalOwned }: { level: CollectorLevel; totalOwned: number }) {
  const cfg = levelConfig[level.level] ?? levelConfig[1];
  const pct = level.xpForNext ? Math.min(100, Math.round((level.xp / level.xpForNext) * 100)) : 100;

  return (
    <div className="takobon-card px-5 py-4 space-y-3 overflow-hidden relative">
      {/* Subtle neon background glow */}
      <div className={cn("absolute -top-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br opacity-10 blur-2xl pointer-events-none", cfg.gradient)} />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-text-tertiary font-medium">Livello {level.level}</p>
          <p className={cn("text-xl font-semibold bg-gradient-to-r bg-clip-text text-transparent", cfg.gradient)}>
            {level.title}
          </p>
        </div>
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br text-2xl font-bold text-white",
          cfg.gradient, cfg.shadow
        )}>
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
              className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", cfg.gradient)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-text-tertiary">
            {level.xpForNext - level.xp} albi al livello {level.level + 1}
          </p>
        </div>
      ) : (
        <p className="text-xs text-text-tertiary">Livello massimo — {totalOwned} albi collezionati.</p>
      )}
    </div>
  );
}
