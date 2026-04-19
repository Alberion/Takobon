"use client";

import { useOptimistic, useTransition, useState, useCallback } from "react";
import { Loader2, BookMarked } from "lucide-react";
import { followSeries, unfollowSeries } from "@/app/actions/collection";
import { cn } from "@/lib/utils";

type Props = { seriesId: string; seriesSlug: string; isFollowing: boolean };

export function FollowButton({ seriesId, seriesSlug, isFollowing }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(isFollowing);
  const [animKey, setAnimKey] = useState(0);

  const handleClick = useCallback(() => {
    if (optimisticFollowing) {
      startTransition(async () => {
        setOptimisticFollowing(false);
        await unfollowSeries(seriesId, seriesSlug);
      });
      return;
    }
    // Increment key to re-mount animated elements, retriggering CSS animations
    setAnimKey(k => k + 1);
    startTransition(async () => {
      setOptimisticFollowing(true);
      await followSeries(seriesId, seriesSlug);
    });
  }, [optimisticFollowing, seriesId, seriesSlug, setOptimisticFollowing]);

  return (
    <button
      key={animKey > 0 && optimisticFollowing ? `pop-${animKey}` : "idle"}
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "relative inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium cursor-pointer select-none transition-colors duration-150",
        animKey > 0 && optimisticFollowing && "follow-pop follow-ring",
        optimisticFollowing
          ? "bg-indigo-500 border-indigo-500 text-white hover:bg-indigo-600"
          : "bg-bg-elevated border-border-default text-text-secondary hover:border-indigo-500/50 hover:text-indigo-300"
      )}
    >
      <span
        key={`icon-${animKey}`}
        className={cn("flex items-center", animKey > 0 && optimisticFollowing && "icon-bounce")}
      >
        {isPending
          ? <Loader2 className="size-3.5 animate-spin" />
          : <BookMarked className="size-3.5" strokeWidth={optimisticFollowing ? 2.5 : 1.5} fill={optimisticFollowing ? "currentColor" : "none"} />
        }
      </span>
      <span>{optimisticFollowing ? "Seguita" : "Segui"}</span>
    </button>
  );
}
