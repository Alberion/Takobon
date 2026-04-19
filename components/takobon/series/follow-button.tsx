"use client";

import { useOptimistic, useTransition } from "react";
import { BookMarked, Loader2 } from "lucide-react";
import { followSeries, unfollowSeries } from "@/app/actions/collection";
import { cn } from "@/lib/utils";

type Props = { seriesId: string; seriesSlug: string; isFollowing: boolean };

export function FollowButton({ seriesId, seriesSlug, isFollowing }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(isFollowing);

  function handleClick() {
    startTransition(async () => {
      setOptimisticFollowing(!optimisticFollowing);
      if (optimisticFollowing) await unfollowSeries(seriesId, seriesSlug);
      else await followSeries(seriesId, seriesSlug);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer",
        optimisticFollowing
          ? "bg-indigo-500 border-indigo-500 text-white hover:bg-indigo-600 hover:border-indigo-600"
          : "bg-bg-elevated border-border-default text-text-secondary hover:border-indigo-500/50 hover:text-indigo-300"
      )}
    >
      {isPending
        ? <Loader2 className="size-3.5 animate-spin" />
        : <BookMarked className="size-3.5" strokeWidth={1.5} />
      }
      {optimisticFollowing ? "Seguita" : "Segui"}
    </button>
  );
}
