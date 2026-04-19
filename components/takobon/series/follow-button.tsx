"use client";

import { useOptimistic, useTransition, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { followSeries, unfollowSeries } from "@/app/actions/collection";
import { cn } from "@/lib/utils";

type Props = { seriesId: string; seriesSlug: string; isFollowing: boolean };

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: (i / 8) * 360,
}));

export function FollowButton({ seriesId, seriesSlug, isFollowing }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(isFollowing);
  const burstKey = useRef(0);
  const [showBurst, setShowBurst] = useState(false);

  function handleClick() {
    if (optimisticFollowing) {
      // Unfollow — no animation needed
      startTransition(async () => {
        setOptimisticFollowing(false);
        await unfollowSeries(seriesId, seriesSlug);
      });
      return;
    }

    burstKey.current++;
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 600);
    startTransition(async () => {
      setOptimisticFollowing(true);
      await followSeries(seriesId, seriesSlug);
    });
  }

  return (
    <div className="relative inline-flex">
      {/* Particle burst */}
      <AnimatePresence>
        {showBurst && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {PARTICLES.map((p) => {
              const rad = (p.angle * Math.PI) / 180;
              const tx = Math.cos(rad) * 28;
              const ty = Math.sin(rad) * 28;
              return (
                <motion.span
                  key={`${burstKey.current}-${p.id}`}
                  className="absolute w-1.5 h-1.5 rounded-full bg-indigo-400"
                  initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  animate={{ opacity: 0, scale: 0, x: tx, y: ty }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        disabled={isPending}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "relative inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium cursor-pointer overflow-hidden",
          optimisticFollowing
            ? "bg-indigo-500 border-indigo-500 text-white hover:bg-indigo-600 hover:border-indigo-600"
            : "bg-bg-elevated border-border-default text-text-secondary hover:border-indigo-500/50 hover:text-indigo-300"
        )}
      >
        {/* Ripple fill on follow */}
        <AnimatePresence>
          {optimisticFollowing && (
            <motion.span
              key="fill"
              className="absolute inset-0 bg-indigo-500 rounded-xl"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ originX: "50%", originY: "50%" }}
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        <motion.span
          animate={optimisticFollowing ? { rotate: [0, -15, 8, 0], scale: [1, 1.3, 0.95, 1] } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 flex items-center"
        >
          {isPending
            ? <Loader2 className="size-3.5 animate-spin" />
            : (
              <svg className="size-3.5" viewBox="0 0 24 24" fill={optimisticFollowing ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            )
          }
        </motion.span>

        <span className="relative z-10">
          {optimisticFollowing ? "Seguita" : "Segui"}
        </span>
      </motion.button>
    </div>
  );
}
