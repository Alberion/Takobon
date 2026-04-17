"use client";

import { useTransition } from "react";
import { BookMarked, Loader2 } from "lucide-react";
import { followSeries, unfollowSeries } from "@/app/actions/collection";
import { cn } from "@/lib/utils";

type Props = { seriesId: string; seriesSlug: string; isFollowing: boolean };

export function FollowButton({ seriesId, seriesSlug, isFollowing }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (isFollowing) await unfollowSeries(seriesId, seriesSlug);
      else await followSeries(seriesId, seriesSlug);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer",
        isFollowing
          ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/20"
          : "bg-bg-elevated border-border-default text-text-secondary hover:border-indigo-500/40 hover:text-indigo-300"
      )}
    >
      {isPending
        ? <Loader2 className="size-3.5 animate-spin" />
        : <BookMarked className="size-3.5" strokeWidth={1.5} />
      }
      {isFollowing ? "Seguita" : "Segui"}
    </button>
  );
}
