"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string | null | undefined;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

function colorFromString(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return { from: `hsl(${h},45%,20%)`, to: `hsl(${(h + 40) % 360},45%,12%)` };
}

function initials(s: string) {
  return s.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
}

export function CoverImage({ src, alt, sizes, className, priority }: Props) {
  const [error, setError] = useState(false);
  const { from, to } = colorFromString(alt);

  if (!src || error) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
      >
        <span className="text-white/50 font-semibold text-sm select-none tracking-wide">
          {initials(alt)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={cn("object-cover", className)}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}
