"use client";

import { useOptimistic, useTransition, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { followSeries, unfollowSeries } from "@/app/actions/collection";
import { cn } from "@/lib/utils";

type Props = { seriesId: string; seriesSlug: string; isFollowing: boolean };

export function FollowButton({ seriesId, seriesSlug, isFollowing }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(isFollowing);
  const [burst, setBurst] = useState(false);

  function handleClick() {
    if (optimisticFollowing) {
      startTransition(async () => {
        setOptimisticFollowing(false);
        await unfollowSeries(seriesId, seriesSlug);
      });
      return;
    }

    setBurst(true);
    setTimeout(() => setBurst(false), 700);
    startTransition(async () => {
      setOptimisticFollowing(true);
      await followSeries(seriesId, seriesSlug);
    });
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={isPending}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className={cn(
        "relative inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium cursor-pointer select-none",
        optimisticFollowing
          ? "bg-indigo-500 border-indigo-500 text-white"
          : "bg-bg-elevated border-border-default text-text-secondary hover:border-indigo-500/50 hover:text-indigo-300"
      )}
    >
      {/* Ping ring on follow */}
      {burst && (
        <span className="absolute inset-0 rounded-xl bg-indigo-400 animate-ping opacity-60 pointer-events-none" />
      )}

      {/* Icon with spring pop */}
      <motion.span
        animate={burst ? { scale: [1, 1.5, 0.85, 1.1, 1], rotate: [0, -12, 6, 0] } : {}}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex items-center"
      >
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <motion.svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill={optimisticFollowing ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={optimisticFollowing ? { fill: "currentColor" } : { fill: "none" }}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </motion.svg>
        )}
      </motion.span>

      <span>{optimisticFollowing ? "Seguita" : "Segui"}</span>
    </motion.button>
  );
}
